import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal.directive';
import { ProximityDirective } from '../../shared/proximity.directive';

interface Pain {
  id: string;
  /** Lo que diría el cliente, en primera persona. */
  pain: string;
  system: string;
  where: string;
  value: string;
  unit: string;
  text: string;
}

@Component({
  selector: 'app-pain-picker',
  standalone: true,
  imports: [RouterLink, RevealDirective, ProximityDirective],
  templateUrl: './pain-picker.html',
  styleUrl: './pain-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainPickerComponent {
  protected readonly pains: Pain[] = [
    {
      id: 'acceso',
      pain: 'No sé quién entra ni si debía entrar.',
      system: 'Control de acceso con reconocimiento facial',
      where: 'Marinas del Paraná Guazú',
      value: '2 en 1',
      unit: 'dos empresas comparten un equipo sin mezclar datos',
      text: 'Cada persona entra según sus reglas y cada empresa ve solo lo suyo.',
    },
    {
      id: 'ia',
      pain: 'Mi equipo busca datos en planillas todo el día.',
      system: 'Asistente de IA por chat',
      where: 'Hospital Central de Pilar',
      value: '100 %',
      unit: 'de las consultas quedan registradas',
      text: 'Se pregunta por chat y responde con tus datos reales, sin inventar.',
    },
    {
      id: 'pagos',
      pain: 'Pierdo horas cobrando y conciliando pagos.',
      system: 'Reservas con cobro online',
      where: 'La Ñata · Demode',
      value: '0 %',
      unit: 'de comisión por cada cobro',
      text: 'El cliente paga al reservar y el dinero va directo a tu cuenta.',
    },
    {
      id: 'plataforma',
      pain: 'Tengo sistemas que no se hablan entre sí.',
      system: 'Un solo lugar para todos tus sistemas',
      where: 'Municipalidad de Pilar',
      value: '1 cuenta',
      unit: 'para entrar a todo, con módulos independientes',
      text: 'Un tablero reúne la información y, si un módulo falla, los demás siguen.',
    },
  ];

  protected readonly current = signal(0);

  protected pick(i: number): void {
    this.current.set(i);
  }
}
