import { Component, signal, OnInit, effect, Renderer2, Inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  protected readonly isDarkMode = signal(true);
  protected readonly isMenuOpen = signal(false);
  protected readonly isScrolled = signal(false);

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    public router: Router
  ) {
    // Sincronizar el tema con el DOM mediante un efecto reactivo
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  ngOnInit(): void {
    // Cargar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Por defecto oscuro para ArrambideTech
      this.isDarkMode.set(true);
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    this.isScrolled.set(scrollOffset > 50);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen()) return;

    const target = event.target as HTMLElement;
    const mobileMenu = this.document.querySelector('.mobile-menu');
    const menuToggle = this.document.querySelector('.menu-toggle');

    if (!mobileMenu?.contains(target) && !menuToggle?.contains(target)) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();

    // Intentar primero el scroll local si el elemento existe en la página actual
    const localElement = this.document.getElementById(sectionId);
    
    if (localElement) {
      this.scrollToElement(sectionId);
    } else {
      // Si no existe localmente, navegar al inicio y luego hacer scroll
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollToElement(sectionId);
        }, 150);
      });
    }
  }

  private scrollToElement(sectionId: string): void {

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
