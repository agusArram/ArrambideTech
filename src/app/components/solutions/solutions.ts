import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SolutionCase {
  id: string;
  tag: string;
  title: string;
  problem: string;
  solution: string;
  justification: string;
  icon: string;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solutions.html',
  styleUrl: './solutions.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolutionsComponent {
  
  public cases = signal<SolutionCase[]>([
    {
      id: 'marinas',
      tag: 'IoT & Smart Routing',
      title: 'Ecosistema Biométrico Unificado (Marinas)',
      problem: 'La liquidación manual generaba ineficiencias, y el control vehicular dependía de procesos internos vulnerables, permitiendo fugas y el ingreso de morosos sin control estricto.',
      solution: 'Optimización de hardware con enrutamiento inteligente: Una terminal facial de alta gama procesa dos lógicas simultáneas. Si detecta a un activo, registra asistencia en Supabase (RRHH); si detecta a un cliente, valida el estado de cuenta local.',
      justification: 'Maximización del ROI mediante el uso de infraestructura dual. Erradica la vulnerabilidad en el acceso: si existe deuda, el sistema bloquea la apertura de forma autónoma. Al regularizarse, el impacto en barrera es menor a 15 segundos.',
      icon: '🔐'
    },
    {
      id: 'sortproject',
      tag: 'Desktop & Cloud Engineering',
      title: 'Gestión Omnicanal & POS (SortProject)',
      problem: 'Los ecosistemas de retail pierden control sobre la rentabilidad real y la velocidad transaccional, volviéndose inoperativos ante fallas de conectividad.',
      solution: 'Arquitectura híbrida: Núcleo de escritorio (Offline-First con SQLite local) para garantizar operatividad 24/7, sincronizado con un Dashboard de analítica en Supabase.',
      justification: 'Garantiza la continuidad operativa y la velocidad de procesamiento crítica. Facturación de alta frecuencia, soporte para periféricos industriales y control de rentabilidad milimétrico a nivel de base de datos.',
      icon: '⚙️'
    },
    {
      id: 'hyder',
      tag: 'Secure Corporate Portals',
      title: 'Portales Corporativos Autogestionables (Hyder)',
      problem: 'La dependencia de proveedores externos para actualizaciones operativas genera cuellos de botella y riesgos en la integridad de la información.',
      solution: 'Desarrollo de plataforma web dinámica con motor de administración centralizado, protegido mediante protocolos de autenticación robustos.',
      justification: 'Independencia operativa total para el cliente. Gestión autónoma de activos digitales (documentos, medios, noticias) sobre una infraestructura segura y escalable.',
      icon: '🏢'
    }
  ]);

  public expandedCaseId = signal<string | null>(null);

  toggleCase(id: string) {
    if (this.expandedCaseId() === id) {
      this.expandedCaseId.set(null);
    } else {
      this.expandedCaseId.set(id);
    }
  }
}
