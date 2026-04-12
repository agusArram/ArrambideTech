import { Component, signal, OnInit, effect, Renderer2, Inject, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  protected readonly isMenuOpen = signal(false);
  protected readonly isScrolled = signal(false);

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Forzar tema oscuro en el root
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', 'dark');
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
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
