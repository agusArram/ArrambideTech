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
  where: string;
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
/** smootherstep: arranque y llegada más suaves que smoothstep. */
const smooth = (v: number): number => {
  const x = clamp01(v);
  return x * x * x * (x * (x * 6 - 15) + 10);
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
  @ViewChild('zone', { static: true }) private hitZone!: ElementRef<HTMLElement>;

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
      verb: 'Reconocen',
      where: 'Marinas del Paraná Guazú',
      title: 'Que entre solo quien debe entrar.',
      lead: 'Reconoce a cada persona y abre solo a quien corresponde.',
      caseId: 'acceso',
      metric: { value: '2 en 1', label: 'dos empresas, un solo equipo, cero datos mezclados' },
    },
    {
      verb: 'Deciden',
      where: 'Hospital Central de Pilar',
      title: 'Tu equipo pregunta, el sistema responde.',
      lead: 'Un asistente de IA que contesta por chat con tus datos reales.',
      caseId: 'ia',
      metric: { value: '100 %', label: 'de las consultas quedan registradas' },
    },
    {
      verb: 'Cobran',
      where: 'La Ñata · Demode',
      title: 'Se cobra solo, sin perseguir pagos.',
      lead: 'El cliente paga en el momento y el dinero va directo a tu cuenta.',
      caseId: 'pagos',
      metric: { value: '0 %', label: 'de comisión por cada cobro' },
    },
  ];

  /** Titular partido por letra para animar el grosor de la tipografía (fuente variable). */
  protected readonly heroWords = (() => {
    let n = 0;
    return ['Reconocen.', 'Deciden.', 'Cobran.'].map((word, wi) => ({
      accent: wi === 2,
      letters: word.split('').map((ch) => ({ ch, i: n++ })),
    }));
  })();

  protected readonly railItems = ['Inicio', 'Reconocen', 'Deciden', 'Cobran'];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
    const root = this.section.nativeElement;
    this.panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'));
    this.rail = root.querySelector<HTMLElement>('[data-rail]');
    this.rail?.addEventListener('pointermove', this.onRailMove);
    this.rail?.addEventListener('pointerleave', this.onRailLeave);

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
    const zone = this.hitZone.nativeElement;
    this.stage = zone;
    zone.addEventListener('pointerdown', this.onDown);
    zone.addEventListener('pointermove', this.onMove);
    zone.addEventListener('pointerup', this.onUp);
    zone.addEventListener('pointercancel', this.onUp);
    zone.addEventListener('wheel', this.onWheel, { passive: false });
    this.onScroll();
    this.shown = this.target;
    this.apply();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    this.rail?.removeEventListener('pointermove', this.onRailMove);
    this.rail?.removeEventListener('pointerleave', this.onRailLeave);
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

  /**
   * Efecto de cercanía del riel: cada ítem recibe `--prox` (0..1) según la distancia vertical
   * del puntero a su centro. El más cercano se abre por completo y los vecinos, algo.
   */
  private onRailMove = (e: PointerEvent): void => {
    if (!this.rail) return;
    const buttons = this.rail.querySelectorAll<HTMLElement>('.rail__btn');
    buttons.forEach((b) => {
      const r = b.getBoundingClientRect();
      const d = Math.abs(e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.setProperty('--prox', Math.exp(-(d * d) / 0.8).toFixed(3));
    });
  };

  private onRailLeave = (): void => {
    this.rail?.querySelectorAll<HTMLElement>('.rail__btn').forEach((b) => b.style.setProperty('--prox', '0'));
  };

  private stage: HTMLElement | null = null;
  private dragId: number | null = null;
  private lastX = 0;
  private downX = 0;
  private downY = 0;
  private downAt = 0;
  private moved = 0;

  private markTouched(): void {
    if (this.touched()) return;
    this.zone.run(() => this.touched.set(true));
  }

  /** Arrastre con mouse o dedo sobre la escena (no sobre el texto ni los controles). */
  private onDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.dragId = e.pointerId;
    this.lastX = e.clientX;
    this.downX = e.clientX;
    this.downY = e.clientY;
    this.downAt = performance.now();
    this.moved = 0;
    try {
      this.stage?.setPointerCapture(e.pointerId);
    } catch {
      /* puntero ya liberado */
    }
    this.scene?.beginDrag();
    this.zone.run(() => this.dragging.set(true));
  };

  private onMove = (e: PointerEvent): void => {
    if (this.dragId !== e.pointerId) return;
    const dx = e.clientX - this.lastX;
    this.lastX = e.clientX;
    this.moved += Math.abs(dx) + Math.abs(e.clientY - this.downY) * 0;
    if (dx !== 0) {
      this.scene?.rotateBy(dx * 0.0085);
      this.markTouched();
    }
  };

  private onUp = (e: PointerEvent): void => {
    if (this.dragId !== e.pointerId) return;
    this.dragId = null;
    this.scene?.endDrag();
    // Un toque corto (sin arrastre) dispara la explosión en ese punto.
    const quick = performance.now() - this.downAt < 380;
    if (e.type === 'pointerup' && quick && this.moved < 8 && this.canvas) {
      const r = this.canvas.nativeElement.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      this.scene?.blast(nx, ny);
      this.markTouched();
    }
    this.zone.run(() => this.dragging.set(false));
  };

  /** Gesto horizontal del trackpad: gira. El vertical sigue siendo scroll normal. */
  private onWheel = (e: WheelEvent): void => {
    // Solo dentro de la zona de la animación y solo si el gesto es claramente horizontal.
    // Un gesto vertical (scroll) nunca se intercepta.
    const now = performance.now();
    const ax = Math.abs(e.deltaX);
    const ay = Math.abs(e.deltaY);
    const clearlyHorizontal = ax > 1 && ax > ay * 1.8;
    const continuing = now - this.hLatch < 90 && ax >= ay;
    if (!clearlyHorizontal && !continuing) return;
    e.preventDefault();
    this.hLatch = now;
    this.scene?.rotateBy(-e.deltaX * 0.0045);
    this.markTouched();
  };
  private hLatch = 0;

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
    const k = 1 - Math.exp(-dt * 5.5);
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
