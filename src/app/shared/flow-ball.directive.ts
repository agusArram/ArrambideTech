import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Una pelotita que recorre todos los nodos del diagrama de izquierda a derecha (o de arriba
 * a abajo en móvil), hace una pausa y repite. Usa las posiciones reales de los nodos.
 */
@Directive({ selector: '[appFlowBall]', standalone: true })
export class FlowBallDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private ball?: HTMLElement;
  private anim?: Animation;
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private visible = false;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof this.host.animate !== 'function') return;

    this.ball = document.createElement('span');
    this.ball.className = 'flow__ball';
    this.ball.setAttribute('aria-hidden', 'true');
    this.host.appendChild(this.ball);

    this.io = new IntersectionObserver(
      ([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) this.start();
        else this.anim?.cancel();
      },
      { threshold: 0.4 },
    );
    this.io.observe(this.host);
    this.ro = new ResizeObserver(() => {
      if (this.visible) this.start();
    });
    this.ro.observe(this.host);
  }

  ngOnDestroy(): void {
    this.anim?.cancel();
    this.io?.disconnect();
    this.ro?.disconnect();
    this.ball?.remove();
  }

  private start(): void {
    if (!this.ball) return;
    const dots = Array.from(this.host.querySelectorAll<HTMLElement>('.flow__dot'));
    if (dots.length < 2) return;
    const box = this.host.getBoundingClientRect();
    const pts = dots.map((d) => {
      const r = d.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });

    // Línea de tiempo (7 s): sale, pasa por cada nodo, llega y espera ~2 s antes de repetir.
    const n = pts.length;
    const travelStart = 0.05;
    const travelEnd = 0.66;
    const frames: Keyframe[] = pts.map((p, i) => ({
      offset: travelStart + ((travelEnd - travelStart) * i) / (n - 1),
      transform: `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`,
      opacity: 1,
      easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
    }));
    const firstT = `translate3d(${pts[0].x}px, ${pts[0].y}px, 0) translate(-50%, -50%)`;
    const lastT = `translate3d(${pts[n - 1].x}px, ${pts[n - 1].y}px, 0) translate(-50%, -50%)`;
    const all: Keyframe[] = [
      { offset: 0, transform: firstT, opacity: 0 },
      ...frames,
      { offset: 0.72, transform: lastT, opacity: 0 },
      { offset: 1, transform: lastT, opacity: 0 },
    ];

    this.anim?.cancel();
    this.anim = this.ball.animate(all, { duration: 7000, iterations: Infinity });
  }
}
