import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

interface ProjectsPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

@Component({
  selector: 'app-Projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  protected readonly projects = signal([
    {
      title: 'SortProject',
      description: 'Sistema híbrido de gestión para pequeños y medianos comercios. Control total sobre stock, ventas y precios en una aplicación de escritorio moderna.',
      image: '📦', // Icono de caja/paquete
      category: 'App de Escritorio y web',
      tech: ['Java', 'PostrgeSQL', 'SQLite'],
      link: 'https://sortproject.arrambidetech.com',
      features: [
        'Control de stock transaccional',
        'Gestión de precios y márgenes',
        'Reportes en PDF y Excel',
        'Sistema híbrido (nube + local)',
        'Soporte para variantes de productos'
      ]
    },
    {
      title: 'Mezuri maderera',
      description: 'Página web corporativa y portfolio digital para una carpintería de diseño a medida. El sitio destaca sus proyectos, servicios y método de trabajo.',
      image: '', // Icono de herramienta/construcción
      category: 'Pagina web',
      tech: ['Angular', 'Css', 'TypeScript'],
      link: 'https://mezuricarpinteria.arrambidetech.com',
      features: [
        'Diseño moderno y 100% responsive',
        'Galería de proyectos filtrable por categoría',
        'Secciones de servicios detallados (cocinas, livings, etc.)',
        'Formulario de contacto para cotizaciones',
        'Optimizado con Lazy Loading de Angular'
      ]
    }
  ]);
}
