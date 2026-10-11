import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ServiciosComponent } from './pages/servicios/servicios';
import { SolucionesPageComponent } from './pages/soluciones/soluciones-page';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Arrambide Tech · Reconocen. Deciden. Cobran.' },
  { path: 'servicios', component: ServiciosComponent, title: 'Capacidades · Arrambide Tech' },
  { path: 'soluciones', component: SolucionesPageComponent, title: 'Casos en producción · Arrambide Tech' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto · Arrambide Tech' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
