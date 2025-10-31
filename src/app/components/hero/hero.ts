import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {
  constructor(private router: Router) {}

// En: src/app/components/hero/hero.ts

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    // 1. Buscamos el .nav-content (que mide 70px)
    const navContentElement = document.querySelector('.nav-content') as HTMLElement;

    if (element && navContentElement) {
      // 2. Medimos su altura
      const headerHeight = navContentElement.offsetHeight;

      // 3. Calculamos la posición real del elemento
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;

      // 4. Restamos la altura del header
      const offsetPosition = elementPosition - headerHeight;

      // 5. Hacemos scroll a la posición calculada
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

    } else if (element) {
      // Fallback (por si no encuentra el nav)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navegarContacto(): void {
    this.router.navigate(['/contacto']);
  }
  // Trust indicators
  protected readonly trustItems = signal([
    { text: 'Sin costos iniciales de desarrollo' },
    { text: 'Adaptado 100% a tus necesidades' },
    { text: 'Contacto directo por WPP' }
  ]);
}
