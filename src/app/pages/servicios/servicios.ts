import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';
import { RevealDirective } from '../../shared/reveal.directive';

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
  imports: [RouterLink, HeaderComponent, FooterComponent, ContactFormComponent, RevealDirective],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiciosComponent {
  protected readonly capabilities: Capability[] = [
    {
      id: 'reconoce',
      index: '01',
      verb: 'Reconocen',
      title: 'Control de acceso con reconocimiento facial',
      intro: 'Sabés quién entra, cuándo y si está al día, sin guardias ni planillas.',
      builds: [
        'Reconoce a cada persona en segundos con un equipo instalado en la puerta.',
        'Abre o niega el paso según reglas: horario, categoría o deuda.',
        'Ves en tu pantalla, en vivo, quién entró y a quién se le negó el paso.',
        'Informes de horas pico y de comportamiento de tus clientes.',
      ],
      how: [
        'Equipos de marca (Hikvision) conectados a un software propio.',
        'Las fotos se guardan protegidas con cifrado de nivel bancario.',
        'Varias empresas pueden compartir el mismo equipo sin mezclar datos.',
        'Si se cae internet, el sistema se recupera y no pierde movimientos.',
      ],
      fit: 'Barrios cerrados, marinas, edificios, fábricas y cualquier lugar donde importe quién entra.',
      caseId: 'acceso',
    },
    {
      id: 'decide',
      index: '02',
      verb: 'Deciden',
      title: 'Asistentes de inteligencia artificial para tu operación',
      intro: 'Tu equipo pregunta por chat y recibe la respuesta de tus propios datos, con registro de cada consulta.',
      builds: [
        'Consultas en lenguaje natural por Telegram o WhatsApp.',
        'Carga automática de tus planillas a una base ordenada.',
        'Flujos que conectan tus sistemas y avisan cuando algo se sale de lo normal.',
        'Un tablero que reúne información de varios sistemas.',
      ],
      how: [
        'La IA no inventa: responde siempre con datos de tu propia base.',
        'Solo accede quien está autorizado y cada consulta queda registrada.',
        'El consumo está acotado, por lo que el costo es predecible.',
        'Cada módulo es independiente: si uno falla, los demás siguen.',
      ],
      fit: 'Áreas de RRHH, atención y administración que pierden horas buscando, copiando y cruzando información.',
      caseId: 'ia',
    },
    {
      id: 'cobra',
      index: '03',
      verb: 'Cobran',
      title: 'Cobros automáticos dentro de tu sistema',
      intro: 'El cliente paga en el momento y vos dejás de conciliar pagos a mano.',
      builds: [
        'Cobro de señas y de pagos completos con Mercado Pago.',
        'El dinero va directo a tu cuenta.',
        'Si hay que cancelar, el saldo queda a favor del cliente.',
        'Avisos y comprobantes automáticos por email.',
      ],
      how: [
        'El importe lo calcula el servidor: nadie puede cambiarlo desde el navegador.',
        'Toda la lógica de cobro corre protegida en el backend.',
        'Cada comercio opera con su propia cuenta, aislado de los demás.',
        'Tolera reintentos y notificaciones duplicadas sin cobrar dos veces.',
      ],
      fit: 'Reservas, suscripciones, plataformas con varios comercios y negocios que hoy concilian pagos manualmente.',
      caseId: 'pagos',
    },
  ];

  protected readonly others = [
    { t: 'Sistemas a medida', d: 'Programas de escritorio y web que funcionan aunque falle internet.' },
    { t: 'Apps para celular', d: 'Aplicaciones Android hechas a medida de tu negocio.' },
    { t: 'Equipos físicos conectados', d: 'Lectores, molinetes y sensores que hablan con tu sistema.' },
    { t: 'Sitios y portales', d: 'Páginas que vos mismo podés actualizar y que se encuentran en Google.' },
  ];

  protected readonly steps = [
    { n: '01', t: 'Entendemos tu problema', d: 'Vemos cómo trabajás hoy y cuánto te cuesta hacerlo así.' },
    { n: '02', t: 'Lo planificamos', d: 'Definimos qué se construye, cuánto lleva y cuánto cuesta, antes de empezar.' },
    { n: '03', t: 'Lo construimos', d: 'Entregas cortas: ves el avance cada semana.' },
    { n: '04', t: 'Lo ponemos a trabajar', d: 'Instalación, capacitación y mejoras a medida que lo usás.' },
  ];

  protected readonly principles = [
    { t: 'Probado antes de entregado', d: 'Nada llega a tus manos sin haber sido verificado.' },
    { t: 'Tus datos, protegidos', d: 'La seguridad vive en el servidor, no en la pantalla.' },
    { t: 'Todo documentado', d: 'Cada decisión y cada cambio queda por escrito.' },
    { t: 'Cada cliente, aislado', d: 'Los datos de una empresa nunca se mezclan con los de otra.' },
  ];
}
