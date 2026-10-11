import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly solid = signal(false);
  protected readonly open = signal(false);

  protected readonly links = [
    { label: 'Capacidades', path: '/servicios' },
    { label: 'Casos', path: '/soluciones' },
  ];

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.setOpen(false));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    this.solid.set(window.scrollY > 24);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser && window.innerWidth > 860 && this.open()) this.setOpen(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.setOpen(false);
  }

  toggle(): void {
    this.setOpen(!this.open());
  }

  /** Abre/cierra el menú y bloquea el scroll del fondo mientras está abierto. */
  setOpen(value: boolean): void {
    if (this.open() === value) return;
    this.open.set(value);
    if (this.isBrowser) this.doc.body.style.overflow = value ? 'hidden' : '';
  }

  ngOnDestroy(): void {
    if (this.isBrowser) this.doc.body.style.overflow = '';
  }
}
