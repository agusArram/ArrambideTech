import { Routes } from '@angular/router';

// Componentes que viven en "pages"
import { HomeComponent } from './pages/home/home.ts';
import { ContactoComponent } from './pages/contacto/contacto.ts';

// Componentes que moviste a "components" pero usás como páginas
import { ServiciosComponent } from './components/servicios/servicios.ts';
import { PortafolioComponent } from './components/portafolio/portafolio.ts';

export const routes: Routes = [
  {
    path: '', // La ruta raíz
    component: HomeComponent,
    title: 'ArrambideTech | Inicio',
  },
  {
    path: 'servicios', // La ruta /servicios
    component: ServiciosComponent,
    title: 'ArrambideTech | Servicios',
  },
  {
    path: 'portafolio', // La ruta /portafolio
    component: PortafolioComponent,
    title: 'ArrambideTech | Portafolio',
  },
  {
    path: 'contacto', // La ruta /contacto
    component: ContactoComponent,
    title: 'ArrambideTech | Contacto',
  },
  // Redirección para cualquier ruta desconocida
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
