import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';

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
      image: '📦',
      category: 'App de Escritorio',
      tech: ['Angular', 'Electron', 'TypeScript', 'SQLite'],
      link: 'https://sortproject.arrambidetech.com',
      features: [
        'Control de stock transaccional',
        'Gestión de precios y márgenes',
        'Reportes en PDF y Excel',
        'Sistema híbrido (nube + local)',
        'Soporte para variantes de productos'
      ]
    }
  ]);
}
