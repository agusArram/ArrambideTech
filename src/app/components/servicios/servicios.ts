// --- 1. Imports corregidos (sin duplicados) ---
import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class ServiciosComponent {
  // --- 2. Esto es lo ÚNICO que debe llamarse 'scrollToSection' ---
  @Output() scrollToSection = new EventEmitter<string>();

  // El 'isMenuOpen' no parece usarse aquí, pero lo dejo por si acaso.
  protected readonly isMenuOpen = signal(false);

  protected readonly webServices = signal([
    {
      icon: '🌐', // (Le agregué los íconos que faltaban)
      title: 'Sitios Web Corporativos',
      description: 'Landing pages, portfolios y sitios institucionales para potenciar tu presencia online.',
      features: [
        'Diseño responsive y moderno',
        'Optimización SEO inicial',
        'Formulario de contacto funcional',
        'Integración con redes sociales',
        'Despliegue y hosting'
      ]
    },
    {
      icon: '⚡',
      title: 'Aplicaciones Web (SaaS)',
      description: 'Sistemas web a medida: paneles de gestión, intranets o plataformas de servicios (SaaS).',
      features: [
        'Desarrollo en Angular 17+',
        'Autenticación segura (Login y roles)',
        'Conexión a base de datos y APIs',
        'Paneles de administración y dashboards',
        'Escalabilidad y rendimiento'
      ]
    },
    {
      icon: '📦',
      title: 'Apps de Escritorio / Híbridas',
      description: 'Software de gestión (ERP/CRM) o herramientas de productividad para Windows, Mac o Linux.',
      features: [
        'Desarrollo en Java (o tecnologías híbridas)',
        'Gestión de stock, ventas y facturación',
        'Sistemas híbridos (Nube + Local)',
        'Reportes en PDF y Excel',
        'Bases de datos (PostgreSQL, SQLite)'
      ]
    }
  ]);

  // --- 3. BORRÉ LA FUNCIÓN 'protected scrollToSection(...)' DE AQUÍ ---
  // ... ¡Ya no va! ...
}
