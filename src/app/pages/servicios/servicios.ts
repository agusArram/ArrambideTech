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
      icono: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      titulo: 'Desarrollo Web',
      descripcion: 'Creamos sitios web modernos, responsivos y optimizados para todos los dispositivos. Desde landing pages hasta plataformas web complejas.',
      caracteristicas: [
        'Diseño responsive y mobile-first',
        'Optimización SEO avanzada',
        'Integración con bases de datos',
        'Panel de administración personalizado',
        'Alta velocidad y performance',
        'Certificado SSL incluido'
      ],
      precio: 'Desde $500 USD'
    },
    {
      icono: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      titulo: 'Software Desktop a Medida',
      descripcion: 'Desarrollamos aplicaciones desktop personalizadas para Windows. Sistemas de gestión, inventarios, puntos de venta y herramientas empresariales.',
      caracteristicas: [
        'Aplicaciones nativas para Windows',
        'Base de datos robusta (SQLite/PostgreSQL)',
        'Sistema de reportes e impresión',
        'Módulos personalizados según necesidad',
        'Instalación y capacitación incluida',
        'Actualizaciones automáticas'
      ],
      precio: 'Desde $1,000 USD',
      popular: true
    },
    {
      icono: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      titulo: 'Aplicaciones Móviles',
      descripcion: 'Apps móviles multiplataforma con React Native o Flutter. Una única base de código para iOS y Android.',
      caracteristicas: [
        'Desarrollo híbrido (iOS + Android)',
        'Diseño de UI/UX profesional',
        'Integración con APIs',
        'Notificaciones push',
        'Publicación en stores',
        'Soporte post-lanzamiento'
      ],
      precio: 'Desde $2,000 USD'
    },
    {
      icono: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
      titulo: 'APIs y Backend',
      descripcion: 'Desarrollo de APIs RESTful y backends escalables. Conexión con bases de datos, autenticación y servicios cloud.',
      caracteristicas: [
        'APIs REST/GraphQL',
        'Autenticación JWT/OAuth',
        'Base de datos SQL/NoSQL',
        'Documentación completa',
        'Hosting y deployment',
        'Monitoreo y logs'
      ],
      precio: 'Desde $800 USD'
    },
    {
      icono: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      titulo: 'E-commerce',
      descripcion: 'Tiendas online completas con carrito de compras, pasarelas de pago y gestión de inventario.',
      caracteristicas: [
        'Catálogo de productos ilimitado',
        'Carrito y checkout optimizado',
        'Integración con MercadoPago/Stripe',
        'Panel de administración',
        'Gestión de envíos',
        'Reportes de ventas'
      ],
      precio: 'Desde $1,500 USD'
    },
    {
      icono: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      titulo: 'Mantenimiento y Soporte',
      descripcion: 'Actualizaciones, mejoras continuas y soporte técnico para mantener tu software siempre actualizado y funcionando.',
      caracteristicas: [
        'Soporte técnico prioritario',
        'Actualizaciones mensuales',
        'Corrección de errores',
        'Mejoras de performance',
        'Backups automáticos',
        'Monitoreo 24/7'
      ],
      precio: 'Desde $200 USD/mes'
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
