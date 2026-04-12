import { Component, signal } from '@angular/core';
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
  styleUrl: './solutions.css'
})
export class SolutionsComponent {
  
  public cases = signal<SolutionCase[]>([
    {
      id: 'marinas',
      tag: 'IoT & Smart Routing',
      title: 'Ecosistema Biométrico Unificado (Marinas)',
      problem: 'La liquidación manual generaba ineficiencias, y el control vehicular dependía del "amiguismo", permitiendo fugas y el ingreso de morosos sin control estricto.',
      solution: 'Optimización de hardware con enrutamiento inteligente: Una única terminal facial (Hikvision Ultra) procesa dos lógicas simultáneas. Si lee a un empleado, registra su asistencia en Supabase (RRHH); si lee a un cliente, consulta el sistema de morosidad local.',
      justification: 'Para maximizar el ROI del cliente usando un solo equipo. Elimina el "amiguismo" en la barrera: si adeuda, la pantalla avisa y no abre. Al pagar, impacta en 15 segundos y la barrera se abre antes de que el cliente suba al auto.',
      icon: '🔐'
    },
    {
      id: 'sortproject',
      tag: 'Desktop & Cloud Engineering',
      title: 'Gestión Omnicanal & POS (SortProject)',
      problem: 'Los negocios físicos pierden control sobre su rentabilidad real, tienen ventas lentas y los sistemas en la nube los dejan inoperativos si se corta el WiFi.',
      solution: 'SaaS híbrido: App de Escritorio en Java (Offline-First con SQLite local) para el POS, hiper-sincronizada con un Dashboard Web integral en Supabase.',
      justification: 'Para vender sin interrupciones y a máxima velocidad. Facturación ultrarrápida, soporte térmico, PDFs y control de rentabilidad milimétrico. Devuelve paz mental y control total.',
      icon: '⚙️'
    },
    {
      id: 'hyder',
      tag: 'Secure Corporate Portals',
      title: 'Portales Corporativos Autogestionables (Hyder)',
      problem: 'Las empresas dependen de desarrolladores externos para actualizaciones simples, generando cuellos de botella operativos y gastos innecesarios.',
      solution: 'Plataforma web dinámica con panel de administración 100% autogestionable, protegido mediante autenticación segura y CAPTCHA anti-bots.',
      justification: 'Independencia total al cliente. Permite subir noticias, PDFs o fotos desde cualquier lugar sin intermediarios. La web se convierte en una herramienta de comunicación viva y segura.',
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
