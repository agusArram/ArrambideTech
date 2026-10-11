// Después de `ng build`: genera un HTML por ruta con su propio título, descripción, canonical,
// datos para compartir y datos estructurados, más un 404.html. Así buscadores y vistas previas
// (WhatsApp, LinkedIn, X) ven la información correcta sin ejecutar JavaScript.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://arrambidetech.com';
const OUT = 'dist/browser';
const OG = `${SITE}/assets/og-image.png`;

// Mantener sincronizado con src/app/app.routes.ts
const ROUTES = [
  {
    path: '',
    name: 'Inicio',
    title: 'Arrambide Tech · Reconocimiento facial, pagos e IA aplicada',
    description:
      'Reconocimiento facial sobre hardware Hikvision, pagos integrados con Mercado Pago e inteligencia artificial aplicada. Sistemas que ya funcionan en producción.',
    h1: 'Reconocen. Deciden. Cobran.',
    text: 'Sistemas que controlan quién entra con reconocimiento facial, responden con inteligencia artificial y cobran sin que nadie persiga pagos. En producción.',
  },
  {
    path: 'servicios',
    name: 'Capacidades',
    title: 'Capacidades: control de acceso, pagos e IA · Arrambide Tech',
    description:
      'Qué construimos: sistemas que reconocen a las personas, deciden con inteligencia artificial y cobran sin que nadie persiga pagos.',
    h1: 'Capacidades',
    text: 'Reconocimiento facial integrado a hardware real, pagos integrados con Mercado Pago y automatización con IA, diseñados para no fallar.',
  },
  {
    path: 'soluciones',
    name: 'Casos',
    title: 'Casos en producción · Arrambide Tech',
    description:
      'Casos reales en producción: control de acceso con reconocimiento facial, respuestas con IA, cobros integrados y plataformas a medida.',
    h1: 'Casos en producción',
    text: 'Control de acceso para empresas, asistente de IA para instituciones, cobros integrados y plataformas a medida.',
  },
  {
    path: 'contacto',
    name: 'Contacto',
    title: 'Contacto · Arrambide Tech',
    description:
      'Contanos qué proceso querés automatizar. Respondemos con una evaluación técnica en menos de 24 horas hábiles.',
    h1: 'Hablemos',
    text: 'Contanos qué proceso querés automatizar. Respondemos con una evaluación técnica en menos de 24 horas hábiles.',
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const urlOf = (p) => (p ? `${SITE}/${p}/` : `${SITE}/`);
const base = readFileSync(join(OUT, 'index.html'), 'utf8');

function render(r, { noindex = false } = {}) {
  const url = urlOf(r.path);
  let html = base;
  const set = (re, to) => {
    if (!re.test(html)) throw new Error(`No se encontró ${re} en index.html`);
    html = html.replace(re, to);
  };
  set(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  set(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(r.description)}">`);
  set(/<meta name="title" content="[^"]*">/, `<meta name="title" content="${esc(r.title)}">`);
  set(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(r.title)}">`);
  set(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(r.description)}">`);
  set(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  set(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(r.title)}">`);
  set(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(r.description)}">`);
  set(/<meta name="twitter:url" content="[^"]*">/, `<meta name="twitter:url" content="${url}">`);
  set(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  if (noindex) set(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');

  if (!noindex) {
    const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: urlOf('') }];
    if (r.path) crumbs.push({ '@type': 'ListItem', position: 2, name: r.name, item: url });
    const ld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': r.path === 'contacto' ? 'ContactPage' : 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: r.title,
          description: r.description,
          inLanguage: 'es-AR',
          isPartOf: { '@id': `${SITE}/#website` },
          about: { '@id': `${SITE}/#organization` },
          primaryImageOfPage: { '@type': 'ImageObject', url: OG, width: 1200, height: 630 },
        },
        { '@type': 'BreadcrumbList', itemListElement: crumbs },
      ],
    };
    html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);
  }

  const links = ROUTES.map((x) => `<a href="${urlOf(x.path)}">${esc(x.name)}</a>`).join(' · ');
  const body = noindex
    ? `<h1>Página no encontrada</h1><p>La página que buscás no existe o cambió de lugar.</p><p><a href="/">Volver al inicio</a></p>`
    : `<h1>${esc(r.h1)}</h1><p>${esc(r.text)}</p><nav>${links}</nav><p>Arrambide Tech — Argentina. WhatsApp: <a href="https://wa.me/5491162548659">+54 9 11 6254-8659</a></p>`;
  html = html.replace('<app-root></app-root>', `<app-root></app-root>\n  <noscript><main style="font-family:sans-serif;max-width:40rem;margin:4rem auto;padding:0 1.5rem;color:#f4f4f2">${body}</main></noscript>`);
  return html;
}

for (const r of ROUTES) {
  if (r.path) mkdirSync(join(OUT, r.path), { recursive: true });
  writeFileSync(join(OUT, r.path, 'index.html'), render(r));
}
writeFileSync(
  join(OUT, '404.html'),
  render({ path: '', name: '404', title: 'Página no encontrada · Arrambide Tech', description: 'La página que buscás no existe o cambió de lugar.', h1: '', text: '' }, { noindex: true }),
);
console.log(`SEO: ${ROUTES.length} rutas + 404.html generadas en ${OUT}`);
