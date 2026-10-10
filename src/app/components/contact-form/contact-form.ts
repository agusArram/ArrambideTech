import { Component, signal, HostListener, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {
  protected readonly enviando = signal(false);
  protected readonly enviado = signal(false);
  protected readonly mensajeEstado = signal<{tipo: 'success' | 'error', texto: string} | null>(null);

  // Custom Select Signals
  protected readonly isDropdownOpen = signal(false);
  protected readonly selectedChallenge = signal('');
  protected readonly desafios = [
    'Reconocimiento facial / control de acceso',
    'Pagos integrados',
    'Automatización con IA (n8n)',
    'Sistema a medida',
    'Otro'
  ];

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    // Si el clic es fuera del componente de dropdown, lo cerramos
    if (!this.el.nativeElement.contains(targetElement)) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleDropdown(): void {
    if (this.enviando()) return;
    this.isDropdownOpen.update(v => !v);
  }

  selectOption(option: string): void {
    this.selectedChallenge.set(option);
    this.isDropdownOpen.set(false);
  }

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
        form.reset();
        this.selectedChallenge.set('');
        this.mensajeEstado.set(null);
        this.enviado.set(true);
      } else {
        throw new Error(data.message || 'Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      this.mensajeEstado.set({
        tipo: 'error',
        texto: 'No pudimos enviar el mensaje. Probá de nuevo o escribinos a arrambide.agustin@gmail.com'
      });
    } finally {
      this.enviando.set(false);
    }
  }

  nuevoMensaje(): void {
    this.enviado.set(false);
    this.mensajeEstado.set(null);
  }
}
