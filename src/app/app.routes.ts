import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ServiciosComponent } from './pages/servicios/servicios';
import { PortafolioComponent } from './pages/portafolio/portafolio';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'ArrambideTech | Soluciones de Software y Desarrollo Web' },
  { path: 'servicios', component: ServiciosComponent, title: 'Servicios | ArrambideTech' },
  { path: 'portafolio', component: PortafolioComponent, title: 'Portafolio | ArrambideTech' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto | ArrambideTech' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
