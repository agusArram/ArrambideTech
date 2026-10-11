import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal.directive';

interface Result {
  value: string;
  title: string;
  line: string;
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
  protected readonly results: Result[] = [
    { value: '26.500 → 560', title: 'Actualizar saldos sin frenar el trabajo', line: 'Ahora corre en cualquier computadora.' },
    { value: '350', title: 'Movimientos recuperados tras 2 semanas sin internet', line: 'Todo lo pendiente, completo.' },
    { value: '0', title: 'Movimientos perdidos entre dos empresas', line: 'Un solo equipo para las dos.' },
    { value: '3', title: 'Protecciones si se apaga la PC', line: 'Se recupera solo.' },
  ];
}
