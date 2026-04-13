import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, ContactFormComponent],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent {
  readonly contactInfo = [
    {
      icono: '🏢',
      titulo: 'Modalidad',
      valor: '100% Remoto / Global',
      link: '#'
    },
    {
      icono: '🛠️',
      titulo: 'Arquitectura',
      valor: 'Consultoría Técnica B2B',
      link: '#'
    }
  ];

  readonly faqs = [
    {
      pregunta: '¿Ofrecen consultoría arquitectónica?',
      respuesta: 'Sí, nos especializamos en diseñar la base técnica de sistemas complejos antes de iniciar el desarrollo, asegurando escalabilidad y eficiencia desde el día uno.'
    },
    {
      pregunta: '¿Puedo solicitar soporte para sistemas existentes?',
      respuesta: 'Evaluamos sistemas heredados para proponer planes de modernización o refactorización que mejoren el rendimiento operativo de tu empresa.'
    },
    {
      pregunta: '¿Cuál es el tiempo de respuesta inicial?',
      respuesta: 'Todos los leads B2B reciben una respuesta técnica preliminar en menos de 24 horas hábiles.'
    }
  ];
}
