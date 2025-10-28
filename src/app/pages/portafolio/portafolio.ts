import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Proyecto {
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  url: string;
  esProductoPropio: boolean;
  tecnologias: string[];
  categoria: string;
  anio: number;
}

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.css'
})
export class PortafolioComponent {
  proyectos: Proyecto[] = [
    {
      titulo: 'SortProject',
      descripcion: 'Sistema completo de gestion de stock, ventas y facturacion para comercios. Software desktop desarrollado con Electron, incluyendo base de datos SQLite, sistema de reportes avanzado, control de inventario en tiempo real, modulo de facturacion integrado y panel de estadisticas.',
      imagenUrl: '',
      url: 'https://sortproject.arrambidetech.com',
      esProductoPropio: true,
      tecnologias: ['Electron', 'Angular', 'SQLite', 'TypeScript'],
      categoria: 'Desktop App',
      anio: 2024
    },
    {
      titulo: 'Sistema Administrativo Empresarial',
      descripcion: 'Plataforma web integral para la administracion de empresas. Incluye gestion de recursos humanos, control de proyectos, sistema de documentacion, facturacion y reportes avanzados. Desarrollado con tecnologias modernas y escalables.',
      imagenUrl: '',
      url: '#',
      esProductoPropio: false,
      tecnologias: ['Angular', 'Node.js', 'PostgreSQL', 'Material UI'],
      categoria: 'Web App',
      anio: 2024
    },
    {
      titulo: 'Tienda Online MultiProducto',
      descripcion: 'E-commerce completo con sistema de pagos integrado, gestion de inventario en tiempo real, panel de administracion, sistema de envios y seguimiento de pedidos. Diseno responsive optimizado para conversion y ventas.',
      imagenUrl: '',
      url: '#',
      esProductoPropio: false,
      tecnologias: ['Next.js', 'React', 'Stripe', 'MongoDB'],
      categoria: 'E-commerce',
      anio: 2023
    },
    {
      titulo: 'App Mobile de Servicios',
      descripcion: 'Aplicacion movil multiplataforma para servicios bajo demanda. Incluye geolocalizacion en tiempo real, sistema de pagos integrado, chat en vivo, calificaciones y notificaciones push para usuarios y proveedores.',
      imagenUrl: '',
      url: '#',
      esProductoPropio: false,
      tecnologias: ['React Native', 'Firebase', 'Google Maps API'],
      categoria: 'Mobile App',
      anio: 2023
    },
    {
      titulo: 'Software POS Comercial',
      descripcion: 'Software desktop para punto de venta comercial. Gestion de ventas, impresion de tickets, control de stock, reportes de ventas diarias y mensuales. Funciona offline con sincronizacion automatica en la nube.',
      imagenUrl: '',
      url: '#',
      esProductoPropio: false,
      tecnologias: ['Electron', 'Vue.js', 'SQLite', 'AWS'],
      categoria: 'Desktop App',
      anio: 2023
    },
    {
      titulo: 'Portal Web Corporativo',
      descripcion: 'Plataforma web corporativa con sistema de gestion de contenidos, area de clientes, integracion con CRM, sistema de notificaciones y panel de analytics. Interfaz moderna y completamente responsive.',
      imagenUrl: '',
      url: '#',
      esProductoPropio: false,
      tecnologias: ['React', 'Django', 'PostgreSQL', 'Redis'],
      categoria: 'Web App',
      anio: 2022
    }
  ];

  categorias: string[] = ['Todos', 'Desktop App', 'Web App', 'E-commerce', 'Mobile App'];
  categoriaSeleccionada: string = 'Todos';

  get proyectosFiltrados(): Proyecto[] {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.proyectos;
    }
    return this.proyectos.filter(p => p.categoria === this.categoriaSeleccionada);
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }
}
