import {Component, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
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
    { text: 'Soluciones escalables y mantenibles' },
    { text: 'Soporte técnico continuo' }
  ]);
}
