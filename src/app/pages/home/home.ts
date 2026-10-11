import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { ContactFormComponent } from '../../components/contact-form/contact-form';
import { StoryComponent } from '../../components/story/story';
import { FaceDemoComponent } from '../../components/face-demo/face-demo';
import { ProofComponent } from '../../components/proof/proof';
import { PainPickerComponent } from '../../components/pain-picker/pain-picker';
import { LiveMonitorComponent } from '../../components/live-monitor/live-monitor';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ContactFormComponent,
    StoryComponent,
    FaceDemoComponent,
    ProofComponent,
    PainPickerComponent,
    LiveMonitorComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
