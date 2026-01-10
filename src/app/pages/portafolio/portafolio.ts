import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ModalComponent, ModalContent } from '../../components/modal/modal';
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
  protected readonly isModalOpen = signal(false);
  protected modalContent = signal<ModalContent | null>(null);

  protected readonly gestionEmpleadosContent: ModalContent = {
    title: 'Gestión de Empleados',
    description: 'Sistema de control de asistencia inteligente para empresas. Automatiza el registro de entradas y salidas de tu personal con tecnología Arduino.',
    features: [
      'Control de asistencia con PIN personalizado por empleado',
      'Integración con Arduino y control remoto',
      'Reportes automáticos por email mensuales',
      'Registro de licencias, vacaciones y cubiertas',
      'Próximamente: Lectura de huella dactilar',
      'Base de datos segura en la nube'
    ],
    ctaText: 'Me interesa',
    ctaLink: 'https://wa.me/5491162548659?text=Hola!%20Me%20interesa%20el%20sistema%20de%20Gestión%20de%20Empleados'
  };

  protected readonly habitTrackerContent: ModalContent = {
    title: 'HabitTracker',
    description: 'Aplicación nativa Android para seguimiento de hábitos y rutinas diarias con sistema de rachas y recordatorios personalizables.',
    features: [
      'Seguimiento de hábitos diarios y semanales',
      'Gráficos de progreso visual',
      'Sistema de rachas para mantener la motivación',
      'Recordatorios personalizables',
      'Estadísticas mensuales y anuales',
      'Interfaz moderna con Material Design'
    ],
    ctaText: 'Hablemos de tu app',
    ctaLink: 'https://wa.me/5491162548659?text=Hola!%20Tengo%20una%20idea%20para%20una%20app%20Android'
  };

  proyectos: Proyecto[] = [
    {
      titulo: 'SortProject',
      descripcion: 'Sistema de gestión híbrido (Desktop + Web). Control completo de stock, ventas, compras, gastos y reportes. Funciona offline con sincronización en la nube. Versión web para vender desde el celular.',
      imagenUrl: '/assets/App/Menu.png',
      url: 'https://sortproject.arrambidetech.com',
      esProductoPropio: true,
      tecnologias: ['JavaFX', 'SQLite', 'Angular', 'PostgreSQL (Supabase)'],
      categoria: 'Desktop App',
      anio: '2025-2026'
    },
    {
      titulo: 'Gestión de Empleados',
      descripcion: 'Sistema de control de asistencia con integración de Hardware (Control remoto/Arduino). Reportes automáticos por email, gestión de licencias, vacaciones y cubiertas. Próximamente: huella dactilar.',
      imagenUrl: '',
      url: '#',
      esProductoPropio: true,
      tecnologias: ['Java', 'Arduino', 'Serial Communication'],
      categoria: 'Desktop App',
      anio: '2025-2026'
    },
    {
      titulo: 'Mezuri Carpintería',
      descripcion: 'Landing page profesional con catálogo para carpintería a medida. Diseño moderno con galerías de fotos, efectos visuales y formulario de contacto integrado con WhatsApp.',
      imagenUrl: '',
      url: 'https://mezuricarpinteria.arrambidetech.com/',
      esProductoPropio: false,
      tecnologias: ['Angular', 'TypeScript', 'CSS'],
      categoria: 'Web App',
      anio: '2025'
    },
    {
      titulo: 'HabitTracker',
      descripcion: 'Aplicación nativa Android para seguimiento de hábitos y rutinas diarias. Gráficos de progreso semanal y mensual, sistema de rachas y recordatorios personalizables.',
      imagenUrl: '',
      url: '#',
      esProductoPropio: true,
      tecnologias: ['Kotlin', 'Jetpack Compose', 'Android'],
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
    return proyecto.titulo === 'Gestión de Empleados' || proyecto.titulo === 'HabitTracker';
  }

  handleProjectClick(proyecto: Proyecto, event: Event): void {
    if (this.shouldOpenModal(proyecto)) {
      event.preventDefault();
      if (proyecto.titulo === 'Gestión de Empleados') {
        this.openGestionEmpleadosModal();
      } else if (proyecto.titulo === 'HabitTracker') {
        this.openHabitTrackerModal();
      }
    }
  }
}
