import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

/** 404: el sitio "no reconoce" la página. Se muestra con estado 404 real (ver public/htaccess). */
@Component({
  selector: 'app-no-encontrada',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header></app-header>
    <main class="im-page nf">
      <div class="im-wrap nf__grid">
        <div class="nf__scan" aria-hidden="true">
          <span class="nf__c nf__c--tl"></span>
          <span class="nf__c nf__c--tr"></span>
          <span class="nf__c nf__c--bl"></span>
          <span class="nf__c nf__c--br"></span>
          <svg class="nf__face" viewBox="0 0 120 150" fill="none">
            <ellipse cx="60" cy="72" rx="38" ry="50" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 7" />
            <text x="60" y="92" text-anchor="middle" font-size="64" font-weight="600" fill="currentColor">?</text>
          </svg>
          <span class="nf__line"></span>
        </div>

        <div class="nf__copy">
          <p class="nf__status"><span class="nf__dot"></span> Acceso denegado · Error 404</p>
          <h1 class="nf__title">Te reconocemos a vos.<br /><span>A esta página, no.</span></h1>
          <p class="nf__lead">
            El link no existe o se mudó. Pasa hasta en los mejores sistemas: lo importante es que
            del otro lado hay alguien que responde.
          </p>
          <div class="nf__actions">
            <a class="im-btn im-btn--primary" routerLink="/">Volver al inicio</a>
            <a class="im-btn im-btn--ghost" routerLink="/soluciones">Ver casos en producción</a>
          </div>
          <p class="nf__log">
            GET {{ path }} → 404<br />
            decisión: denegado · motivo: la página no está registrada
          </p>
        </div>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      :host { display: block; background: var(--im-bg); }
      .nf { min-height: calc(100svh - 120px); display: grid; align-items: center; padding-top: 68px; }
      .nf__grid {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: clamp(2rem, 7vw, 6rem);
        align-items: center;
        padding-block: clamp(2rem, 6vw, 5rem);
      }
      .nf__scan {
        position: relative;
        aspect-ratio: 4 / 5;
        max-width: 340px;
        width: 100%;
        justify-self: center;
        border-radius: 22px;
        border: 1px solid var(--im-line);
        background: radial-gradient(70% 60% at 50% 45%, rgba(110, 231, 183, 0.07), transparent 70%), #0a0a0c;
        color: rgba(110, 231, 183, 0.65);
        overflow: hidden;
        display: grid;
        place-items: center;
      }
      .nf__face { width: 58%; }
      .nf__c { position: absolute; width: 30px; height: 30px; border: 2px solid var(--im-accent); opacity: 0.8; }
      .nf__c--tl { top: 16px; left: 16px; border-right: 0; border-bottom: 0; }
      .nf__c--tr { top: 16px; right: 16px; border-left: 0; border-bottom: 0; }
      .nf__c--bl { bottom: 16px; left: 16px; border-right: 0; border-top: 0; }
      .nf__c--br { bottom: 16px; right: 16px; border-left: 0; border-top: 0; }
      .nf__line {
        position: absolute;
        left: 8%;
        right: 8%;
        top: 12%;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--im-accent), transparent);
        box-shadow: 0 0 18px 2px rgba(110, 231, 183, 0.45);
        animation: nf-scan 3.4s cubic-bezier(0.45, 0, 0.25, 1) infinite;
      }
      @keyframes nf-scan {
        0%, 100% { transform: translateY(0); opacity: 0; }
        10%, 90% { opacity: 1; }
        50% { transform: translateY(340%); }
      }
      .nf__status {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        margin: 0 0 1.25rem;
        padding: 0.45rem 0.85rem;
        border-radius: 999px;
        border: 1px solid var(--im-line);
        font-size: 0.78rem;
        letter-spacing: 0.04em;
        color: var(--im-soft);
      }
      .nf__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--im-danger); }
      .nf__title {
        margin: 0;
        font-size: clamp(2.2rem, 6vw, 4.4rem);
        line-height: 1.02;
        letter-spacing: -0.045em;
        font-weight: 600;
      }
      .nf__title span { color: var(--im-accent); }
      .nf__lead { margin: 1.4rem 0 0; max-width: 34rem; font-size: 1.05rem; line-height: 1.6; color: var(--im-soft); }
      .nf__actions { margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }
      .nf__log {
        margin: 2.2rem 0 0;
        font: 0.76rem/1.7 ui-monospace, SFMono-Regular, Menlo, monospace;
        color: var(--im-muted);
        overflow-wrap: anywhere;
      }
      @media (max-width: 760px) {
        .nf__grid { grid-template-columns: 1fr; }
        .nf__scan { max-width: 220px; aspect-ratio: 1; }
        @keyframes nf-scan { 0%, 100% { transform: translateY(0); opacity: 0; } 10%, 90% { opacity: 1; } 50% { transform: translateY(260%); } }
      }
      @media (prefers-reduced-motion: reduce) { .nf__line { animation: none; opacity: 0.6; top: 50%; } }
    `,
  ],
})
export class NoEncontradaComponent {
  protected readonly path = (() => {
    try {
      return decodeURIComponent(window.location.pathname).slice(0, 60) || '/';
    } catch {
      return '/';
    }
  })();
}
