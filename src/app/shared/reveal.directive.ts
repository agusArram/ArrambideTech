import { Directive, ElementRef, Input, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Aparición suave al entrar en pantalla (opacidad + desplazamiento con easing largo).
 * Uso: `<div appReveal>` o `<div [appReveal]="i * 80">` para escalonar (ms).
 * Sin JS, con `prefers-reduced-motion` o si el navegador no soporta IntersectionObserver,
 * el contenido se muestra sin animar.
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  @Input() appReveal: number | '' = 0;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private io?: IntersectionObserver;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return;

    this.el.classList.add('rv');
    this.el.style.setProperty('--rv-d', `${Number(this.appReveal) || 0}ms`);
    this.io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.el.classList.add('is-in');
        this.io?.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    this.io.observe(this.el);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
