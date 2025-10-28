import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css'
})
export class PricingComponent {
  protected readonly plans: PricingPlan[] = [
    {
      name: 'DEMO',
      price: 'Gratis',
      period: 'Prueba de Potencial',
      description: 'Descubre todo el potencial con datos de prueba y límites de guardado.',
      features: [
        'Límite: 25 Productos',
        'Límite: 15 Ventas',
        'Límite: 10 Clientes',
        'Acceso a Dashboard (con datos de prueba)',
        'Acceso a Rentabilidad (con datos de prueba)',
        '1 usuario',
        'Soporte limitado'
      ],
      cta: 'Empezar Gratis'
    },
    {
      name: 'PLAN BASE',
      price: 'USD 40',
      period: '/mes',
      description: 'La herramienta esencial para emprendedores y feriantes.',
      features: [
        'Productos y ventas ilimitados',
        '1 usuario',
        'Gestión de Clientes',
        'Alertas de stock bajo',
        'Dashboard básico (datos reales)',
        'Exportación de productos a PDF',
        'Backup manual',
        'Soporte básico'
      ],
      cta: 'Comenzar Ahora',
      popular: true
    },
    {
      name: 'PLAN FULL',
      price: 'USD 70',
      period: '/mes',
      description: 'Para negocios consolidados que requieren análisis detallados.',
      features: [
        'Todo lo del Plan Base',
        'Hasta 5 usuarios',
        'Dashboard avanzado con comparativas',
        'Módulo de Rentabilidad completo',
        'Historial de precios',
        'Lista de faltantes/reposición',
        'Reportes automáticos',
        'Exportación completa (Ventas, Clientes, reportes)',
        'Backup automático',
        'Personalizable (columnas, colores)',
        'Soporte prioritario + mejoras'
      ],
      cta: 'Obtener Full'
    }
  ];
}
