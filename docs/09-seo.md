# 09 · SEO

## Qué hay
- **Un HTML por ruta** generado después del build (`scripts/seo-postbuild.mjs`, corre con `npm run build`): título, descripción, canonical, Open Graph / Twitter y datos estructurados propios (`WebPage` + `BreadcrumbList`), más un bloque `<noscript>` con texto y enlaces. También genera `404.html` con `noindex`.
- **Cambios en el cliente** (`src/app/app.ts`): al navegar se actualizan descripción, canonical, `og:*` y `robots` según `data` de cada ruta en `app.routes.ts`.
- **Datos estructurados globales** (`src/index.html`): `Organization` (logo 512 px con fondo oscuro), `ProfessionalService` (Argentina), `WebSite` y los productos.
- **Compartir**: `assets/og-image.png` (1200×630), `twitter:card=summary_large_image`.
- **Íconos**: pestaña con la A transparente (16/32); Google con variantes de fondo oscuro (48/96/192/512) y `apple-touch-icon`; `site.webmanifest`.
- **Rastreo**: `sitemap.xml` (URLs con barra final), `robots.txt` (bloquea `/mediapipe/`), `.htaccess` con redirección a `https://arrambidetech.com` (sin www, con HTTPS) y 404 real (`ErrorDocument /404.html`).

## Al agregar una página
1. Ruta en `app.routes.ts` con `title` y `data.description`.
2. Entrada en `ROUTES` de `scripts/seo-postbuild.mjs` (mismo título y descripción).
3. URL con barra final en `public/sitemap.xml`.

## Después de desplegar
- Search Console: "Inspeccionar URL" → "Solicitar indexación" en la home y las 3 páginas; reenviar `sitemap.xml`.
- Probar vistas previas: WhatsApp, LinkedIn (Post Inspector) y X.
- Prueba de resultados enriquecidos de Google sobre la home (datos estructurados).
- Cambiar el nombre del sitio en Google se refleja en días; el ícono, en una a dos semanas.

## Pendiente
- Prerender completo del contenido (hoy Google ejecuta JavaScript; otros bots ven el resumen `<noscript>`).
- Alta en Bing Webmaster Tools y Google Business Profile.
- Reseñas / menciones externas (LinkedIn, GitHub) enlazando al dominio.
