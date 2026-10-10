# 08 · Hosting: ¿migrar o mantener Hostinger?

> Esta nota reemplaza a la versión inicial, que asumía Vercel. Agustín aclaró que **no tiene cuenta de Vercel** y que el dominio `arrambidetech.com` es propio.

## Recomendación

**Mantener Hostinger como origen** y, si el DNS lo permite, **poner Cloudflare (plan gratuito) adelante**. No migrar a Vercel por ahora.

## Por qué

1. **El sitio es estático.** Angular compilado + un rewrite a `index.html` + un archivo wasm. Eso corre igual de bien en Hostinger; no hay ningún servidor que ejecutar.
2. **Vercel Hobby no es para uso comercial.** Según las guías de precios consultadas, el plan gratuito está limitado a uso personal no comercial; un sitio de empresa con formulario de leads requiere Pro (USD 20 por usuario por mes). Pagar eso solo por servir archivos estáticos no se justifica. Verificar siempre en `vercel.com/pricing`, que es la fuente oficial.
3. **Hay cosas colgadas del mismo hosting.** El `.htaccess` enruta `hyder.com.ar` a `/HyderLipy/` y varios subdominios de clientes viven en la misma cuenta. Esa regla es de Apache y **no existe** en Vercel; migrar implica rehacer ese ruteo y mover cada subdominio.
4. **El riesgo no compensa el beneficio.** Lo que Vercel aporta (previews por rama, SSR, funciones) no es lo que hoy limita las ventas del sitio.

## Qué sí conviene hacer

| Acción | Beneficio | Costo | Esfuerzo |
|---|---|---|---|
| Cloudflare gratis delante de Hostinger | CDN global, Brotli/HTTP3, caché del wasm de 13 MB, protección DDoS/bots, reglas de redirección, analítica sin cookies | USD 0 | Bajo (cambiar nameservers y copiar registros DNS, incluidos los MX del correo) |
| `public/htaccess` actualizado (ya hecho) | MIME `application/wasm`, caché inmutable para archivos con hash, `Permissions-Policy` de cámara | USD 0 | Hecho |
| Alojar el modelo `face_landmarker.task` en el propio dominio | La demo no depende de Google; “nada sale de tu equipo” queda literal | USD 0 | Bajo (4 MB en `public/mediapipe/`) |
| Prerender del home con `@angular/ssr` en build | Texto indexable sin ejecutar JS | USD 0 | Medio |

> Antes de cambiar nameservers, **exportar los registros DNS actuales** (sobre todo MX, SPF, DKIM) para no cortar el correo del dominio.

## Cuándo sí valdría migrar

- Querés **previews por rama/PR** con URL propia para mostrar versiones a clientes.
- Querés **SSR real** o funciones serverless propias (por ejemplo, recibir el formulario sin Web3Forms y enviarlo a n8n).
- El sitio empieza a **recibir tráfico** que Hostinger no soporta.

En ese caso, comparar **Cloudflare Pages** (plan gratuito con límites de builds, sin restricción de tráfico estático según su documentación) contra **Vercel Pro**. Cloudflare Pages requiere confirmar en sus términos que el uso comercial está permitido en el plan gratuito; la búsqueda realizada no lo confirmó de forma explícita.

## Qué quedó listo por si se migra

- `vercel.json` en la raíz (salida `dist/browser`, rewrite SPA, MIME y caché de wasm, cabeceras). Es inerte mientras no se use Vercel.
- Notas sobre CSP: la demo necesita `worker-src blob:`, `wasm-unsafe-eval` y acceso a `storage.googleapis.com` mientras el modelo no esté alojado en el propio dominio.

## Fuentes consultadas

- [Vercel Pricing in 2026](https://modelence.com/compare/vercel-pricing)
- [is vercel free](https://zplatform.ai/guides/is-vercel-free/)
- [Cloudflare Pages · Limits](https://developers.cloudflare.com/pages/platform/limits)
