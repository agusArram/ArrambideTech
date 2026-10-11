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
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  delay: number;
  s: number;
  bright: number;
}

/**
 * Confirmación hecha de partículas: llegan desde afuera y forman un tilde dentro de un aro.
 * Reaccionan al mouse (se apartan) y al toque (pequeña onda). Canvas 2D, sin dependencias.
 */
@Component({
  selector: 'app-particle-check',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #cv class="pc" width="200" height="200" aria-hidden="true"></canvas>`,
  styles: [
    `
      :host {
        display: block;
        width: 168px;
        height: 168px;
        touch-action: pan-y;
      }
      .pc {
        width: 100%;
        height: 100%;
        display: block;
      }
    `,
  ],
})
export class ParticleCheckComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv', { static: true }) private cv!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private parts: P[] = [];
  private raf = 0;
  private t0 = 0;
  private size = 168;
  private dpr = 1;
  private mouse = { x: -999, y: -999 };
  private pulses: Array<{ x: number; y: number; at: number }> = [];
  private reduce = false;
  private color = '110,231,183';

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = this.cv.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = this.size * this.dpr;
    el.height = this.size * this.dpr;

    const css = getComputedStyle(document.documentElement).getPropertyValue('--im-accent').trim();
    if (/^#([0-9a-f]{6})$/i.test(css)) {
      const n = parseInt(css.slice(1), 16);
      this.color = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
    }

    this.build();
    el.addEventListener('pointermove', this.onMove);
    el.addEventListener('pointerleave', this.onLeave);
    el.addEventListener('pointerdown', this.onDown);

    if (this.reduce) {
      for (const p of this.parts) {
        p.x = p.tx;
        p.y = p.ty;
      }
      this.draw(performance.now());
      return;
    }
    this.t0 = performance.now();
    this.zone.runOutsideAngular(() => (this.raf = requestAnimationFrame(this.loop)));
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }

  /** Objetivos: un aro y un tilde. Las partículas arrancan en un anillo exterior. */
  private build(): void {
    const N = 560;
    const c = this.size / 2;
    const R = this.size * 0.4;
    const check = [
      [-0.42, 0.04],
      [-0.12, 0.34],
      [0.44, -0.3],
    ].map(([x, y]) => [c + x * R * 1.15, c + y * R * 1.15]);
    const seg = (a: number[], b: number[], t: number): number[] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const lenA = Math.hypot(check[1][0] - check[0][0], check[1][1] - check[0][1]);
    const lenB = Math.hypot(check[2][0] - check[1][0], check[2][1] - check[1][1]);

    for (let i = 0; i < N; i++) {
      let tx: number;
      let ty: number;
      if (i < N * 0.42) {
        const a = Math.random() * Math.PI * 2;
        tx = c + Math.cos(a) * R;
        ty = c + Math.sin(a) * R;
      } else {
        const r = Math.random() * (lenA + lenB);
        const pt = r < lenA ? seg(check[0], check[1], r / lenA) : seg(check[1], check[2], (r - lenA) / lenB);
        tx = pt[0] + (Math.random() - 0.5) * 4;
        ty = pt[1] + (Math.random() - 0.5) * 4;
      }
      const ang = Math.random() * Math.PI * 2;
      const dist = this.size * (0.65 + Math.random() * 0.5);
      this.parts.push({
        x: c + Math.cos(ang) * dist,
        y: c + Math.sin(ang) * dist,
        vx: 0,
        vy: 0,
        tx,
        ty,
        delay: Math.random() * 520,
        s: 0.9 + Math.random() * 1.5,
        bright: Math.random(),
      });
    }
  }

  private onMove = (e: PointerEvent): void => {
    const r = this.cv.nativeElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - r.left) / r.width) * this.size;
    this.mouse.y = ((e.clientY - r.top) / r.height) * this.size;
  };
  private onLeave = (): void => {
    this.mouse.x = this.mouse.y = -999;
  };
  private onDown = (e: PointerEvent): void => {
    const r = this.cv.nativeElement.getBoundingClientRect();
    this.pulses.push({
      x: ((e.clientX - r.left) / r.width) * this.size,
      y: ((e.clientY - r.top) / r.height) * this.size,
      at: performance.now(),
    });
    if (this.pulses.length > 3) this.pulses.shift();
  };

  private loop = (now: number): void => {
    const elapsed = now - this.t0;
    for (const p of this.parts) {
      if (elapsed < p.delay) continue;
      // resorte hacia el objetivo con amortiguación
      p.vx += (p.tx - p.x) * 0.045;
      p.vy += (p.ty - p.y) * 0.045;
      // repulsión suave del mouse
      const mdx = p.x - this.mouse.x;
      const mdy = p.y - this.mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 34 && md > 0.01) {
        const f = (1 - md / 34) * 1.4;
        p.vx += (mdx / md) * f;
        p.vy += (mdy / md) * f;
      }
      // onda del toque
      for (const w of this.pulses) {
        const age = (now - w.at) / 1000;
        if (age > 1.2) continue;
        const dx = p.x - w.x;
        const dy = p.y - w.y;
        const d = Math.hypot(dx, dy) || 1;
        const front = age * 120;
        const k = Math.exp(-Math.pow((d - front) / 16, 2)) * (1 - age / 1.2) * 1.6;
        p.vx += (dx / d) * k;
        p.vy += (dy / d) * k;
      }
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.x += p.vx;
      p.y += p.vy;
    }
    this.draw(now);
    this.raf = requestAnimationFrame(this.loop);
  };

  private draw(now: number): void {
    const el = this.cv.nativeElement;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.size, this.size);
    const settled = Math.min(1, Math.max(0, (now - this.t0 - 900) / 700));
    for (const p of this.parts) {
      const a = 0.35 + p.bright * 0.55;
      ctx.fillStyle = `rgba(${this.color},${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s * (0.75 + 0.25 * settled), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
