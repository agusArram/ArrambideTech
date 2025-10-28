import { Component, signal, OnInit, effect, Renderer2, Inject, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  protected readonly isMenuOpen = signal(false);
  protected readonly isDarkMode = signal(false);

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    public router: Router
  ) {
    // Efecto para aplicar el tema cuando cambia
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  ngOnInit(): void {
    // Cargar preferencia guardada o usar tema claro por defecto
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'light';
    this.isDarkMode.set(initialTheme === 'dark');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen()) return;

    const target = event.target as HTMLElement;
    const mobileMenu = this.document.querySelector('.mobile-menu');
    const mobileMenuBtn = this.document.querySelector('.mobile-menu-btn');

    if (!mobileMenu?.contains(target) && !mobileMenuBtn?.contains(target)) {
      this.closeMenu();
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(value => !value);
    this.closeMenu();
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();

    // Si no estamos en home, navegar primero a home
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollToElement(sectionId);
        }, 100);
      });
    } else {
      this.scrollToElement(sectionId);
    }
  }

  private scrollToElement(sectionId: string): void {
    // Si es "inicio", hacer scroll al top
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Para otras secciones, buscar el elemento
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navegarYCerrar(ruta: string): void {
    this.closeMenu();
    this.router.navigate([ruta]);
  }


}
