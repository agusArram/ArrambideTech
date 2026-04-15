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
      titulo: 'Arquitectura de Sistemas Propietarios',
      descripcion: 'Ingeniería de software de alta disponibilidad diseñada para centralizar procesos críticos en entornos Windows. Eliminamos la dependencia de terceros y aseguramos el control total sobre la lógica de negocio y los datos sensibles.',
      caracteristicas: [
        'Propiedad intelectual total',
        'Operación Offline redundante',
        'Cifrado de datos de grado militar',
        'Automatización de flujos complejos',
        'Soporte directo nivel Senior',
        'Arquitectura escalable'
      ],
      popular: true
    },
    {
      icono: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      titulo: 'Infraestructura Digital Premium',
      descripcion: 'Desarrollo de ecosistemas web de alto rendimiento orientados a la conversión y el posicionamiento de marca. No creamos sitios, construimos plataformas de adquisición de clientes con tecnología de vanguardia.',
      caracteristicas: [
        'Optimización CORE Web Vitals',
        'SEO Técnico Avanzado',
        'Gestión de contenidos Cloud',
        'Integración con CRMs externos',
        'Diseño de experiencia (UX) de lujo',
        'Seguridad SSL y Firewall activo'
      ]
    },
    {
      icono: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      titulo: 'Auditoría y Optimización Operativa',
      descripcion: 'Soluciones móviles y dashboards de inteligencia de negocios para supervisar rentabilidad y desempeño en tiempo real. Transformamos datos en decisiones estratégicas desde cualquier lugar del mundo.',
      caracteristicas: [
        'Dashboards de KPI personalizados',
        'Notificaciones inteligentes PUSH',
        'Sincronización multi-dispositivo',
        'Gestión de inventarios de precisión',
        'Control de costos y márgenes',
        'Acceso remoto seguro 24/7'
      ]
    },
    {
      icono: 'M13 10V3L4 14h7v7l9-11h-7z',
      titulo: 'Integración de Hardware/Software',
      descripcion: 'Convergencia tecnológica para infraestructuras físicas. Implementamos sistemas de control de acceso, monitoreo industrial y telemetría avanzada para erradicar brechas de seguridad y pérdidas operativas.',
      caracteristicas: [
        'Control Biométrico de precisión',
        'Telemetría y sensores en tiempo real',
        'Protocolos de seguridad física',
        'Control de personal automatizado',
        'Hardware de diseño industrial',
        'Mantenimiento preventivo incluido'
      ]
    }
  ];

  procesoDeTrabajo = [
    {
      numero: '01',
      titulo: 'Consultoría Técnica Estratégica',
      descripcion: 'Análisis exhaustivo de la infraestructura actual y detección de cuellos de botella operativos para definir el roadmap de la solución.',
      icono: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    {
      numero: '02',
      titulo: 'Arquitectura y Prototipado',
      descripcion: 'Diseño lógico de la base de datos y flujos de usuario. Entregamos un esquema detallado antes de escribir una sola línea de código.',
      icono: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    },
    {
      numero: '03',
      titulo: 'Ingeniería y Desarrollo Ciclo',
      descripcion: 'Codificación con estándares de seguridad STRIDE. El cliente supervisa el progreso mediante entregas parciales y demos en vivo.',
      icono: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    },
    {
      numero: '04',
      titulo: 'Implementación y Deployment',
      descripcion: 'Pruebas de estrés, capacitación del personal y despliegue final. Monitoreamos el sistema durante los primeros 30 días post-entrega.',
      icono: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];
}
