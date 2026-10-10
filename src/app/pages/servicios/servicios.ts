import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';

interface Capability {
  id: string;
  index: string;
  verb: string;
  title: string;
  intro: string;
  builds: string[];
  how: string[];
  fit: string;
  caseId: string;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, ContactFormComponent],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiciosComponent {
  protected readonly capabilities: Capability[] = [
    {
      id: 'reconoce',
      index: '01',
      verb: 'Reconoce',
      title: 'Reconocimiento facial y control de acceso',
      intro:
        'Terminales biométricos de marca integrados a un software propio: quién entra, cuándo, bajo qué regla y con qué respaldo.',
      builds: [
        'Enrolamiento y sincronización de personas con terminales Hikvision por ISAPI.',
        'Monitor de eventos en tiempo real: accesos concedidos, denegados y autorizaciones manuales.',
        'Reglas por categoría y horario, deuda o estado de cuenta, y gestión de invitados.',
        'Analítica de flujo: horas pico, perfilado y alertas.',
      ],
      how: [
        'Solo personas en el terminal; la lógica de negocio en el servidor.',
        'Imágenes biométricas cifradas con AES-256-GCM, con rollback si el hardware rechaza.',
        'Multi-empresa sobre el mismo terminal, con redirección y sin pérdida de eventos.',
        'Operación ante falta de red y actualizaciones automáticas.',
      ],
      fit: 'Barrios cerrados, marinas, edificios corporativos, plantas y cualquier lugar con control de ingreso y morosidad.',
      caseId: 'acceso',
    },
    {
      id: 'cobra',
      index: '02',
      verb: 'Cobra',
      title: 'Pagos integrados y facturación',
      intro:
        'Cobros dentro del propio sistema, conciliados y a prueba de manipulación: el cliente paga y el sistema ya sabe qué hacer.',
      builds: [
        'Mercado Pago (Checkout Pro / Bricks) con señas, pagos totales y estados en tiempo real.',
        'Vinculación de cuentas por OAuth para operar multi-comercio.',
        'Billetera virtual, saldos a favor y manejo de cancelaciones.',
        'Avisos automáticos por email y recibos para usuarios sin cuenta.',
      ],
      how: [
        'El importe lo calcula el servidor, nunca el navegador.',
        'Webhooks en Edge Functions: toda la lógica de pago en el backend.',
        'Idempotencia y tolerancia a reintentos.',
        'Aislamiento por comercio con políticas a nivel de fila.',
      ],
      fit: 'Reservas, suscripciones, plataformas para varios comercios y negocios que hoy concilian pagos a mano.',
      caseId: 'pagos',
    },
    {
      id: 'decide',
      index: '03',
      verb: 'Decide',
      title: 'Automatización y agentes de IA',
      intro:
        'Flujos con n8n y asistentes que consultan tus datos reales, con control de acceso, auditoría y consumo acotado.',
      builds: [
        'Asistentes por Telegram o WhatsApp que consultan bases propias en lenguaje natural.',
        'ETL: normalización y carga de planillas hacia bases relacionales.',
        'Flujos que conectan sistemas, notifican y escalan excepciones.',
        'Tableros que concentran múltiples bases y APIs.',
      ],
      how: [
        'La IA traduce; el sistema ejecuta. Sin la base en memoria, sin respuestas inventadas.',
        'Lista blanca por identidad y registro de cada consulta.',
        'Límites de consulta y de columnas para un consumo predecible.',
        'Microservicios aislados: si uno falla, no cae el resto.',
      ],
      fit: 'Áreas de RRHH, atención y administración que pierden horas buscando, copiando y cruzando información.',
      caseId: 'ia',
    },
  ];

  protected readonly others = [
    { t: 'Software de escritorio y web a medida', d: 'Java/JavaFX y Angular, con operación offline y sincronización.' },
    { t: 'Apps Android nativas', d: 'Kotlin y Jetpack Compose con arquitectura limpia.' },
    { t: 'IoT y hardware', d: 'Placas ESP32, lectores, molinetes y sensores conectados a la nube.' },
    { t: 'Portales corporativos', d: 'Sitios con gestor de contenidos a medida y SEO técnico.' },
  ];

  protected readonly steps = [
    { n: '01', t: 'Diagnóstico', d: 'Entendemos el proceso, sus excepciones y qué cuesta hoy hacerlo mal.' },
    { n: '02', t: 'Arquitectura', d: 'Definimos datos, seguridad y puntos de falla antes de escribir código.' },
    { n: '03', t: 'Construcción', d: 'Entregas cortas con pruebas automatizadas y visibilidad semanal.' },
    { n: '04', t: 'Operación', d: 'Puesta en marcha, capacitación, monitoreo y mejoras continuas.' },
  ];

  protected readonly principles = [
    { t: 'Pruebas primero', d: 'No se escribe código sin una prueba que lo valide.' },
    { t: 'Seguridad en el backend', d: 'Los controles del navegador son experiencia; la seguridad vive en el servidor.' },
    { t: 'Documentación viva', d: 'Cada decisión y cada release queda documentado y versionado.' },
    { t: 'Aislamiento por cliente', d: 'Multi-tenancy estricta: los datos de uno no tocan los de otro.' },
  ];
}
