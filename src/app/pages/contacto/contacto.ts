import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent {
  protected readonly enviando = signal(false);
  protected readonly mensajeEstado = signal<{tipo: 'success' | 'error', texto: string} | null>(null);

  readonly contactInfo = [
    {
      icono: '📧',
      titulo: 'Email',
      valor: 'arrambide.agustin@gmail.com',
      link: 'mailto:arrambide.agustin@gmail.com'
    },
    {
      icono: '💬',
      titulo: 'WhatsApp',
      valor: 'Escribime personalmente',
      link: 'https://wa.me/5491162548659'
    }
  ];

  readonly faqs = [
    {
      pregunta: '¿Ofrecen soporte técnico?',
      respuesta: 'Asi es, ofrezco soporte tecnico completo por WhatsApp y les brindo la documentacion detallada por email.'
    },
    {
      pregunta: '¿Puedo solicitar nuevas funcionalidades?',
      respuesta: 'Valoro mucho sus ideas y mejoras, me encantaria escucharlas y ver como mejorar los servicios que les brindo.'
    },
    {
      pregunta: '¿Cuánto tiempo tarda la respuesta?',
      respuesta: 'Respondo todo en menos de 24 horas hábiles.'
    }
  ];

  async enviarFormulario(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    this.enviando.set(true);
    this.mensajeEstado.set(null);

    try {
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const data = await response.json();

      if (response.status === 200) {
        this.mensajeEstado.set({
          tipo: 'success',
          texto: '¡Mensaje recibido! Te voy a estar respondiendo en breve.'
        });
        form.reset();
      } else {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      this.mensajeEstado.set({
        tipo: 'error',
        texto: 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo o escribe directamente a arrambide.agustin@gmail.com'
      });
    } finally {
      this.enviando.set(false);

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        this.mensajeEstado.set(null);
      }, 5000);
    }
  }
}
