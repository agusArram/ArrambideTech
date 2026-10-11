import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ServiciosComponent } from './pages/servicios/servicios';
import { SolucionesPageComponent } from './pages/soluciones/soluciones-page';
import { ContactoComponent } from './pages/contacto/contacto';
import { NoEncontradaComponent } from './pages/no-encontrada/no-encontrada';

/** `data.description` alimenta la meta description y los avisos al compartir (ver App). */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Arrambide Tech · Reconocen. Deciden. Cobran.',
    data: {
      description:
        'Reconocimiento facial sobre hardware Hikvision, pagos integrados con Mercado Pago e inteligencia artificial aplicada. Sistemas que ya funcionan en producción.',
    },
  },
  {
    path: 'servicios',
    component: ServiciosComponent,
    title: 'Capacidades · Arrambide Tech',
    data: {
      description:
        'Qué construimos: sistemas que reconocen a las personas, deciden con inteligencia artificial y cobran sin que nadie persiga pagos.',
    },
  },
  {
    path: 'soluciones',
    component: SolucionesPageComponent,
    title: 'Casos en producción · Arrambide Tech',
    data: {
      description:
        'Casos reales en producción: control de acceso con reconocimiento facial, respuestas con IA, cobros integrados y plataformas a medida.',
    },
  },
  {
    path: 'contacto',
    component: ContactoComponent,
    title: 'Contacto · Arrambide Tech',
    data: {
      description: 'Contanos qué proceso querés automatizar. Respondemos con una evaluación técnica en menos de 24 horas hábiles.',
    },
  },
  {
    path: '**',
    component: NoEncontradaComponent,
    title: 'Página no encontrada · Arrambide Tech',
    data: { noindex: true, description: 'La página que buscás no existe o cambió de lugar.' },
  },
];
