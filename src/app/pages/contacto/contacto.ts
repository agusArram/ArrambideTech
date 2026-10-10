import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ContactFormComponent],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactoComponent {
  protected readonly faqs = [
    {
      q: '¿Qué pasa después de escribir?',
      a: 'Respondemos con una evaluación técnica preliminar en menos de 24 horas hábiles. Si hay encaje, agendamos una conversación para entender el proceso y proponer una arquitectura.',
    },
    {
      q: '¿Trabajan con hardware que ya tenemos?',
      a: 'Sí, cuando expone una interfaz utilizable. Hoy integramos terminales Hikvision por ISAPI, placas ESP32, lectores y escáneres. Evaluamos el equipamiento antes de comprometernos.',
    },
    {
      q: '¿Dónde viven los datos?',
      a: 'Depende del caso: en la infraestructura del cliente (por ejemplo, un servidor institucional) o en la nube con aislamiento por organización y cifrado de la información sensible.',
    },
    {
      q: '¿Pueden sumarse a un sistema existente?',
      a: 'Sí. Evaluamos lo que hay y proponemos modernizar por etapas o integrar sin reemplazar todo.',
    },
    {
      q: '¿Qué soporte hay después de la entrega?',
      a: 'Soporte directo con el ingeniero que construyó el sistema, documentación y actualizaciones versionadas.',
    },
  ];
}
