import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ServiciosComponent } from './pages/servicios/servicios';
import { SolucionesPageComponent } from './pages/soluciones/soluciones-page';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'ArrambideTech | Soluciones de Software y Desarrollo Web' },
  { path: 'servicios', component: ServiciosComponent, title: 'Servicios | ArrambideTech' },
  { path: 'soluciones', component: SolucionesPageComponent, title: 'Ingeniería de Soluciones | ArrambideTech' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto | ArrambideTech' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
