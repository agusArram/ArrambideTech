import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ModalComponent, ModalContent } from '../../components/modal/modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    FooterComponent,
    ModalComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  protected readonly isModalOpen = signal(false);
  protected modalContent = signal<ModalContent | null>(null);

  protected readonly empleadosMarinasContent: ModalContent = {
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

  protected readonly appsAndroidContent: ModalContent = {
    title: 'Apps Android a Medida',
    description: 'Desarrollamos aplicaciones móviles nativas para Android con Kotlin y Jetpack Compose. Desde apps de productividad hasta soluciones empresariales personalizadas.',
    features: [
      'Desarrollo nativo con Kotlin y Jetpack Compose',
      'Diseño Material Design moderno',
      'Integración con bases de datos locales y en la nube',
      'Notificaciones push y recordatorios personalizables',
      'Sincronización en tiempo real',
      'Ejemplo: HabitTracker - App de seguimiento de hábitos con gráficos, rachas y estadísticas'
    ],
    ctaText: 'Hablemos de tu idea',
    ctaLink: 'https://wa.me/5491162548659?text=Hola!%20Tengo%20una%20idea%20para%20una%20app%20Android'
  };

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

  openEmpleadosMarinasModal(): void {
    this.openModal(this.empleadosMarinasContent);
  }

  openAppsAndroidModal(): void {
    this.openModal(this.appsAndroidContent);
  }
}
