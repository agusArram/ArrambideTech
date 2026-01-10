import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Servicio {
  icono: string;
  titulo: string;
  descripcion: string;
  caracteristicas: string[];
  precio?: string;
  popular?: boolean;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class ServiciosComponent {
  servicios: Servicio[] = [
    {
      icono: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      titulo: 'Desarrollo Desktop Corporativo',
      descripcion: 'Software de alto rendimiento para Windows. Ideal para gestión pesada, administración y control de stock que funciona sin depender de internet.',
      caracteristicas: [
        'Funciona Offline (sin internet)',
        'Base de datos local segura (SQLite)',
        'Reportes avanzados en PDF y Excel',
        'Integración con Hardware (lectores, impresoras)',
        'Sincronización opcional en la nube',
        'Instalación y capacitación incluida'
      ],
      popular: true
    },
    {
      icono: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      titulo: 'Desarrollo Web a Medida',
      descripcion: 'Sitios web y aplicaciones progresivas (PWA) para dar presencia digital a tu negocio. Desde landing pages hasta sistemas de gestión web.',
      caracteristicas: [
        'Diseño Responsive (Celular/PC)',
        'Panel de administración propio',
        'Velocidad de carga optimizada',
        'SEO básico incluido',
        'Formularios de contacto integrados',
        'Hosting y dominio (opcional)'
      ]
    },
    {
      icono: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      titulo: 'Apps Android Nativas',
      descripcion: 'Aplicaciones móviles reales (no híbridas lentas) para sacar el máximo provecho del teléfono. Rendimiento fluido y acceso completo a funciones del dispositivo.',
      caracteristicas: [
        'Desarrollo nativo con Kotlin',
        'Notificaciones push personalizadas',
        'Uso de cámara y sensores',
        'Funcionamiento fluido y rápido',
        'Publicación en Play Store',
        'Base de datos local (Room)'
      ]
    },
    {
      icono: 'M13 10V3L4 14h7v7l9-11h-7z',
      titulo: 'Automatización y Hardware (IoT)',
      descripcion: '¿Necesitás conectar el mundo real con el software? Desarrollo soluciones que unen electrónica y sistemas. Control de accesos, sensores y automatización.',
      caracteristicas: [
        'Lectores de huella dactilar',
        'Molinetes y control de acceso',
        'Controles remotos personalizados',
        'Sensores de temperatura/humedad',
        'Arduino/ESP32/Raspberry Pi',
        'Comunicación Serial y Bluetooth'
      ]
    }
  ];

  procesoDeTrabajo = [
    {
      numero: '01',
      titulo: 'Consulta Inicial',
      descripcion: 'Conversamos sobre tu proyecto, tus necesidades y objetivos. Analizamos la viabilidad y te damos una cotización sin compromiso.',
      icono: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    {
      numero: '02',
      titulo: 'Planificación',
      descripcion: 'Definimos funcionalidades, tecnologías a usar, cronograma y presupuesto detallado. Te enviamos un plan completo del proyecto.',
      icono: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    },
    {
      numero: '03',
      titulo: 'Desarrollo',
      descripcion: 'Comenzamos a construir tu solución con actualizaciones regulares. Puedes ver el progreso y hacer ajustes durante el proceso.',
      icono: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    },
    {
      numero: '04',
      titulo: 'Pruebas y Entrega',
      descripcion: 'Realizamos pruebas exhaustivas, capacitación y finalmente entregamos tu proyecto listo para usar con toda la documentación.',
      icono: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];
}
