import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Benefit {
  title: string;
  description: string;
  icon: string; // Cambiamos los emojis aquí
}

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits.html',
  styleUrl: './benefits.css'
})
export class BenefitsComponent {
  protected readonly benefits: Benefit[] = [
    {
      title: 'Para Tiendas de Ropa y Calzado',
      description: 'Gestiona talles, colores y modelos sin complicaciones. Cada variante con su propio stock y precio.',
      icon: '👕' // Mantenemos este, es relevante
    },
    {
      title: 'Modo Híbrido (Online/Offline)',
      description: 'Nunca pierdas una venta. SortProject sigue operando de forma local aunque se caiga internet. Tus datos se guardan al instante y se sincronizan con la nube automáticamente cuando recuperas la conexión.',
      icon: '🔄' // Cambiado a Sincronización/Ciclo
    },
    {
      title: 'Para Negocios que Buscan Crecer',
      description: 'Análisis de rentabilidad real para tomar decisiones basadas en datos, no en intuición.',
      icon: '💡' // Cambiado a Idea/Insight/Inteligencia
      // O podrías volver a usar 📈 aquí si '💡' no te convence
    }
  ];
}
