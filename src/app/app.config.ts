import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
// 1. Importa 'withInMemoryScrolling'
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2. Aquí aplicas el cambio, agregando 'withInMemoryScrolling'
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // <-- Esta es la línea que soluciona el problema
      })
    )
  ]
};
