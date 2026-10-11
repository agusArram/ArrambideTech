import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal.directive';

interface Problem {
  tag: string;
  title: string;
  before: string;
  after: string;
  value: string;
  unit: string;
}

@Component({
  selector: 'app-proof',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './proof.html',
  styleUrl: './proof.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProofComponent {
  protected readonly problems: Problem[] = [
    {
      tag: 'Control de acceso',
      title: 'Actualizar saldos sin frenar el trabajo',
      before: 'Cada actualización procesaba 26.500 registros y volvía lento al equipo.',
      after: 'Ahora procesa solo 560, va directo al grano y corre en cualquier computadora.',
      value: '26.500 → 560',
      unit: 'registros por actualización',
    },
    {
      tag: 'Control de acceso',
      title: 'Volver a la normalidad tras días sin internet',
      before: 'Después de dos semanas sin conexión, el sistema solo traía una parte de lo ocurrido.',
      after: 'Recupera todo lo pendiente, completo y ordenado.',
      value: '350',
      unit: 'movimientos recuperados tras dos semanas sin conexión',
    },
    {
      tag: 'Dos empresas, un equipo',
      title: 'Que cada movimiento llegue a su empresa',
      before: 'Cada empresa ignoraba los movimientos de la otra y el sistema se trababa.',
      after: 'Cada movimiento va a la empresa que corresponde, sin perderse ni duplicarse.',
      value: '0',
      unit: 'movimientos perdidos entre empresas',
    },
    {
      tag: 'Operación diaria',
      title: 'Que se recupere solo si se apaga la PC',
      before: 'Al reiniciar la computadora, el equipo de la puerta podía quedar trabado.',
      after: 'Se recupera solo, sin que nadie tenga que intervenir.',
      value: '3',
      unit: 'protecciones automáticas contra el bloqueo',
    },
  ];
}
