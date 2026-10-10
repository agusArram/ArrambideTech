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
  solution: string[];
  metrics: Metric[];
  stack: string[];
  validation?: string[];
  link?: { url: string; label: string };
}

interface Work {
  name: string;
  kind: string;
  text: string;
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
      title: 'Control de acceso biométrico multi-empresa',
      client: 'Marinas del Paraná Guazú · Guazú Entre Ríos SRL',
      status: 'En producción',
      challenge:
        'Dos empresas comparten oficina y terminal. El hardware repite identidades, descarta o duplica eventos y debe seguir operando aunque la red falle. Cada cliente debía quedar en su empresa, con su deuda y su horario, sin cruces.',
      solution: [
        'Terminales Hikvision DS-K1T673DWX integrados por ISAPI con Digest Auth. Solo personas viven en el terminal (límite de 10.000); la deuda se calcula en el servidor.',
        'Redirección activa entre empresas: cada evento se inyecta en la empresa que le corresponde sin importar cuál esté seleccionada. Un ancla en memoria hace avanzar el polling sin bucles ni duplicados.',
        'Filtro anti-ruido que conoce el hardware: los accesos concedidos o denegados siempre se guardan; botón, puerta forzada y cierre se descartan si hay un acceso concedido en los 3 segundos previos.',
        'Saneamiento de identidades falsas: el terminal arrastra el ID del último usuario en eventos de infraestructura; se vacía en origen para que el monitor no atribuya una persona a un botón.',
        'Paginación consistente con identificador de búsqueda estable: tras dos semanas sin conexión, un terminal con 350 eventos se recupera en 7 consultas.',
        'Bóveda biométrica: la imagen aceptada por el terminal se cifra con AES-256-GCM y se resguarda en almacenamiento privado; si el hardware la rechaza, no se guarda.',
        'Servidor interno en un puerto reservado y detección de la IP de red real (ignora adaptadores virtuales). Instancia única por IPC: un segundo doble clic despierta la ventana ya abierta.',
        'CRM Analytics: horas pico, perfilado de clientes, filtros por empresa y protección de rendimiento con límite de 10.000 registros bajo confirmación.',
      ],
      metrics: [
        { value: '26.500 → 560', label: 'registros en la importación de saldos' },
        { value: '350 / 7', label: 'eventos recuperados en 7 consultas' },
        { value: '10', label: 'releases en la línea 1.9 (julio–septiembre 2026)' },
      ],
      stack: ['Java 21', 'JavaFX 21', 'Hikvision ISAPI', 'Supabase', 'AES-256-GCM', 'GitHub Releases (actualización)'],
      validation: [
        'En operación diaria con dos empresas sobre el mismo terminal.',
        'Cada release documentado con su causa raíz y la corrección aplicada.',
      ],
    },
    {
      id: 'pagos',
      index: '02',
      pillar: 'Cobra',
      title: 'Reservas y cobros con Mercado Pago, multi-comercio',
      client: 'La Ñata · Demode',
      status: 'En producción',
      challenge:
        'Cobrar señas y pagos totales sin que el cliente pueda manipular el importe, sin quedarse con el dinero de terceros y sin que la grilla de turnos muestre disponibilidad falsa.',
      solution: [
        'El navegador solo envía el identificador del turno y el tipo de pago. El servidor calcula el importe desde la base y crea la preferencia de Mercado Pago.',
        'Vinculación por OAuth con PKCE: cada comercio opera con su propio token y el dinero va directo a su cuenta. Sin comisión por transacción; cuota fija mensual.',
        'Webhooks resueltos en Edge Functions de Supabase: toda la lógica de pago vive en el backend, nada en el cliente.',
        'Idempotencia con vencimiento de 30 minutos y tolerancia a reintentos de notificación.',
        'Estados de turno en tiempo real (Pendiente de pago, Pago total, Suspendido) con control de concurrencia en la reserva.',
        'Billetera virtual ante suspensiones por lluvia: la seña se acredita como saldo a favor en lugar de esperar 10 a 30 días de reintegro bancario.',
        'Aislamiento por comercio con RLS y verificación de pertenencia en cada función.',
      ],
      metrics: [
        { value: '0 %', label: 'comisión por transacción' },
        { value: '100 %', label: 'de la lógica de pago en el backend' },
      ],
      stack: ['Angular (PWA)', 'Supabase · Edge Functions · Realtime · RLS', 'Mercado Pago', 'Cloudflare Turnstile', 'Resend'],
      link: { url: 'https://www.lañata.com/', label: 'Ver La Ñata' },
    },
    {
      id: 'ia',
      index: '03',
      pillar: 'Decide',
      title: 'Asistente de IA para consultas de RRHH',
      client: 'Hospital Central de Pilar · Secretaría de Salud, Municipalidad de Pilar',
      status: 'En producción',
      challenge:
        'Consultar la nómina de una Secretaría de Salud por chat, en lenguaje natural, sin exponer datos a terceros, sin respuestas inventadas y sin que el consumo de la IA se descontrole.',
      solution: [
        'Arquitectura de microservicios orquestada con n8n: Telegram como interfaz, un agente de IA como traductor y MySQL como única fuente de verdad.',
        'Text-to-SQL restringido: la IA no tiene la base en memoria, solo traduce la pregunta a una consulta que el sistema ejecuta de forma determinista.',
        'Zero Trust: lista blanca por identificador interno de Telegram (no por nombre de usuario) y alerta ante accesos no autorizados.',
        'Auditoría silenciosa: cada consulta registra fecha, usuario, pregunta, columnas y el SQL ejecutado.',
        'Control de consumo: LIMIT obligatorio y prohibido SELECT *; de más de 55 columnas se usan 8. Un error de desbordamiento que llegó a ~138.000 tokens quedó acotado.',
        'ETL automatizado: normaliza el Excel maestro de RRHH, deduplica por legajo y hace carga masiva.',
        'Canal de observaciones: la IA captura las correcciones del usuario y n8n las deriva a una planilla de control de calidad.',
      ],
      metrics: [
        { value: '~8.162', label: 'tokens por consulta (promedio medido)' },
        { value: '>1.500.000', label: 'tokens por iteración sin las restricciones' },
        { value: '8 de 55+', label: 'columnas consultadas por ficha' },
      ],
      stack: ['n8n', 'Google Gemini (LangChain)', 'MySQL', 'Telegram Bot API', 'Google Sheets (auditoría)'],
      validation: [
        'En producción en el Hospital Central de Pilar.',
        'Benchmarks medidos con consultas reales de uso cotidiano.',
        'Cada consulta ejecutada queda registrada y es auditable.',
      ],
    },
    {
      id: 'plataforma',
      index: '04',
      pillar: 'Decide',
      title: 'Plataforma de microservicios institucional',
      client: 'Municipalidad de Pilar',
      status: 'En producción',
      challenge:
        'Concentrar múltiples bases de datos y APIs en un tablero principal, con inicio de sesión centralizado, sin que la falla de un sistema tumbe a los demás.',
      solution: [
        'Servicios aislados en una red privada de contenedores Docker, comunicados con una base maestra central.',
        'Autenticación centralizada: un solo usuario para todos los módulos, sin repetir cuentas.',
        'Módulos independientes: dashboard principal, ticketera y asistente de IA. Si uno se rompe, solo cae ese.',
        'Todo operado desde el servidor de la propia institución, con documentación de arquitectura, despliegue y migración.',
      ],
      metrics: [{ value: '4', label: 'módulos independientes sobre una base central' }],
      stack: ['Docker', 'MySQL', 'Spring', 'Angular', 'n8n'],
      validation: [
        'En producción en la Municipalidad de Pilar, operada desde el servidor de la propia institución.',
        'Documentación de arquitectura, despliegue y migración.',
      ],
    },
  ];

  protected readonly works: Work[] = [
    {
      name: 'SortProject',
      kind: 'SaaS · Inventario y ventas',
      text: 'Punto de venta y trazabilidad de stock offline-first, de escritorio y web, con sincronización en la nube.',
      image: '/assets/App/Menu.webp',
      url: 'https://sortproject.arrambidetech.com',
    },
    {
      name: 'Gestión de empleados',
      kind: 'Presentismo y nómina',
      text: 'Fichaje por QR, ESP32 o reconocimiento facial, con reportes automáticos y liquidación por horas trabajadas.',
      image: '/assets/App/GestionEmpleados/Asistencia.webp',
    },
    {
      name: 'Demode',
      kind: 'SaaS · Barberías',
      text: 'Reservas, permisos por rol (dueño, caja, peluquero), e-commerce y métricas en tiempo real.',
      image: '/assets/App/Demode/Hero.webp',
      url: 'https://demodepeluqueria.com/',
    },
    {
      name: 'Hyder',
      kind: 'Portal corporativo B2B',
      text: 'Portal para una firma de aduana y logística con CMS a medida y autogestión total de contenidos.',
      image: '/assets/App/Hyder/hyder-preview.webp',
      url: 'https://hyder.com.ar/',
    },
    {
      name: 'Mezuri Carpintería',
      kind: 'Sitio institucional',
      text: 'Catálogo digital con galería y cierre de presupuestos por WhatsApp. Publicado y posicionado.',
      image: '/assets/App/Mezuri/Hero.webp',
      url: 'https://mezuricarpinteria.arrambidetech.com/',
    },
    {
      name: 'HabitTracker',
      kind: 'App Android nativa',
      text: 'Kotlin y Jetpack Compose con arquitectura limpia, rachas y estadísticas.',
      image: '/assets/App/HabitTracker/Inicio.webp',
    },
  ];
}
