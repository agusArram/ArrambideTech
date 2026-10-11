import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Egg {
  id: string;
  text: string;
}

const EGGS: Egg[] = [
  { id: 'logo', text: 'Doble clic en el logo: onda encontrada.' },
  { id: 'konami', text: 'El código clásico. Disfrutá el arcoíris.' },
  { id: 'puntos', text: 'Los puntos te saludan.' },
  { id: 'dot', text: 'Sí, ese punto verde está en vivo: todo opera.' },
  { id: 'founder', text: 'Hola, soy Agustín. Todo esto lo armé yo.' },
];
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const STORE = 'at-eggs';
const HINT = 'at-eggs-hint';

interface Wave {
  id: number;
  x: number;
  y: number;
}

/**
 * Detalles transversales del sitio: línea de progreso del scroll, botones magnéticos,
 * ondas y "cosas escondidas" (easter eggs) con contador y avisos.
 */
@Component({
  selector: 'app-extras',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp" aria-hidden="true"><span #bar class="sp__bar"></span></div>

    <div class="sw-layer" aria-hidden="true">
      @for (w of waves(); track w.id) {
        <span class="sw" [style.left.px]="w.x" [style.top.px]="w.y"></span>
      }
    </div>

    <div class="eg" aria-live="polite">
      <div class="eg__top">
        @if (toast(); as t) {
          <div class="eg__toast" [class.is-hint]="t.hint">
            <span>{{ t.text }}</span>
            @if (t.link) {
              <a routerLink="/contacto">Hablemos →</a>
            }
          </div>
        }
      </div>
      @if (found().length > 0) {
        <div class="eg__count" [title]="'Cosas escondidas encontradas'">{{ found().length }} / {{ total }}</div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 120;
      }
      .sp {
        position: absolute;
        inset: 0 0 auto 0;
        height: 2px;
      }
      .sp__bar {
        display: block;
        height: 100%;
        background: var(--im-accent, #6ee7b7);
        transform-origin: left;
        transform: scaleX(0);
        opacity: 0;
        transition: opacity 0.3s ease;
        will-change: transform;
      }
      .sw-layer {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      /* Una sola onda, suave y ancha: se expande una vez y se disuelve (sin ir y volver). */
      .sw {
        position: absolute;
        width: 120px;
        height: 120px;
        margin: -60px 0 0 -60px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          transparent 52%,
          color-mix(in srgb, var(--im-accent, #6ee7b7) 26%, transparent) 60%,
          transparent 69%
        );
        opacity: 0;
        animation: sw 1.3s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @keyframes sw {
        0% {
          opacity: 0.95;
          transform: scale(0.12);
        }
        60% {
          opacity: 0.45;
        }
        100% {
          opacity: 0;
          transform: scale(14);
        }
      }
      .eg {
        position: absolute;
        inset: 0;
      }
      .eg__top {
        position: absolute;
        top: 82px;
        right: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .eg__toast {
        pointer-events: auto;
        display: flex;
        gap: 12px;
        align-items: center;
        max-width: min(420px, calc(100vw - 32px));
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(12, 12, 14, 0.86);
        backdrop-filter: blur(10px);
        font-size: 0.84rem;
        line-height: 1.4;
        color: #f4f4f2;
        animation: toast-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .eg__toast.is-hint {
        color: #b9b9c1;
      }
      .eg__toast a {
        color: var(--im-accent, #6ee7b7);
        white-space: nowrap;
        text-decoration: none;
      }
      .eg__count {
        position: absolute;
        left: 16px;
        bottom: 16px;
        padding: 3px 9px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(12, 12, 14, 0.7);
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        color: #8b8b94;
        font-variant-numeric: tabular-nums;
      }
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translate3d(28px, 0, 0);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .eg__toast {
          animation: none;
        }
      }
    `,
  ],
})
export class ExtrasComponent implements OnInit, OnDestroy {
  @ViewChild('bar', { static: true }) private bar!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly total = EGGS.length;
  protected readonly found = signal<string[]>([]);
  protected readonly toast = signal<{ text: string; hint?: boolean; link?: boolean } | null>(null);
  protected readonly waves = signal<Wave[]>([]);

  private waveId = 0;
  private toastTimer = 0;
  private konamiPos = 0;
  private typed = '';
  private hintTimer = 0;
  private raf = 0;
  private ticking = false;
  private clicks = { dot: 0, founder: 0, dotAt: 0, founderAt: 0 };
  private magnets: HTMLElement[] = [];
  private mag = new Map<HTMLElement, { x: number; y: number; tx: number; ty: number }>();
  private magRaf = 0;
  private pointer = { x: -999, y: -999 };
  private refreshTimer = 0;
  private reduce = false;
  private fine = false;
  private rainbow = 0;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? '[]') as string[];
      if (Array.isArray(saved)) this.found.set(saved.filter((id) => EGGS.some((e) => e.id === id)));
    } catch {
      /* sin almacenamiento */
    }

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      window.addEventListener('keydown', this.onKey);
      window.addEventListener('at:egg', this.onEgg as EventListener);
      if (this.fine && !this.reduce) {
        window.addEventListener('pointermove', this.onPointer, { passive: true });
        this.refreshTimer = window.setInterval(() => this.refreshMagnets(), 1500);
      }
    });
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.refreshMagnets();
      this.onScroll();
    });
    this.refreshMagnets();
    this.onScroll();

    // Pista única, una sola vez por visitante, a los 7 segundos en la portada.
    let seen = false;
    try {
      seen = localStorage.getItem(HINT) === '1';
    } catch {
      /* ignore */
    }
    if (!seen && this.found().length === 0) {
      this.hintTimer = window.setTimeout(() => {
        if (location.pathname !== '/') return;
        this.show({ text: 'Esta web esconde cinco cosas. ¿Las encontrás?', hint: true }, 6500);
        try {
          localStorage.setItem(HINT, '1');
        } catch {
          /* ignore */
        }
      }, 7000);
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('at:egg', this.onEgg as EventListener);
    window.removeEventListener('pointermove', this.onPointer);
    clearTimeout(this.hintTimer);
    clearTimeout(this.toastTimer);
    clearInterval(this.refreshTimer);
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.magRaf);
    cancelAnimationFrame(this.rainbow);
  }

  /* ---------- línea de progreso ---------- */
  private onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;
    this.raf = requestAnimationFrame(() => {
      this.ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const el = this.bar.nativeElement;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
      el.style.opacity = p > 0.004 ? '1' : '0';
    });
  };

  /* ---------- botones magnéticos ---------- */
  private onPointer = (e: PointerEvent): void => {
    this.pointer.x = e.clientX;
    this.pointer.y = e.clientY;
    if (!this.magRaf) this.magRaf = requestAnimationFrame(this.stepMagnets);
  };

  private refreshMagnets(): void {
    this.magnets = Array.from(document.querySelectorAll<HTMLElement>('.btn, .im-btn, .hd__cta, .ov__cta'));
  }

  private readonly stepMagnets = (): void => {
    this.magRaf = 0;
    let moving = false;
    for (const el of this.magnets) {
      if (!el.isConnected) continue;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = this.pointer.x - cx;
      const dy = this.pointer.y - cy;
      const reach = Math.max(r.width, r.height) / 2 + 70;
      const d = Math.hypot(dx, dy);
      const st = this.mag.get(el) ?? { x: 0, y: 0, tx: 0, ty: 0 };
      if (d < reach) {
        const k = (1 - d / reach) * 0.1;
        st.tx = Math.max(-3, Math.min(3, dx * k));
        st.ty = Math.max(-3, Math.min(3, dy * k));
      } else {
        st.tx = 0;
        st.ty = 0;
      }
      st.x += (st.tx - st.x) * 0.18;
      st.y += (st.ty - st.y) * 0.18;
      if (Math.abs(st.x - st.tx) > 0.02 || Math.abs(st.y - st.ty) > 0.02) moving = true;
      el.style.translate = `${st.x.toFixed(2)}px ${st.y.toFixed(2)}px`;
      this.mag.set(el, st);
    }
    if (moving) this.magRaf = requestAnimationFrame(this.stepMagnets);
  };

  /* ---------- cosas escondidas ---------- */
  private onKey = (e: KeyboardEvent): void => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    // Código clásico
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[this.konamiPos]) {
      this.konamiPos++;
      if (this.konamiPos === KONAMI.length) {
        this.konamiPos = 0;
        this.discover('konami');
      }
    } else {
      this.konamiPos = key === KONAMI[0] ? 1 : 0;
    }
    // Palabra "puntos"
    if (e.key.length === 1 && /[a-záéíóúñ]/i.test(e.key)) {
      this.typed = (this.typed + e.key.toLowerCase()).slice(-8);
      if (this.typed.endsWith('puntos')) {
        this.typed = '';
        this.discover('puntos');
      }
    }
  };

  private onEgg = (ev: Event): void => {
    const d = (ev as CustomEvent<{ id: string; x?: number; y?: number }>).detail;
    if (!d) return;
    const now = performance.now();
    if (d.id === 'logo') {
      this.discover('logo', d.x, d.y);
    } else if (d.id === 'dot') {
      this.clicks.dot = now - this.clicks.dotAt < 1800 ? this.clicks.dot + 1 : 1;
      this.clicks.dotAt = now;
      if (this.clicks.dot >= 3) {
        this.clicks.dot = 0;
        this.discover('dot');
      }
    } else if (d.id === 'founder') {
      this.clicks.founder = now - this.clicks.founderAt < 2500 ? this.clicks.founder + 1 : 1;
      this.clicks.founderAt = now;
      if (this.clicks.founder >= 5) {
        this.clicks.founder = 0;
        this.discover('founder');
      }
    }
  };

  private discover(id: string, x?: number, y?: number): void {
    const egg = EGGS.find((e) => e.id === id);
    if (!egg) return;
    this.zone.run(() => {
      const wasNew = !this.found().includes(id);
      if (wasNew) {
        const next = [...this.found(), id];
        this.found.set(next);
        try {
          localStorage.setItem(STORE, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }
      const complete = this.found().length === EGGS.length;
      const prefix = wasNew ? `${this.found().length}/${EGGS.length} · ` : '';
      this.show(
        { text: complete && wasNew ? 'Las encontraste todas. Quien mira los detalles, trabaja bien.' : prefix + egg.text, link: complete && wasNew },
        complete && wasNew ? 9000 : 4200,
      );
    });

    // efectos
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (id === 'logo') {
      this.wave(x ?? w / 2, y ?? 40);
      this.blast(x ?? w / 2, y ?? 40);
    } else if (id === 'puntos') {
      [0, 140, 300].forEach((delay, i) =>
        setTimeout(() => {
          const px = w * (0.55 + 0.15 * (i - 1)) + Math.random() * 40;
          const py = h * (0.4 + 0.12 * i);
          this.blast(px, py);
        }, delay),
      );
    } else if (id === 'konami') {
      this.runRainbow();
    }
  }

  private wave(x: number, y: number): void {
    const id = ++this.waveId;
    this.zone.run(() => this.waves.update((l) => [...l, { id, x, y }]));
    setTimeout(() => this.zone.run(() => this.waves.update((l) => l.filter((v) => v.id !== id))), 1700);
  }

  /** Avisa a la escena 3D (si hay una en pantalla) para que dispare una onda en ese punto. */
  private blast(x: number, y: number): void {
    window.dispatchEvent(new CustomEvent('at:blast', { detail: { x, y } }));
  }

  private runRainbow(): void {
    cancelAnimationFrame(this.rainbow);
    const root = document.documentElement;
    const start = performance.now();
    const step = (now: number): void => {
      const t = (now - start) / 1000;
      if (t > 6) {
        root.style.removeProperty('--im-accent');
        return;
      }
      const hue = (t * 120) % 360;
      root.style.setProperty('--im-accent', `hsl(${hue.toFixed(0)} 78% 68%)`);
      this.rainbow = requestAnimationFrame(step);
    };
    this.rainbow = requestAnimationFrame(step);
  }

  private show(t: { text: string; hint?: boolean; link?: boolean }, ms: number): void {
    this.zone.run(() => this.toast.set(t));
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.zone.run(() => this.toast.set(null)), ms);
  }
}
