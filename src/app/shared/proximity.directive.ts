import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Efecto sutil de cercanía en títulos: las letras cercanas al puntero "se engrosan" apenas.
 * Se resuelve con un contorno finísimo (no cambia el ancho de las letras, así que el texto no tiembla).
 * Solo con mouse (hover fino) y sin `prefers-reduced-motion`.
 */
@Directive({ selector: '[appProximity]', standalone: true })
export class ProximityDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private letters: HTMLElement[] = [];
  private last: PointerEvent | null = null;
  private raf = 0;
  private active = false;

  private readonly onMove = (e: PointerEvent): void => {
    this.last = e;
    if (!this.raf) this.raf = requestAnimationFrame(this.update);
  };

  private readonly onLeave = (): void => this.reset();

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    this.prepare();
    if (!this.letters.length) return;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.onLeave);
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    window.removeEventListener('pointermove', this.onMove);
    document.documentElement.removeEventListener('pointerleave', this.onLeave);
    cancelAnimationFrame(this.raf);
  }

  /** Usa las letras ya partidas (titular del hero) o parte el texto en palabras y letras. */
  private prepare(): void {
    const existing = this.el.querySelectorAll<HTMLElement>('.display__c');
    if (existing.length) {
      this.letters = Array.from(existing);
      return;
    }
    const walker = document.createTreeWalker(this.el, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) {
      const n = walker.currentNode as Text;
      if (n.textContent && n.textContent.trim()) nodes.push(n);
    }
    for (const node of nodes) {
      const frag = document.createDocumentFragment();
      for (const part of (node.textContent ?? '').split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const w = document.createElement('span');
        w.className = 'prox-w';
        for (const ch of part) {
          const c = document.createElement('span');
          c.className = 'prox-c';
          c.textContent = ch;
          w.appendChild(c);
          this.letters.push(c);
        }
        frag.appendChild(w);
      }
      node.parentNode?.replaceChild(frag, node);
    }
    this.el.setAttribute('aria-label', this.el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  }

  private readonly update = (): void => {
    this.raf = 0;
    const e = this.last;
    if (!e) return;
    const box = this.el.getBoundingClientRect();
    const pad = 120;
    const near =
      e.clientX > box.left - pad && e.clientX < box.right + pad && e.clientY > box.top - pad && e.clientY < box.bottom + pad;
    if (!near) {
      if (this.active) this.reset();
      return;
    }
    this.active = true;
    const sigma = 64;
    for (const l of this.letters) {
      const r = l.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) * 1.1;
      const p = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
      l.style.setProperty('--p', p.toFixed(3));
    }
  };

  private reset(): void {
    this.active = false;
    for (const l of this.letters) l.style.setProperty('--p', '0');
  }
}
