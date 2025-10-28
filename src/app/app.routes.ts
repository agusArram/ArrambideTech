import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
// import { ProductosComponent } from './pages/productos/productos';
import { ContactoComponent } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Arrambide Tech - SortProjet' },
  // { path: 'productos', component: ProductosComponent, title: 'Productos - AppInventario' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto - Arrambide Tech' },
  { path: '**', redirectTo: '' }
];
