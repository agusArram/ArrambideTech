import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent {
  readonly producto = {
    nombre: 'AppInventario',
    version: '2.3.2',
    descripcion: 'Sistema de Gestión de Inventario, Ventas y Precios (SaaS) - La solución para pequeños y medianos comercios que buscan control total sobre su stock, ventas y precios',
    caracteristicas: [
      {
        titulo: 'Inventario (Stock)',
        descripcion: 'Registro de productos, variantes (talle/color), movimientos de stock automáticos y alertas de stock bajo',
        icono: '📦'
      },
      {
        titulo: 'Ventas',
        descripcion: 'Registro ágil de transacciones, anulación de ventas, historial y análisis del Top 10 de productos vendidos',
        icono: '💰'
      },
      {
        titulo: 'Métricas (Dashboard)',
        descripcion: 'Resumen visual en tiempo real: valor del inventario, ventas diarias/mensuales, y gráficos comparativos de rendimiento',
        icono: '📊'
      },
      {
        titulo: 'Rentabilidad',
        descripcion: 'Análisis de márgenes de ganancia por producto y categoría para optimizar precios y compras',
        icono: '💹'
      },
      {
        titulo: 'Sincronización (SaaS)',
        descripcion: 'Datos seguros y accesibles desde cualquier lugar, guardados automáticamente en la nube (PostgreSQL/Supabase)',
        icono: '☁️'
      },
      {
        titulo: 'Multi-tenant',
        descripcion: 'Arquitectura SaaS con aislamiento total de datos por cliente y hasta 5 usuarios en plan Full',
        icono: '👥'
      }
    ],
    requisitos: {
      sistema: 'SaaS - Acceso desde cualquier navegador web moderno',
      baseDatos: 'PostgreSQL (Gestionado por Supabase)',
      arquitectura: 'Multi-tenant con aislamiento de datos por cliente',
      tecnologia: 'Pool de conexiones HikariCP, Verificación de Licencias (bcrypt)'
    },
    repositorio: 'https://github.com/agusArram/AppInventario/tree/Dev'
  };
}
