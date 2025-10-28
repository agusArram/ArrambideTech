import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. IMPORTAR ESTO

@Component({
  selector: 'app-servicios',
  standalone: true, // <--- 2. AÑADIR ESTO
  imports: [CommonModule], // <--- 3. AÑADIR ESTO
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class ServiciosComponent { // (Tu clase se llama Servicios aquí, si en el archivo es 'ServiciosComponent' no hay problema)
  protected readonly isMenuOpen = signal(false);

  protected readonly webServices = signal([
    {
      icon: '🌐',
      title: 'Sitios Web',
      description: 'Landing pages, sitios corporativos y portfolios profesionales',
      features: [
        'Diseño responsive y moderno',
        'SEO optimizado',
        'Hosting incluido',
        'Formulario de contacto',
        'Integración con redes sociales'
      ]
    },
    {
      icon: '⚡',
      title: 'Aplicaciones Web',
      description: 'Sistemas a medida con Angular y las últimas tecnologías',
      features: [
        'Angular 20+ y TypeScript',
        'Autenticación y permisos',
        'Base de datos integrada',
        'Panel de administración',
        'API RESTful'
      ]
    },
    {
      icon: '🛒',
      title: 'E-commerce',
      description: 'Tiendas online completas listas para vender',
      features: [
        'Catálogo de productos',
        'Carrito y checkout',
        'Pasarelas de pago',
        'Gestión de stock',
        'Panel de administración'
      ]
    }
  ]);

  protected scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70; // Offset para no cortar los badges
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    this.isMenuOpen.set(false); // Cerrar menú móvil después de navegar
  }
}
