import { Component, signal, HostListener } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ModalComponent, ModalContent } from '../../components/modal/modal';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Proyecto {
  titulo: string;
  descripcion: string;
  imagenUrl?: string; // Main thumbnail (or first image)
  imagenes?: string[]; // Array for display if vertical
  orientacion?: 'horizontal' | 'vertical'; // Layout hint
  url: string;
  esProductoPropio: boolean;
  tecnologias: string[];
  categoria: string;
  anio: string;
}

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    ModalComponent
  ],
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.css'
})
export class PortafolioComponent {
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
    title: 'Control de Asistencia',
    description: 'Sistema inteligente para empresas que buscan orden. Automatiza el registro de entradas y salidas de tu personal con tecnología segura.',
    features: [
      'Control de asistencia con PIN personalizado',
      'Reportes automáticos por email mensuales',
      'Registro de licencias, vacaciones y cubiertas',
      'Interfaz intuitiva para administración',
      'Base de datos segura y confiable'
    ],
    images: [
      '/assets/App/GestionEmpleados/Asistencia.png',
      '/assets/App/GestionEmpleados/Empleados.png',
      '/assets/App/GestionEmpleados/Historial.png',
      '/assets/App/GestionEmpleados/Feriados.png'
    ],
    ctaText: 'Me interesa',
    ctaLink: 'https://wa.me/5491162548659?text=Hola!%20Me%20interesa%20el%20sistema%20de%20Gestión%20de%20Empleados'
  };

  protected readonly habitTrackerContent: ModalContent = {
    title: 'HabitTracker',
    description: 'Tu asistente personal en el celular. Una aplicación diseñada para organizar tu día a día, cumplir objetivos y mantener la motivación.',
    features: [
      'Seguimiento de hábitos diarios y semanales',
      'Gráficos de progreso visual claros',
      'Sistema de rachas para motivación',
      'Recordatorios personalizables',
      'Estadísticas mensuales y anuales',
      'Interfaz moderna y rápida'
    ],
    images: [
      '/assets/App/HabitTracker/Inicio.jpeg',
      '/assets/App/HabitTracker/AgregarHabito.jpeg'
    ],
    ctaText: 'Hablemos de tu app',
    ctaLink: 'https://wa.me/5491162548659?text=Hola!%20Tengo%20una%20idea%20para%20una%20app%20Android'
  };

  proyectos: Proyecto[] = [
    {
      titulo: 'SortProject',
      descripcion: 'Gestión total de stock y ventas. Incluye escáner de códigos de barras, generación de etiquetas e impresión. App web para vender desde el celular y versión PC para administración profunda.',
      imagenUrl: '/assets/App/Menu.png',
      imagenes: ['/assets/App/Menu.png'],
      orientacion: 'horizontal',
      url: 'https://sortproject.arrambidetech.com',
      esProductoPropio: true,
      tecnologias: ['Escaner de Barras', 'App Móvil', 'Gestión Offline', 'Facturación'],
      categoria: 'Desktop App',
      anio: '2025-2026'
    },
    {
      titulo: 'Control de Asistencia',
      descripcion: 'Sistema inteligente para empresas que buscan orden. Automatizá el registro de entradas y salidas de tu personal. Generá reportes mensuales de horas trabajadas con un solo clic.',
      imagenUrl: '/assets/App/GestionEmpleados/Asistencia.png',
      imagenes: ['/assets/App/GestionEmpleados/Asistencia.png'],
      orientacion: 'horizontal',
      url: '#',
      esProductoPropio: true,
      tecnologias: ['Control con PIN', 'Reportes PDF', 'Gestión de RRHH'],
      categoria: 'Desktop App',
      anio: '2025-2026'
    },
    {
      titulo: 'Mezuri Carpintería',
      descripcion: 'Catálogo digital profesional para exhibir trabajos a medida. Un sitio web rápido y elegante diseñado para captar clientes y cerrar presupuestos directamente por WhatsApp.',
      imagenUrl: '/assets/App/Mezuri/Hero.png',
      imagenes: ['/assets/App/Mezuri/Hero.png'],
      orientacion: 'horizontal',
      url: 'https://mezuricarpinteria.arrambidetech.com/',
      esProductoPropio: false,
      tecnologias: ['Diseño Moderno', 'Catálogo Online', 'WhatsApp Directo'],
      categoria: 'Web App',
      anio: '2025'
    },
    {
      titulo: 'HabitTracker (App)',
      descripcion: 'Tu asistente personal en el celular. Una aplicación diseñada para organizar tu día a día, cumplir objetivos y mantener la motivación con gráficos de progreso simples y claros.',
      imagenUrl: '/assets/App/HabitTracker/Inicio.jpeg', // Fallback
      imagenes: ['/assets/App/HabitTracker/Inicio.jpeg', '/assets/App/HabitTracker/AgregarHabito.jpeg'],
      orientacion: 'vertical',
      url: '#',
      esProductoPropio: true,
      tecnologias: ['App Android', 'Notificaciones', 'Estadísticas'],
      categoria: 'Mobile App',
      anio: '2025-2026'
    }
  ];

  categorias: string[] = ['Todos', 'Desktop App', 'Web App', 'Mobile App'];
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
    return proyecto.titulo === 'Control de Asistencia' || proyecto.titulo === 'HabitTracker (App)';
  }

  handleProjectClick(proyecto: Proyecto, event: Event): void {
    if (this.shouldOpenModal(proyecto)) {
      event.preventDefault();
      if (proyecto.titulo === 'Control de Asistencia') {
        this.openGestionEmpleadosModal();
      } else if (proyecto.titulo === 'HabitTracker (App)') {
        this.openHabitTrackerModal();
      }
    }
  }
}