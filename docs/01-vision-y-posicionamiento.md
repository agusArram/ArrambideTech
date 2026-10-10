# 01 · Visión y posicionamiento

## Problema del sitio actual

- Es una landing de servicios correcta pero intercambiable: cualquier agencia podría firmar el mismo manifiesto (“aniquilar ineficiencias operativas”).
- Afirma capacidades sin probarlas (“Sensores faciales tope de gama”, “Control absoluto”) y no muestra ninguna de las piezas más sólidas del trabajo real.
- Está pensada para pymes y comercios (SortProject, páginas web). El objetivo nuevo es otro: **compradores con presupuesto** que quieren un producto de excelencia, no la opción barata.

## Audiencia objetivo

| Perfil | Qué necesita ver | Qué lo frena |
|---|---|---|
| CEO / director de operaciones de empresa mediana-grande | Que el sistema es serio, seguro y ya funciona en producción | Miedo a proveedores pequeños, a la seguridad y a quedar atado a un “pibe” |
| Gerente de seguridad / facilities (accesos) | Reconocimiento facial real, integrado con hardware de marca, auditable | Falsos positivos, privacidad, hardware propietario |
| Dueño de negocio de servicios con cobros recurrentes | Pagos integrados sin comisión extra y sin fraude del lado cliente | Pérdida de plata, conciliación manual |
| Áreas de RRHH / administración | IA que responde sin inventar y deja auditoría | Alucinaciones, filtrado de datos sensibles |

## Promesa

> **Sistemas que reconocen a las personas, cobran solos y deciden con IA — diseñados para no fallar.**

Tagline corto: **Reconoce. Cobra. Decide.**

## Pilares (los tres que más cierran ventas, según Agustín)

1. **Reconoce** — reconocimiento facial integrado a hardware real (Hikvision) con cifrado y auditoría.
2. **Cobra** — pagos integrados (Mercado Pago) donde el monto nunca depende del cliente, multi-tenant, sin comisión por transacción.
3. **Decide** — automatización y agentes de IA (n8n + LLM) con control de acceso y trazabilidad.

Los tres comparten una idea de producto: **el sistema no es una pantalla, es infraestructura operativa**. Eso es lo que diferencia de “hago páginas web”.

## Tono

- Sobrio, técnico, seguro. Frases cortas. Cero jerga de marketing (“sinergia”, “disruptivo”).
- Pruebas antes que adjetivos: cada afirmación va acompañada de un dato o un mecanismo (“el monto lo resuelve el servidor”, no “pagos seguros”).
- Voz: tercera persona/plural profesional en el sitio (“Diseñamos…”), con Agustín como fundador visible al cierre.
- Español neutro-rioplatense mínimo; sin voseo en copy corporativo hacia directivos.

## Qué NO es el sitio

- No es un catálogo de servicios de pymes (eso queda en `/servicios` y `/soluciones`, a revisar en la siguiente fase).
- No muestra precios.
- No promete lo que no esté en producción.

## Criterios de éxito

1. Un directivo entiende en 10 segundos **qué hace** Arrambide Tech y que “ya funciona”.
2. A los 60 segundos probó algo real (la demo) y vio cómo se protege la información.
3. El camino a “Agendar una conversación” está presente en el hero, tras la demo y al final.
4. Rendimiento: LCP < 2,5 s en desktop; la escena 3D degrada con gracia en móvil y con `prefers-reduced-motion`.
