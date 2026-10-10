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
      tag: 'v1.9.9',
      title: 'Importar saldos sin frenar la operación',
      before: 'Cada importación subía 26.500 datos y el proceso se hacía pesado.',
      after: 'Ahora sube 560, directo al grano, y corre en cualquier equipo.',
      value: '26.500 → 560',
      unit: 'registros por importación',
    },
    {
      tag: 'v1.9.3',
      title: 'Recuperar dos semanas sin conexión',
      before: 'El terminal devolvía siempre los mismos 50 eventos y el resto quedaba afuera.',
      after: 'Una búsqueda estable pagina correctamente y trae todo lo pendiente.',
      value: '350 en 7',
      unit: 'eventos recuperados en 7 consultas',
    },
    {
      tag: 'v1.9.5',
      title: 'Dos empresas sobre el mismo terminal',
      before: 'Cada empresa descartaba los eventos de la otra y el sistema se atascaba.',
      after: 'Cada evento se redirige a su empresa, sin descartes ni duplicados.',
      value: '0',
      unit: 'eventos descartados entre empresas (por diseño)',
    },
    {
      tag: 'v1.9.1',
      title: 'Reiniciar la PC sin colapsar el terminal',
      before: 'Otro programa tomaba el puerto y el terminal terminaba saturado.',
      after: 'Puerto reservado y detección de la IP real: el sistema se recupera solo.',
      value: '3 defensas',
      unit: 'puerto propio · IP real · barrera anti-clones',
    },
  ];
}
