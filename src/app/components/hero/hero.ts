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

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
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
