import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Texto numérico con dígitos que giran como un odómetro al cambiar el valor. */
@Component({
  selector: 'app-odometer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="od" [attr.aria-label]="value()" role="text">
      @for (c of chars(); track $index) {
        @if (c.digit !== null) {
          <span class="od__d" aria-hidden="true">
            <span class="od__col" [style.transform]="'translateY(' + -c.digit + 'em)'">
              @for (n of nums; track n) {
                <span>{{ n }}</span>
              }
            </span>
          </span>
        } @else {
          <span class="od__s" aria-hidden="true">{{ c.ch }}</span>
        }
      }
    </span>
  `,
  styles: [
    `
      .od {
        display: inline-flex;
        align-items: flex-end;
        font-variant-numeric: tabular-nums;
        line-height: 1;
      }
      .od__d {
        display: inline-block;
        height: 1em;
        overflow: hidden;
      }
      .od__col {
        display: flex;
        flex-direction: column;
        transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .od__col > span {
        display: block;
        height: 1em;
        line-height: 1em;
      }
      .od__s {
        display: inline-block;
        height: 1em;
        line-height: 1em;
        white-space: pre;
      }
      @media (prefers-reduced-motion: reduce) {
        .od__col {
          transition: none;
        }
      }
    `,
  ],
})
export class OdometerComponent {
  readonly value = input.required<string>();
  protected readonly nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  protected readonly chars = computed(() =>
    Array.from(this.value()).map((ch) => ({
      ch: ch === ' ' ? ' ' : ch,
      digit: /[0-9]/.test(ch) ? Number(ch) : null,
    })),
  );
}
