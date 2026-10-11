import { Component, signal, HostListener, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../shared/reveal.directive';
import { ParticleCheckComponent } from '../particle-check/particle-check';

// Clave pública (publishable) del proyecto ArrambideTech-Core: está pensada para ir en el navegador.
// La tabla `leads` no es accesible con ella; solo la función `submit_web_lead`.
const SUPABASE_URL = 'https://wyvrbfmcsqrnilrqohfq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_lmp1AbveqoyEzSZCUZi2VQ_yVSdXOON';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, RevealDirective, ParticleCheckComponent],
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
    if (this.isDropdownOpen()) {
      // Que se vea la lista completa sin tener que deslizar.
      setTimeout(() => this.root().querySelector('.cf__select')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
    }
  }

  selectOption(option: string): void {
    this.selectedChallenge.set(option);
    this.isDropdownOpen.set(false);
    // Sigue el recorrido: después de elegir, el cursor pasa al mensaje.
    setTimeout(() => this.root().querySelector<HTMLTextAreaElement>('textarea')?.focus(), 60);
  }

  private root(): HTMLElement {
    return this.el.nativeElement as HTMLElement;
  }

  /** Al tocar un campo, se lo acomoda en el centro de la pantalla (así el teclado no lo tapa). */
  @HostListener('focusin', ['$event'])
  onFocusIn(event: FocusEvent): void {
    const t = event.target as HTMLElement;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) || t.type === 'hidden') return;
    setTimeout(() => t.scrollIntoView({ behavior: 'smooth', block: 'center' }), 280);
  }

  /** Enter en un campo de una línea pasa al siguiente en lugar de enviar el formulario. */
  nextField(event: Event, next: 'empresa' | 'contacto' | 'select'): void {
    event.preventDefault();
    if (next === 'select') {
      if (!this.isDropdownOpen()) this.toggleDropdown();
      return;
    }
    this.root().querySelector<HTMLInputElement>(`input[name="${next}"]`)?.focus();
  }

  async enviarFormulario(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    this.enviando.set(true);
    this.mensajeEstado.set(null);

    try {
      const formData = new FormData(form);
      const fields = Object.fromEntries(formData) as Record<string, string>;
      // El campo trampa solo es para la base de datos; el correo no lo necesita.
      const { website = '', ...forEmail } = fields;

      // Dos destinos en paralelo: el correo (Web3Forms) y la base de datos (Supabase).
      // Alcanza con que uno funcione: nunca se pierde un mensaje porque el otro esté caído.
      const [mail, db] = await Promise.allSettled([
        this.enviarCorreo(forEmail),
        this.guardarLead(fields, website),
      ]);
      const mailOk = mail.status === 'fulfilled' && mail.value;
      const dbOk = db.status === 'fulfilled' && db.value;
      if (!mailOk && !dbOk) throw new Error('No se pudo enviar por ningún canal');

      form.reset();
      this.selectedChallenge.set('');
      this.mensajeEstado.set(null);
      this.enviado.set(true);
      // La página se acorta al reemplazar el formulario: se lleva la vista a la confirmación.
      setTimeout(() => this.root().querySelector('.cf__done')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
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

  private async enviarCorreo(fields: Record<string, string>): Promise<boolean> {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(fields),
    });
    return response.status === 200;
  }

  private async guardarLead(fields: Record<string, string>, honeypot: string): Promise<boolean> {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_web_lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({
        p_name: fields['nombre'] ?? '',
        p_company: fields['empresa'] ?? '',
        p_contact: fields['contacto'] ?? '',
        p_need: fields['necesidad'] ?? '',
        p_message: fields['mensaje'] ?? '',
        p_honeypot: honeypot,
      }),
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { ok?: boolean };
    return data.ok === true;
  }

  nuevoMensaje(): void {
    this.enviado.set(false);
    this.mensajeEstado.set(null);
  }
}
