# Arrambide Tech — Rediseño inmersivo (rama `rediseno-3d`)

Documentación de la reconstrucción de arrambidetech.com. Objetivo: pasar de una landing de servicios a **una pieza que venda ingeniería de alto nivel a directivos y compradores con presupuesto**.

> Estado: prototipo funcional en la rama `rediseno-3d`. `main`/`Dev` (producción) no se tocan hasta aprobar.

## Índice

| # | Documento | Qué responde |
|---|---|---|
| 01 | [Visión y posicionamiento](01-vision-y-posicionamiento.md) | A quién le vendemos, qué promesa, qué tono |
| 02 | [Capacidades y pruebas](02-capacidades-y-pruebas.md) | Qué hay realmente construido, con datos verificables y su fuente |
| 03 | [Dirección creativa](03-direccion-creativa.md) | Concepto, escenas, lenguaje visual, movimiento |
| 04 | [Arquitectura técnica](04-arquitectura-tecnica.md) | Stack, estructura de código, rendimiento, privacidad, accesibilidad |
| 05 | [Demo en vivo](05-demo-en-vivo.md) | Cómo funciona la demo de reconocimiento facial y qué es real vs. simulado |
| 06 | [Roadmap y pendientes](06-roadmap-y-pendientes.md) | Qué falta, qué necesito de Agustín, riesgos y decisiones abiertas |
| 07 | [Fuentes](07-fuentes.md) | Enlaces a Notion y repos de donde sale cada afirmación |
| 08 | [Migración a Vercel](08-migracion-vercel.md) | Qué cambia al pasar de Hostinger a Vercel y qué se puede explotar |

## Resumen en 30 segundos

- **Idea central:** *Reconocé. Decidí. Cobrá.* — tres verbos = los tres pilares que más han vendido: reconocimiento facial, pagos integrados y automatización con IA (n8n).
- **Forma:** una sola escena 3D (nube de partículas) que **se transforma** de terminal de acceso facial → red de decisión → tarjeta de pago, con scroll continuo, seguida de una **demo real** de reconocimiento facial con la cámara del visitante (todo local). Casos, capacidades y contacto fueron rehechos con el mismo sistema visual.
- **Principio rector:** cada afirmación del sitio tiene respaldo en algo construido y documentado (ver 02). Nada de métricas inventadas.
- **Cómo correrlo:** `npm install && npm start` en la rama `rediseno-3d`.

## Reglas de este proyecto

1. No se muestran datos reales de personas (salud, RRHH, clientes finales). Todo dato mostrado es de ejemplo y está rotulado como tal.
2. Por instrucción de Agustín se **nombra todo** (clientes e instituciones) y después se retira lo que no se pueda publicar. Las valoraciones de terceros (jefa del Hospital Central, intendente) **no** se muestran hasta tener autorización.
3. La demo facial **no envía ni guarda** imagen alguna. Es verificable inspeccionando la red del navegador.
4. Lo que no esté en producción se rotula (“en validación”, “MVP”), no se vende como terminado.
5. Todo lo que menciona a un cliente o institución está marcado con `TODO(Agustín)` en el código hasta confirmar qué se puede publicar.
