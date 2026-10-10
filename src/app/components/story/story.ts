import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { MorphScene } from '../../immersive/morph-scene';

interface Pillar {
  verb: string;
  title: string;
  lead: string;
  caseId: string;
  metric: { value: string; label: string };
}

/** Centro de cada panel en el progreso del scroll (0..1). */
const CENTERS = [0.0, 0.3, 0.58, 0.86];
/** Semiancho en el que el panel está plenamente visible / desaparece. */
const HOLD = 0.06;
const FADE = 0.17;

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const smooth = (v: number): number => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './story.html',
  styleUrl: './story.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('section', { static: true }) private section!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly active = signal(0);
  protected readonly sceneReady = signal(false);
  protected readonly touched = signal(false);
  protected readonly dragging = signal(false);

  private scene: MorphScene | null = null;
  private panels: HTMLElement[] = [];
  private rail: HTMLElement | null = null;
  private target = 0;
  private shown = 0;
  private reduce = false;
  private raf = 0;
  private last = 0;

  protected readonly pillars: Pillar[] = [
    {
      verb: 'Reconoce',
      title: 'Acceso facial que sobrevive a la realidad.',
      lead: 'Terminales Hikvision integrados a software propio. En producción con dos empresas sobre el mismo terminal.',
      caseId: 'acceso',
      metric: { value: '26.500 → 560', label: 'registros por importación de saldos' },
    },
    {
      verb: 'Cobra',
      title: 'Pagos que nadie puede alterar.',
      lead: 'Mercado Pago de punta a punta: el monto lo decide el servidor, nunca el navegador.',
      caseId: 'pagos',
      metric: { value: '0 %', label: 'comisión por transacción' },
    },
    {
      verb: 'Decide',
      title: 'IA que consulta, no que inventa.',
      lead: 'Agentes con n8n que consultan datos reales y dejan auditoría. En producción en la Municipalidad de Pilar.',
      caseId: 'ia',
      metric: { value: '~8.000', label: 'tokens por consulta, frente a más de 1.500.000 sin límites' },
    },
  ];

  protected readonly railItems = ['Inicio', 'Reconoce', 'Cobra', 'Decide'];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
    const root = this.section.nativeElement;
    this.panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'));
    this.rail = root.querySelector<HTMLElement>('[data-rail]');

    this.zone.runOutsideAngular(async () => {
      const { MorphScene } = await import('../../immersive/morph-scene');
      const scene = await MorphScene.create(this.canvas.nativeElement, {
        count: small ? 4500 : 9000,
        animate: !this.reduce,
        parallax: !small && !this.reduce,
      });
      if (!scene) return;
      this.scene = scene;
      this.zone.run(() => this.sceneReady.set(true));
      this.apply();
    });

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    const stage = root.querySelector<HTMLElement>('.story__stage');
    this.stage = stage;
    if (stage) {
      stage.addEventListener('pointerdown', this.onDown);
      stage.addEventListener('pointermove', this.onMove);
      stage.addEventListener('pointerup', this.onUp);
      stage.addEventListener('pointercancel', this.onUp);
      stage.addEventListener('wheel', this.onWheel, { passive: false });
    }
    this.onScroll();
    this.shown = this.target;
    this.apply();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    if (this.stage) {
      this.stage.removeEventListener('pointerdown', this.onDown);
      this.stage.removeEventListener('pointermove', this.onMove);
      this.stage.removeEventListener('pointerup', this.onUp);
      this.stage.removeEventListener('pointercancel', this.onUp);
      this.stage.removeEventListener('wheel', this.onWheel);
    }
    cancelAnimationFrame(this.raf);
    this.scene?.dispose();
  }

  protected goPanel(i: number): void {
    const el = this.section.nativeElement;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + CENTERS[i] * total, behavior: this.reduce ? 'auto' : 'smooth' });
  }

  protected go(id: string, event: Event): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: this.reduce ? 'auto' : 'smooth', block: 'start' });
  }

  private stage: HTMLElement | null = null;
  private dragId: number | null = null;
  private lastX = 0;

  private markTouched(): void {
    if (this.touched()) return;
    this.zone.run(() => this.touched.set(true));
  }

  /** Arrastre con mouse o dedo sobre la escena (no sobre el texto ni los controles). */
  private onDown = (e: PointerEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, .panel, .rail')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.dragId = e.pointerId;
    this.lastX = e.clientX;
    this.stage?.setPointerCapture(e.pointerId);
    this.scene?.beginDrag();
    this.zone.run(() => this.dragging.set(true));
  };

  private onMove = (e: PointerEvent): void => {
    if (this.dragId !== e.pointerId) return;
    const dx = e.clientX - this.lastX;
    this.lastX = e.clientX;
    if (dx !== 0) {
      this.scene?.rotateBy(dx * 0.0085);
      this.markTouched();
    }
  };

  private onUp = (e: PointerEvent): void => {
    if (this.dragId !== e.pointerId) return;
    this.dragId = null;
    this.scene?.endDrag();
    this.zone.run(() => this.dragging.set(false));
  };

  /** Gesto horizontal del trackpad: gira. El vertical sigue siendo scroll normal. */
  private onWheel = (e: WheelEvent): void => {
    const ax = Math.abs(e.deltaX);
    const ay = Math.abs(e.deltaY);
    if (ax < 2 || ax < ay * 1.3) return;
    e.preventDefault();
    this.scene?.rotateBy(-e.deltaX * 0.0045);
    this.markTouched();
  };

  private onScroll = (): void => {
    const rect = this.section.nativeElement.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    this.target = total > 0 ? clamp01(-rect.top / total) : 0;
    if (this.reduce) {
      this.shown = this.target;
      this.apply();
    } else if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.step);
    }
  };

  /** Suaviza el progreso mostrado hacia el real (inercia independiente del framerate). */
  private step = (now: number): void => {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const k = 1 - Math.exp(-dt * 7);
    this.shown += (this.target - this.shown) * k;
    if (Math.abs(this.target - this.shown) < 0.0004) this.shown = this.target;
    this.apply();
    this.raf = this.shown === this.target ? 0 : requestAnimationFrame(this.step);
  };

  private apply(): void {
    const p = this.shown;

    // Forma: marca → terminal → tarjeta → red, con ventanas centradas entre paneles.
    const morph = smooth((p - 0.07) / 0.16) + smooth((p - 0.36) / 0.16) + smooth((p - 0.64) / 0.16);
    this.scene?.setProgress(morph, p * 0.9);

    // Texto: opacidad y desplazamiento ligados al progreso.
    let nearest = 0;
    let best = Infinity;
    this.panels.forEach((el, i) => {
      const d = p - CENTERS[i];
      const ad = Math.abs(d);
      // El último panel permanece visible hasta el final del recorrido.
      const keep = i === CENTERS.length - 1 && d > 0;
      const vis = keep ? 1 : 1 - smooth((ad - HOLD) / (FADE - HOLD));
      el.style.opacity = vis.toFixed(3);
      el.style.transform = `translate3d(0, ${(keep ? 0 : -Math.max(-1, Math.min(1, d / FADE)) * 36).toFixed(1)}px, 0)`;
      el.style.pointerEvents = vis > 0.6 ? 'auto' : 'none';
      if (ad < best) {
        best = ad;
        nearest = i;
      }
    });

    if (nearest !== this.active()) this.zone.run(() => this.active.set(nearest));
    if (this.rail) this.rail.style.setProperty('--p', p.toFixed(3));
  }
}
