import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Se arranca la aplicación recién después del primer pintado: así el navegador muestra
 * el fondo oscuro de inmediato y no queda en blanco mientras Angular se inicializa.
 */
const start = (): void => {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
};

if (typeof requestAnimationFrame === 'function') {
  requestAnimationFrame(() => setTimeout(start, 0));
} else {
  start();
}
