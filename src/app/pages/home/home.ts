import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';
import { StoryComponent } from '../../components/story/story';
import { FaceDemoComponent } from '../../components/face-demo/face-demo';
import { ProofComponent } from '../../components/proof/proof';
import { RevealDirective } from '../../shared/reveal.directive';

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
    RevealDirective,
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
      text: 'Dos empresas comparten un terminal facial sin cruzarse datos.',
      where: 'Marinas del Paraná Guazú',
      value: '26.500 → 560',
      unit: 'registros por importación',
    },
    {
      id: 'pagos',
      verb: 'Cobra',
      title: 'Reservas y cobros con Mercado Pago',
      text: 'El monto lo decide el servidor y el dinero va directo al comercio.',
      where: 'La Ñata · Demode',
      value: '0 %',
      unit: 'comisión por transacción',
    },
    {
      id: 'ia',
      verb: 'Decide',
      title: 'Asistente de IA para consultas de RRHH',
      text: 'La IA traduce, el sistema ejecuta y cada consulta queda auditada.',
      where: 'Hospital Central de Pilar',
      value: '~8.000',
      unit: 'tokens por consulta',
    },
  ];
}
