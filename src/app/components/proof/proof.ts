import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal.directive';

interface Result {
  /** Qué parte de la operación mejoró (en palabras de negocio). */
  topic: string;
  value: string;
  /** Qué significa el número, en una oración. */
  meaning: string;
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
    {
      topic: 'Actualizar las deudas de los clientes',
      value: '26.500 → 560',
      meaning: 'Antes se cargaban 26.500 registros cada vez. Ahora son 560 y funciona en cualquier computadora.',
    },
    {
      topic: 'Después de dos semanas sin internet',
      value: '350',
      meaning: 'El sistema recuperó los 350 movimientos de entrada y salida que habían quedado pendientes.',
    },
    {
      topic: 'Dos empresas comparten la misma puerta',
      value: '0',
      meaning: 'Ningún movimiento se perdió ni se mezcló entre una empresa y la otra.',
    },
    {
      topic: 'Si se apaga la computadora',
      value: '3',
      meaning: 'Tres protecciones automáticas: el sistema se recupera solo, sin llamar a nadie.',
    },
  ];
}
