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
      valor: '+54 9 11 6254-8659',
      link: 'https://wa.me/5491162548659'
    },
    {
      icono: '💻',
      titulo: 'GitHub',
      valor: '@sortproyects',
      link: 'https://github.com/agusArram'
    }
  ];

  readonly faqs = [
    {
      pregunta: '¿Cuánto tiempo tarda la respuesta?',
      respuesta: 'Respondemos todas las consultas en un plazo máximo de 24 horas hábiles.'
    },
    {
      pregunta: '¿Ofrecen soporte técnico?',
      respuesta: 'Sí, ofrecemos soporte técnico completo por email y documentación detallada.'
    },
    {
      pregunta: '¿Puedo solicitar nuevas funcionalidades?',
      respuesta: 'Por supuesto! Valoramos mucho el feedback de nuestros usuarios y los incentivo a que me digan mejoras.'
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
          texto: data.message || '¡Mensaje enviado con éxito! Te responderemos pronto.'
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
