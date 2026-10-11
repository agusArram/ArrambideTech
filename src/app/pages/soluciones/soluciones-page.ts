import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';
import { RevealDirective } from '../../shared/reveal.directive';

interface Metric {
  value: string;
  label: string;
}

interface CaseStudy {
  id: string;
  index: string;
  pillar: string;
  title: string;
  client: string;
  status: string;
  challenge: string;
  /** Qué hicimos, en lenguaje de negocio. */
  plain: string[];
  metrics: Metric[];
  validation?: string[];
  /** Detalle para el equipo de sistemas del cliente (plegado). */
  tech: string[];
  stack: string[];
  link?: { url: string; label: string };
}

interface Work {
  name: string;
  kind: string;
  short: string;
  image: string;
  url?: string;
}

@Component({
  selector: 'app-soluciones-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ContactFormComponent, RevealDirective],
  templateUrl: './soluciones-page.html',
  styleUrl: './soluciones-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolucionesPageComponent {
  protected readonly cases: CaseStudy[] = [
    {
      id: 'acceso',
      index: '01',
      pillar: 'Reconoce',
      title: 'Control de acceso para dos empresas con un mismo equipo',
      client: 'Marinas del Paraná Guazú · Guazú Entre Ríos SRL',
      status: 'En producción',
      challenge:
        'Dos empresas comparten oficina y equipo en la puerta. Cada cliente debía entrar según su propia empresa, su horario y su deuda, sin que los datos se mezclaran y sin perder ningún movimiento si fallaba internet.',
      plain: [
        'Reconoce el rostro de cada persona y abre o niega el paso según sus reglas: horario, categoría o deuda.',
        'Cada empresa ve solo lo suyo, aunque compartan el mismo equipo físico.',
        'Si se cae la conexión, el sistema se recupera solo y no pierde ningún movimiento.',
        'Las fotos se guardan protegidas, con cifrado de nivel bancario.',
        'Un tablero muestra horas pico, perfil de clientes y deudas.',
      ],
      metrics: [
        { value: '26.500 → 560', label: 'registros por actualización de saldos' },
        { value: '350', label: 'movimientos recuperados tras dos semanas sin conexión' },
        { value: '10', label: 'versiones entregadas entre julio y septiembre de 2026' },
      ],
      validation: [
        'En uso diario con dos empresas sobre el mismo equipo.',
        'Cada versión resuelve un problema real de la operación.',
      ],
      tech: [
        'Terminales Hikvision DS-K1T673DWX integrados por ISAPI con Digest Auth. Solo personas viven en el terminal (límite de 10.000); la deuda se calcula en el servidor.',
        'Redirección activa entre empresas: cada evento se inyecta en la empresa que le corresponde sin importar cuál esté seleccionada. Un ancla en memoria hace avanzar el polling sin bucles ni duplicados.',
        'Filtro anti-ruido consciente del hardware: los accesos concedidos o denegados siempre se guardan; botón, puerta forzada y cierre se descartan si hay un acceso concedido en los 3 segundos previos.',
        'Saneamiento de identidades falsas: se vacía el ID que el terminal arrastra en eventos de infraestructura.',
        'Paginación consistente con identificador de búsqueda estable: 350 eventos recuperados en 7 consultas.',
        'Bóveda biométrica con AES-256-GCM y rollback si el hardware rechaza la imagen.',
        'Servidor interno en puerto reservado y detección de la IP de red real. Instancia única por IPC.',
        'CRM Analytics con límite de 10.000 registros bajo confirmación.',
      ],
      stack: ['Java 21', 'JavaFX 21', 'Hikvision ISAPI', 'Supabase', 'AES-256-GCM'],
    },
    {
      id: 'pagos',
      index: '02',
      pillar: 'Cobra',
      title: 'Reservas con cobro online, sin comisión por operación',
      client: 'La Ñata · Demode',
      status: 'En producción',
      challenge:
        'Cobrar señas y pagos completos sin que nadie pueda alterar el importe, sin quedarse con el dinero de terceros y sin mostrar turnos que ya no están disponibles.',
      plain: [
        'El cliente reserva y paga en el momento; el turno se confirma solo.',
        'El dinero va directo a la cuenta de cada comercio, sin intermediarios.',
        'El importe lo fija el sistema: nadie puede modificarlo desde el navegador.',
        'Si se suspende por lluvia, el saldo queda a favor del cliente para su próxima reserva.',
      ],
      metrics: [
        { value: '0 %', label: 'de comisión por cada cobro' },
        { value: '100 %', label: 'de la lógica de cobro protegida en el servidor' },
      ],
      tech: [
        'El navegador solo envía el identificador del turno y el tipo de pago; el servidor calcula el importe y crea la preferencia de Mercado Pago.',
        'Vinculación por OAuth con PKCE: cada comercio opera con su propio token.',
        'Webhooks resueltos en Edge Functions de Supabase: nada de la lógica de pago vive en el cliente.',
        'Idempotencia con vencimiento de 30 minutos y tolerancia a reintentos.',
        'Estados de turno en tiempo real con control de concurrencia.',
        'Aislamiento por comercio con RLS y verificación de pertenencia en cada función.',
      ],
      stack: ['Angular (PWA)', 'Supabase', 'Mercado Pago', 'Cloudflare Turnstile', 'Resend'],
      link: { url: 'https://www.lañata.com/', label: 'Ver La Ñata' },
    },
    {
      id: 'ia',
      index: '03',
      pillar: 'Decide',
      title: 'Un asistente de IA que responde sobre tus datos',
      client: 'Hospital Central de Pilar · Secretaría de Salud, Municipalidad de Pilar',
      status: 'En producción',
      challenge:
        'Consultar por chat la nómina de una institución de salud, con datos sensibles protegidos, sin respuestas inventadas y con un costo que no se dispare.',
      plain: [
        'Se pregunta por chat, como a una persona, y responde con datos reales.',
        'Solo consultan las personas autorizadas, y cada consulta queda registrada.',
        'La IA no inventa: la respuesta sale siempre de la base de datos de la institución.',
        'El costo por consulta es acotado y predecible.',
      ],
      metrics: [
        { value: '100 %', label: 'de las consultas quedan registradas' },
        { value: '~8.000', label: 'unidades de consumo por consulta, frente a más de 1.500.000 sin controles' },
      ],
      validation: [
        'En producción en el Hospital Central de Pilar.',
        'Costos medidos con consultas reales de uso cotidiano.',
      ],
      tech: [
        'Arquitectura de microservicios orquestada con n8n: Telegram, agente de IA y MySQL.',
        'Text-to-SQL restringido: la IA solo traduce la pregunta a una consulta que el sistema ejecuta.',
        'Zero Trust: lista blanca por identificador interno y alerta ante accesos no autorizados.',
        'Auditoría de cada consulta: fecha, usuario, pregunta, columnas y SQL ejecutado.',
        'LIMIT obligatorio y prohibido SELECT *: de más de 55 columnas se usan 8.',
        'ETL automatizado desde el Excel maestro con deduplicación por legajo.',
      ],
      stack: ['n8n', 'Google Gemini (LangChain)', 'MySQL', 'Telegram Bot API'],
    },
    {
      id: 'plataforma',
      index: '04',
      pillar: 'Decide',
      title: 'Un solo lugar para los sistemas de toda la institución',
      client: 'Municipalidad de Pilar',
      status: 'En producción',
      challenge:
        'Reunir varias bases de datos y sistemas en un tablero único, con una sola cuenta, sin que la falla de uno afecte a los demás.',
      plain: [
        'Un tablero principal reúne información de varios sistemas.',
        'Una sola cuenta para acceder a todo.',
        'Cada módulo es independiente: si uno falla, los demás siguen funcionando.',
        'Funciona en el servidor de la propia institución y todo está documentado.',
      ],
      metrics: [{ value: '4', label: 'módulos independientes sobre una base central' }],
      validation: ['En producción, operada desde el servidor de la propia institución.'],
      tech: [
        'Servicios aislados en una red privada de contenedores Docker, comunicados con una base maestra central.',
        'Autenticación centralizada para todos los módulos.',
        'Módulos: dashboard principal, ticketera y asistente de IA.',
        'Documentación de arquitectura, despliegue y migración.',
      ],
      stack: ['Docker', 'MySQL', 'Spring', 'Angular', 'n8n'],
    },
  ];

  protected readonly works: Work[] = [
    {
      name: 'SortProject',
      kind: 'Inventario y ventas',
      short: 'Tu comercio, con o sin internet.',
      image: '/assets/App/Menu.webp',
      url: 'https://sortproject.arrambidetech.com',
    },
    {
      name: 'Gestión de empleados',
      kind: 'Presentismo y sueldos',
      short: 'Fichaje y liquidación por horas.',
      image: '/assets/App/GestionEmpleados/Asistencia.webp',
    },
    {
      name: 'Demode',
      kind: 'Barberías',
      short: 'Reservas, caja y equipo en un lugar.',
      image: '/assets/App/Demode/Hero.webp',
      url: 'https://demodepeluqueria.com/',
    },
    {
      name: 'Hyder',
      kind: 'Portal corporativo',
      short: 'Contenido que ellos mismos actualizan.',
      image: '/assets/App/Hyder/hyder-preview.webp',
      url: 'https://hyder.com.ar/',
    },
    {
      name: 'Mezuri Carpintería',
      kind: 'Sitio institucional',
      short: 'Catálogo y presupuestos por WhatsApp.',
      image: '/assets/App/Mezuri/Hero.webp',
      url: 'https://mezuricarpinteria.arrambidetech.com/',
    },
    {
      name: 'HabitTracker',
      kind: 'App para celular',
      short: 'Hábitos, rachas y estadísticas.',
      image: '/assets/App/HabitTracker/Inicio.webp',
    },
  ];
}
