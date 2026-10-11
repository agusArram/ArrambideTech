import { Component, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { ExtrasComponent } from './shared/extras.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExtrasComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private router = inject(Router);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  ngAfterViewInit() {
    this.initScrollReveal();
    
    // Volver a inicializar cuando cambia la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSeo();
      // Pequeño delay para asegurar que Angular ya renderizó la nueva vista
      setTimeout(() => this.initScrollReveal(), 100);
    });
  }

  /** Mantiene al día descripción, URL canónica y robots según la página en la que está el visitante. */
  private updateSeo(): void {
    let snap: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (snap.firstChild) snap = snap.firstChild;
    const data = snap.data as { description?: string; noindex?: boolean };
    const path = this.router.url.split(/[?#]/)[0];
    const url = 'https://arrambidetech.com' + (path === '/' ? '/' : path.replace(/\/$/, '') + '/');
    const title = this.doc.title;

    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ property: 'og:description', content: data.description });
      this.meta.updateTag({ name: 'twitter:description', content: data.description });
    }
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'robots', content: data.noindex ? 'noindex, nofollow' : 'index, follow' });
    if (!data.noindex) {
      this.meta.updateTag({ property: 'og:url', content: url });
      const link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (link) link.href = url;
    }
  }

  private initScrollReveal() {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Una vez revelado, dejamos de observarlo para ahorrar recursos
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));
  }
}
