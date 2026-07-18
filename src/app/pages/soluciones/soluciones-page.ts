import { Component, signal, HostListener } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ModalComponent, ModalContent } from '../../components/modal/modal';
import { ContactFormComponent } from '../../components/contact-form/contact-form';
import { CommonModule } from '@angular/common';

interface Proyecto {
  titulo: string;
  descripcion: string;
  imagenUrl?: string; // Main thumbnail (or first image)
  imagenes?: string[]; // Array for display if vertical
  orientacion?: 'horizontal' | 'vertical'; // Layout hint
  url: string;
  esProductoPropio: boolean;
  tecnologias: string[];
  categorias: string[];
  anio: string;
  btnText?: string;
}

@Component({
  selector: 'app-soluciones-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ModalComponent,
    ContactFormComponent
  ],
  templateUrl: './soluciones-page.html',
  styleUrl: './soluciones-page.css'
})
export class SolucionesPageComponent {
  // Modal State
  protected readonly isModalOpen = signal(false);
  protected modalContent = signal<ModalContent | null>(null);

  // Lightbox State
  protected readonly isLightboxOpen = signal(false);
  protected currentProjectImages = signal<string[]>([]);
  protected currentImageIndex = signal(0);

  // Keyboard Navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isLightboxOpen()) return;

