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
import { RevealDirective } from '../../shared/reveal.directive';
import { ProximityDirective } from '../../shared/proximity.directive';

type Status = 'granted' | 'denied_debt' | 'manual_override';

interface AccessEvent {
  id: number;
  time: string;
  status: Status;
  label: string;
  who: string;
  door: string;
}

const DOORS = ['Portón principal', 'Muelle B', 'Oficina', 'Estacionamiento', 'Portón peatonal'];
const CATEGORIES = ['Premium', 'Estándar', 'Estándar', 'Visitante'];
const LABEL: Record<Status, string> = {
  granted: 'Acceso concedido',
  denied_debt: 'Denegado · saldo vencido',
  manual_override: 'Autorización manual',
};

const pad = (n: number): string => n.toString().padStart(2, '0');
const hhmmss = (d: Date): string => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

/**
 * Monitor en vivo de ejemplo: eventos que llegan con ritmo irregular, con las mismas
 * categorías de estado que el sistema real. Todo es de ejemplo y está rotulado así.
 */
@Component({
  selector: 'app-live-monitor',
  standalone: true,
  imports: [RevealDirective, ProximityDirective],
  templateUrl: './live-monitor.html',
  styleUrl: './live-monitor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveMonitorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly events = signal<AccessEvent[]>([]);
  protected readonly granted = signal(184);
  protected readonly denied = signal(11);

  private seq = 0;
  private timer = 0;
  private io?: IntersectionObserver;
  private visible = false;
  private reduce = false;

  constructor() {
    // Estado inicial determinista (SSR/primer render) con eventos "de hace instantes".
    const now = Date.now();
    const seed: AccessEvent[] = [];
    for (let i = 0; i < 5; i++) seed.push(this.make(new Date(now - (i + 1) * 23000), i === 2 ? 'denied_debt' : 'granted'));
    this.events.set(seed);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.io = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.timer && !this.reduce) this.schedule();
      },
      { threshold: 0.25 },
    );
    this.io.observe(this.root.nativeElement);
    document.addEventListener('visibilitychange', this.onVis);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    clearTimeout(this.timer);
    if (this.isBrowser) document.removeEventListener('visibilitychange', this.onVis);
  }

  private onVis = (): void => {
    if (document.hidden) {
      clearTimeout(this.timer);
      this.timer = 0;
    } else if (this.visible && !this.timer && !this.reduce) {
      this.schedule();
    }
  };

  private schedule(): void {
    const wait = 2200 + Math.random() * 3600;
    this.zone.runOutsideAngular(() => {
      this.timer = window.setTimeout(() => {
        this.timer = 0;
        if (!this.visible || document.hidden) return;
        this.zone.run(() => this.push());
        this.schedule();
      }, wait);
    });
  }

  private push(): void {
    const r = Math.random();
    const status: Status = r < 0.82 ? 'granted' : r < 0.95 ? 'denied_debt' : 'manual_override';
    const ev = this.make(new Date(), status);
    this.events.update((l) => [ev, ...l].slice(0, 6));
    if (status === 'granted') this.granted.update((n) => n + 1);
    else if (status === 'denied_debt') this.denied.update((n) => n + 1);
  }

  private make(date: Date, status: Status): AccessEvent {
    const staff = Math.random() < 0.12;
    const cat = status === 'denied_debt' ? pick(['Premium', 'Estándar']) : pick(CATEGORIES);
    const who = staff && status !== 'denied_debt' ? 'Personal · turno mañana' : `Unidad ${1 + Math.floor(Math.random() * 64)} · ${cat}`;
    return {
      id: ++this.seq,
      time: hhmmss(date),
      status,
      label: LABEL[status],
      who,
      door: pick(DOORS),
    };
  }
}
