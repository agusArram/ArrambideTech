import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ServiciosComponent } from './pages/servicios/servicios';
import { SolucionesPageComponent } from './pages/soluciones/soluciones-page';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Arrambide Tech | Software y Desarrollo' },
  { path: 'servicios', component: ServiciosComponent, title: 'Arrambide Tech | Servicios' },
  { path: 'soluciones', component: SolucionesPageComponent, title: 'Arrambide Tech | Portfolio' },
  { path: 'contacto', component: ContactoComponent, title: 'Arrambide Tech | Contacto' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
