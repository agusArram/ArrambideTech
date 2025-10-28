import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <--- IMPORTANTE

// Importamos los componentes que SÍ van siempre
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

// BORRAMOS HomeComponent de los imports

@Component({
  selector: 'app-root',
  standalone: true,
  // Asegurate de que los imports se vean así:
  imports: [
    CommonModule,
    RouterOutlet, // <--- IMPORTANTE
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  title = 'SortProyects';
}
