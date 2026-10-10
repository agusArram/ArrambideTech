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

interface Stat {
  from: number;
  to: number;
  text?: string;
  label: string;
  note: string;
}

interface Release {
  tag: string;
  title: string;
  body: string;
  area: string;
}

const fmt = new Intl.NumberFormat('es-AR');

@Component({
  selector: 'app-proof',
  standalone: true,
  templateUrl: './proof.html',
  styleUrl: './proof.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProofComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private io?: IntersectionObserver;
  private raf = 0;

  protected readonly stats: Stat[] = [
    {
      from: 26500,
      to: 560,
      label: 'registros por importación',
      note: 'Importación de saldos del sistema de acceso (v1.9.9): de subir 26.500 datos a 560.',
    },
    {
      from: 0,
      to: 10,
      label: 'releases en la línea 1.9',
      note: 'Del v1.9.0 al v1.9.9, con el sistema de acceso ya en operación.',
    },
    {
      from: 0,
      to: 0,
      text: 'AES-256-GCM',
      label: 'bóveda biométrica',
      note: 'La imagen aceptada por el terminal es la que se cifra; si el hardware la rechaza, no se guarda.',
    },
    {
      from: 0,
      to: 8000,
      label: 'tokens por consulta de IA',
      note: 'Promedio medido, frente a más de 1.500.000 sin las restricciones de diseño.',
    },
  ];

  protected readonly values = signal<string[]>(this.stats.map((s) => this.render(s, 1)));

  protected readonly releases: Release[] = [
    {
      tag: 'v1.9.9',
      title: 'Importación de saldos',
      body: 'De subir 26.500 datos a 560: importación directa, liviana y concisa.',
      area: 'Rendimiento',
    },
    {
      tag: 'v1.9.8',
      title: 'Monitor en vivo',
      body: 'Los accesos permitidos y denegados aparecen en tiempo real, sin cerrar y reabrir la aplicación.',
      area: 'Tiempo real',
    },
    {
      tag: 'v1.9.7',
      title: 'Composición de saldos y desvinculación',
      body: 'La composición importa la fecha del recibo aplicado a cada factura: gráficos correctos y filtro por fechas. Al desvincular una persona, el terminal recibe la información correcta.',
      area: 'Finanzas',
    },
    {
      tag: 'v1.9.5',
      title: 'Identidades y multi-empresa',
      body: 'Se vacía el ID que el hardware arrastra en eventos de infraestructura y los eventos se redirigen a su empresa sin pérdida ni duplicados.',
      area: 'Integridad',
    },
    {
      tag: 'v1.9.3',
      title: 'Polling consistente',
      body: 'Un identificador de búsqueda estable: 350 eventos recuperados en 7 consultas tras dos semanas sin conexión.',
      area: 'Fiabilidad',
    },
    {
      tag: 'v1.9.1',
      title: 'Red robusta',
      body: 'Puerto interno reservado y detección de la IP de red real, ignorando adaptadores virtuales.',
      area: 'Infraestructura',
    },
    {
      tag: 'v1.9.0',
      title: 'CRM Analytics',
      body: 'Horas pico, perfilado de clientes, filtro por empresa y protección de rendimiento con límite de 10.000 registros.',
      area: 'Analítica',
    },
  ];

  protected readonly ecosystem = [
    'Control de acceso biométrico · Marinas del Paraná Guazú',
    'Asistente de IA · Municipalidad de Pilar',
    'La Ñata · reservas y pagos',
    'Demode · barberías',
    'SortProject · inventario y ventas',
    'Presentismo con QR y reconocimiento facial',
  ];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      this.values.set(this.stats.map((s) => this.render(s, 1)));
      return;
    }
    this.values.set(this.stats.map((s) => this.render(s, 0)));
    this.io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.io?.disconnect();
        this.animate();
      },
      { threshold: 0.35 },
    );
    this.io.observe(this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    cancelAnimationFrame(this.raf);
  }

  private animate(): void {
    const start = performance.now();
    const dur = 1600;
    this.zone.runOutsideAngular(() => {
      const step = (now: number): void => {
        const k = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        this.zone.run(() => this.values.set(this.stats.map((s) => this.render(s, e))));
        if (k < 1) this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    });
  }

  private render(s: Stat, k: number): string {
    if (s.text) return s.text;
    const v = Math.round(s.from + (s.to - s.from) * k);
    return s.to >= 8000 && k >= 1 ? `~${fmt.format(v)}` : fmt.format(v);
  }
}
