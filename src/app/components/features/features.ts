import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
  benefit: string;
  isStarFeature?: boolean;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesComponent {
  protected readonly features: Feature[] = [
    {
      icon: '📦',
      title: 'Inventario Inteligente',
      description: 'Registra productos, gestiona variantes (talle, color, peso) y recibe alertas automáticas cuando el stock llega al mínimo.',
      benefit: 'Evita quiebres de stock y sabe qué tienes en tiempo real.'
    },
    {
      icon: '🧾',
      title: 'Punto de Venta Ágil',
      description: 'Un módulo diseñado para ser rápido. Registra transacciones, anula ventas (con restauración de stock) y asocia clientes en segundos.',
      benefit: 'Menos tiempo en la caja, más tiempo atendiendo clientes.'
    },
    {
      icon: '📊',
      title: 'Dashboard y Métricas',
      description: 'Gráficos claros que te muestran el valor de tu inventario, ventas diarias/mensuales y tu Top 10 de productos más vendidos.',
      benefit: 'Toma decisiones con datos reales, no con suposiciones.'
    },
    {
      icon: '📈',
      title: 'Análisis de Rentabilidad',
      description: 'Descubre tu margen de ganancia real por cada producto y categoría. Optimiza tus precios y maximiza tus ingresos.',
      benefit: 'Enfócate en vender lo que realmente te da más ganancia.'
    },
    {
      icon: '💾',
      title: 'Backup Local y Sincronización',
      description: 'Tu inventario se respalda en una base de datos local (SQLite). Puedes consultar tus productos sin conexión y sincronizar los datos desde la nube.',
      benefit: 'Tus datos están seguros y accesibles, estés donde estés.',
      isStarFeature: true
    },
    {
      icon: '👥',
      title: 'Gestión de Clientes',
      description: 'Lleva un registro de tus clientes. Asocia ventas a sus perfiles y consulta su historial de compras para ofrecer un servicio personalizado.',
      benefit: 'Fideliza a tus clientes conociendo qué te compran.'
    }
  ];
}
