import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  /** Cosa escondida: cinco toques seguidos. */
  protected founderEgg(): void {
    window.dispatchEvent(new CustomEvent('at:egg', { detail: { id: 'founder' } }));
  }
}
