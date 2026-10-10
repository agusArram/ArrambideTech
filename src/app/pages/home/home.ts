import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';
import { StoryComponent } from '../../components/story/story';
import { FaceDemoComponent } from '../../components/face-demo/face-demo';
import { ProofComponent } from '../../components/proof/proof';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    FooterComponent,
    ContactFormComponent,
    StoryComponent,
    FaceDemoComponent,
    ProofComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly cases = [
    {
      id: 'acceso',
      verb: 'Reconoce',
      title: 'Control de acceso biométrico multi-empresa',
      text: 'Dos empresas, un mismo terminal facial, cero cruces de datos. En producción en Marinas del Paraná Guazú.',
    },
    {
      id: 'pagos',
      verb: 'Cobra',
      title: 'Reservas y cobros con Mercado Pago',
      text: 'El monto lo decide el servidor y el dinero va directo al comercio. En producción en La Ñata y Demode.',
    },
    {
      id: 'ia',
      verb: 'Decide',
      title: 'Asistente de IA para consultas de RRHH',
      text: 'La IA traduce, el sistema ejecuta y todo queda auditado. En producción en la Municipalidad de Pilar.',
    },
  ];
}
