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
      title: 'Control de acceso para dos empresas con un mismo equipo',
      text: 'Cada persona entra según sus reglas y cada empresa ve solo lo suyo.',
      where: 'Marinas del Paraná Guazú',
      value: '26.500 → 560',
      unit: 'registros por actualización de saldos',
    },
    {
      id: 'pagos',
      verb: 'Cobra',
      title: 'Reservas con cobro online, sin comisión por operación',
      text: 'El cliente paga al reservar y el dinero va directo al comercio.',
      where: 'La Ñata · Demode',
      value: '0 %',
      unit: 'de comisión por cada cobro',
    },
    {
      id: 'ia',
      verb: 'Decide',
      title: 'Un asistente de IA que responde sobre tus datos',
      text: 'Una consulta por chat en lugar de buscar en planillas. Cada respuesta queda registrada.',
      where: 'Hospital Central de Pilar',
      value: '100 %',
      unit: 'de las consultas quedan registradas',
    },
  ];
}