    if (event.key === 'ArrowRight') {
      this.nextImage(event);
    } else if (event.key === 'ArrowLeft') {
      this.prevImage(event);
    } else if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }

  // Drag / Swipe Logic
  private dragStartX = 0;
  private minSwipeDistance = 50; // Minimum distance to trigger slide

  onDragStart(event: MouseEvent | TouchEvent): void {
    // Check if we are clicking on a button (nav or close) - if so, ignore drag
    if ((event.target as HTMLElement).closest('button')) return;

    this.dragStartX = this.getClientX(event);
  }

  onDragEnd(event: MouseEvent | TouchEvent): void {
    if ((event.target as HTMLElement).closest('button')) return;

    const endX = this.getClientX(event);
    const diff = this.dragStartX - endX;

    if (Math.abs(diff) > this.minSwipeDistance) {
      if (diff > 0) {
        // Dragged Left -> Next Image
        this.nextImage(event);
      } else {
        // Dragged Right -> Prev Image
        this.prevImage(event);
      }
    }
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX;
    }
    return event.changedTouches[0].clientX;
  }

  // Lightbox Methods
  openLightbox(images: string[], index: number = 0): void {
    if (images && images.length > 0) {
      this.currentProjectImages.set(images);
      this.currentImageIndex.set(index);
      this.isLightboxOpen.set(true);
      // Note: Body overflow is already hidden by modal, but this ensures it stays locked
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox(): void {
    this.isLightboxOpen.set(false);
    this.currentProjectImages.set([]);
    // Only restore scroll if modal is NOT open. If modal is open, keep it hidden.
    if (!this.isModalOpen()) {
      document.body.style.overflow = '';
    }
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    const total = this.currentProjectImages().length;
    this.currentImageIndex.update(i => (i + 1) % total);
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    const total = this.currentProjectImages().length;
    this.currentImageIndex.update(i => (i - 1 + total) % total);
  }

  protected readonly gestionEmpleadosContent: ModalContent = {
    title: 'Control Biométrico y Auditoría de Personal',
    description: 'Nodos de control de acceso integrados con validación de identidad de alta precisión. Diseñado para garantizar la trazabilidad total de la jornada laboral y la seguridad de infraestructuras corporativas.',
    features: [
      'Validación biométrica y auditoría de integridad',
      'Sincronización de datos en tiempo real (Cloud Sync)',
      'Generación automatizada de reportes de cumplimiento laboral',
      'Gestión escalable de licencias, vacaciones y cubiertas',
      'Arquitectura de alta disponibilidad con redundancia'
    ],
    images: [
      '/assets/App/GestionEmpleados/Asistencia.webp',
      '/assets/App/GestionEmpleados/Empleados.webp',
      '/assets/App/GestionEmpleados/Historial.webp',
      '/assets/App/GestionEmpleados/Feriados.webp'
    ],
    ctaText: 'Solicitar Especificaciones',
    ctaLink: 'https://wa.me/5491162548659?text=Hola!%20Me%20interesa%20la%20arquitectura%20de%20Control%20Biométrico%20y%20Auditoría'
  };

  protected readonly habitTrackerContent: ModalContent = {
    title: 'Ecosistemas Móviles Nativos',
    description: 'Ingeniería de aplicaciones móviles a medida con sincronización bidireccional y procesamiento de datos en tiempo real. Soluciones diseñadas para la optimización de flujos de trabajo en campo y logística crítica.',
    features: [
      'Desarrollo nativo de alto rendimiento (Android/iOS)',
      'Protocolos de sincronización de baja latencia',
      'Visualización de analítica avanzada y KPI en tiempo real',
      'Arquitectura modular para escalabilidad empresarial',
      'Integración con sistemas legacy y APIs externas'
    ],
    images: [
      '/assets/App/HabitTracker/Inicio.webp',
      '/assets/App/HabitTracker/AgregarHabito.webp'
    ],
    ctaText: 'Consultar Viabilidad',
    ctaLink: 'https://wa.me/5491162548659?text=Hola!%20Deseo%20consultar%20la%20viabilidad%20de%20un%20ecosistema%20móvil%20nativo'
  };

  proyectos: Proyecto[] = [
    {
      titulo: 'SortProject: Infraestructura de Gestión Retail y POS.',
      descripcion: 'Sistema de punto de venta (POS) y trazabilidad de inventario con arquitectura offline-first. Diseñado para alta disponibilidad, con sincronización de datos en la nube y reportes de rentabilidad en tiempo real.',
      imagenUrl: '/assets/App/Menu.webp',
      imagenes: ['/assets/App/Menu.webp'],
      orientacion: 'horizontal',
      url: 'https://sortproject.arrambidetech.com',
      esProductoPropio: true,
      tecnologias: ['SQLite', 'Supabase', 'Angular', 'Offline-First'],
      categorias: ['SaaS', 'Software de Escritorio'],
      anio: '2025-2026',
      btnText: 'Visualizar Plataforma'
    },
    {
      titulo: 'La Ñata: SaaS de Gestión Deportiva y Reservas.',
      descripcion: 'Plataforma multi-tenant de reservas con pasarela de pagos inhackeable (Mercado Pago). Arquitectura en Supabase con Edge Functions para seguridad absoluta de transacciones, grilla de disponibilidad en tiempo real, gestión de suspensiones por lluvia y billetera virtual de reembolsos.',
      imagenUrl: '/assets/App/LaNata/Hero.webp',
      imagenes: ['/assets/App/LaNata/Hero.webp'],
      orientacion: 'horizontal',
      url: 'https://www.lañata.com/',
      esProductoPropio: true,
      tecnologias: ['Angular', 'Supabase', 'Mercado Pago', 'Edge Functions', 'PWA'],
      categorias: ['SaaS', 'Web App'],
      anio: '2026',
      btnText: 'Visualizar Plataforma'
    },
    {
      titulo: 'demode: Ecosistema SaaS para Barberías.',
      descripcion: 'Plataforma escalable B2B2C con arquitectura robusta en Angular y Supabase. Implementa políticas de seguridad (RLS) granulares por rol (Dueño, Caja, Peluquero) para un control estricto de permisos y reservas ultra rápidas. Incluye e-commerce, métricas en tiempo real y gestión centralizada.',
      imagenUrl: '/assets/App/Demode/Hero.webp',
      imagenes: ['/assets/App/Demode/Hero.webp'],
      orientacion: 'horizontal',
      url: 'https://demodepeluqueria.com/',
      esProductoPropio: true,
      tecnologias: ['Angular', 'Supabase', 'RLS Security', 'Real-time'],
      categorias: ['SaaS', 'Web App'],
      anio: '2026',
      btnText: 'Visualizar Plataforma'
    },
    {
      titulo: 'Control Biométrico y Auditoría de Personal.',
      descripcion: 'Nodos de control de acceso integrados con validación de identidad de alta precisión. Generación automatizada de auditorías, registro de licencias y reportes estrictos de cumplimiento laboral.',
      imagenUrl: '/assets/App/GestionEmpleados/Asistencia.webp',
      imagenes: ['/assets/App/GestionEmpleados/Asistencia.webp'],
      orientacion: 'horizontal',
      url: '#',
      esProductoPropio: true,
      tecnologias: ['IoT', 'Biometría', 'Cloud Sync'],
      categorias: ['SaaS', 'Software de Escritorio'],
      anio: '2025-2026',
      btnText: 'Ver Especificaciones Técnicas'
    },
    {
      titulo: 'Portal Operativo B2B - Hyder',
      descripcion: 'Desarrollo de infraestructura web y portal corporativo para firma líder en aduana y logística. Implementación de un CMS a medida de alto rendimiento que otorga autogestión total: administración de contenidos, subida de archivos operativos y publicación de novedades en tiempo real. Arquitectura SEO-first.',
      imagenUrl: '/assets/App/Hyder/hyder-preview.webp',
      imagenes: ['/assets/App/Hyder/hyder-preview.webp'],
      orientacion: 'horizontal',
      url: 'https://hyder.com.ar/',
      esProductoPropio: false,
      tecnologias: ['Portal B2B', 'CMS de Alto Rendimiento', 'Arquitectura SEO', 'Logística Aduanera'],
      categorias: ['Web App'],
      anio: '2026',
      btnText: 'Visualizar Portal Operativo'
    },
    {
      titulo: 'Portales Corporativos y E-Commerce B2B.',
      descripcion: 'Desarrollo de interfaces web de alto rendimiento con optimización SEO técnica. Plataformas robustas enfocadas en la adquisición, retención de clientes corporativos y digitalización de ventas.',
      imagenUrl: '/assets/App/Mezuri/Hero.webp',
      imagenes: ['/assets/App/Mezuri/Hero.webp'],
      orientacion: 'horizontal',
      url: 'https://mezuricarpinteria.arrambidetech.com/',
      esProductoPropio: false,
      tecnologias: ['SSR', 'Angular', 'SEO Técnico', 'UI/UX'],
      categorias: ['Web App'],
      anio: '2025',
      btnText: 'Visualizar Portal'
    },
    {
      titulo: 'Ecosistemas Móviles Nativos.',
      descripcion: 'Ingeniería de aplicaciones móviles a medida con sincronización bidireccional y procesamiento de datos en tiempo real. Soluciones diseñadas para la optimización de flujos de trabajo en campo y logística.',
      imagenUrl: '/assets/App/HabitTracker/Inicio.webp', // Fallback
      imagenes: ['/assets/App/HabitTracker/Inicio.webp', '/assets/App/HabitTracker/AgregarHabito.webp'],
      orientacion: 'vertical',
      url: '#',
      esProductoPropio: true,
      tecnologias: ['Kotlin', 'Android', 'Real-time'],
      categorias: ['Mobile App'],
      anio: '2025-2026',
      btnText: 'Ver Especificaciones Técnicas'
    }
  ];

  categorias: string[] = ['Todos', 'SaaS', 'Software de Escritorio', 'Web App', 'Mobile App'];
  categoriaSeleccionada: string = 'Todos';

  get proyectosFiltrados(): Proyecto[] {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.proyectos;
    }
    return this.proyectos.filter(p => p.categorias.includes(this.categoriaSeleccionada));
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }

  openModal(content: ModalContent): void {
    this.modalContent.set(content);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.modalContent.set(null);
    document.body.style.overflow = '';
  }

  openGestionEmpleadosModal(): void {
    this.openModal(this.gestionEmpleadosContent);
  }

  openHabitTrackerModal(): void {
    this.openModal(this.habitTrackerContent);
  }

  shouldOpenModal(proyecto: Proyecto): boolean {
    return proyecto.titulo.includes('Biométrico') || proyecto.titulo.includes('Ecosistemas Móviles');
  }

  handleProjectClick(proyecto: Proyecto, event: Event): void {
    if (this.shouldOpenModal(proyecto)) {
      event.preventDefault();
      if (proyecto.titulo.includes('Biométrico')) {
        this.openGestionEmpleadosModal();
      } else if (proyecto.titulo.includes('Ecosistemas Móviles')) {
        this.openHabitTrackerModal();
      }
    }
  }
}
