# 03 · Dirección creativa

## Concepto: “Una sola materia que se transforma”

Un único objeto 3D —una nube de ~9.000 partículas— es el protagonista de todo el recorrido. Cambia de forma según el pilar que se explica:

| Escena | Forma | Mensaje | Metáfora |
|---|---|---|---|
| 0 · Hero | **El logo de Arrambide Tech hecho de puntos** (muestreado del archivo real del logo), con dos órbitas inclinadas, satélites y polvo | *Reconoce. Cobra. Decide.* | La marca como sistema |
| 1 · Reconoce | **Terminal de acceso facial** (tablet de pared con módulo de cámara, pantalla en líneas de barrido, visor con esquinas y halos de detección) | Acceso facial real, cifrado, auditable | El punto de entrada |
| 2 · Cobra | **Tarjeta** con chip y numeración | El monto lo decide el servidor | El dinero |
| 3 · Decide | **Red de 22 nodos** con hub central y vínculos entre vecinos | IA que consulta, no inventa | El cerebro operativo |

La transformación no es un corte: las partículas viajan de una forma a otra (morph en shader), como si el sistema “pensara” de un pilar al siguiente. Ese mismo concepto se repite en el producto real: un dato entra por un lado, cambia de forma y sale como decisión.

> Decisiones de versión 2: se descartó la cabeza humana procedural (“parecía un huevo”). El terminal pasó a ser el segundo paso, no el intro, para no repetir la misma figura al bajar. El intro es la marca. El grafo se mantiene y se amplió a 22 nodos.

## Por qué partículas

- Es la forma visual de “datos”: ni ilustración ni maqueta de producto.
- Es liviana: un solo draw call con shader propio. Se ve cara sin ser pesada.
- Permite morph continuo entre formas arbitrarias sin assets 3D ni licencias.
- Reduce riesgo: no usa la cara de ninguna persona real.

## Interacción

- **Arrastrar** (mouse o dedo) sobre la escena gira el objeto; tiene inercia y vuelve solo a su posición tras ~3,5 s sin tocar.
- **Gesto horizontal del trackpad** (dos dedos hacia los costados) gira; el gesto vertical sigue siendo scroll normal y no se intercepta. Solo se captura cuando el movimiento es claramente horizontal, lo que además evita el “atrás” del navegador sobre la escena.
- En móvil, `touch-action: pan-y` deja el scroll vertical al navegador y el horizontal a la escena.
- **Tocar o hacer click** sobre los puntos “rompe” esa zona: los puntos se separan con suavidad, se mantienen abiertos ~0,6 s y vuelven solos hasta completar ~1,5 s. Son **acumulables hasta 3** a la vez; la cuarta reemplaza a la más antigua. Se resuelve en el vertex shader (`uniform vec3 uB[3]`), sin geometría adicional. Se desactiva con `prefers-reduced-motion`.
- **Campo del puntero (solo escritorio):** al mover el mouse, los puntos cercanos se apartan y brillan levemente; se apaga solo al dejar de moverlo.
- Aviso “Arrastrá para girar · tocá los puntos” que desaparece tras la primera interacción.

## Intro y respuesta al toque (v7)

Feedback sobre la v6: la animación nueva no gustó y era lenta. Cambios:

1. **Aparición rápida:** los puntos llegan al logo en **1,3 s** (antes 2,8 s). Se quitó la precesión de las órbitas y el pulso diagonal: el logo queda como en la v5, denso y brillante.
2. **Micro-explosión puntual:** radio chico (~13 % del alto), rompe solo la zona tocada y distorsiona levemente alrededor; dura ~1,5 s y se acumula hasta 3.
3. **Campo del mouse (escritorio):** los puntos cercanos al cursor se apartan con una distorsión aleatoria (empuje radial + torsión + ruido por punto), más amplio que en la v6.
4. **Hero:** se restituyó la frase completa: “Sistemas que le ahorran tiempo a tu empresa: controlan quién entra, cobran solos y responden con inteligencia artificial.”

## Casos desde el dolor del cliente (v7)

La sección “Tres sistemas, tres entornos reales” se reemplazó por **“¿Qué te está costando tiempo hoy?”**: cuatro frases en primera persona (“No sé quién entra ni si debía entrar”, “Pierdo horas cobrando y conciliando pagos”, “Mi equipo busca datos en planillas todo el día”, “Tengo sistemas que no se hablan entre sí”). Al elegir una (hover, foco o toque) aparece dónde ya se resolvió, con una cifra grande y el enlace al caso. Parte del problema del visitante, no del catálogo del proveedor.

## Resultados (v7)

Cuatro cifras grandes con un título y una línea cada una. Sin bloques “antes/ahora”.

## Lenguaje (v5)

Regla: el sitio habla con quien **decide y paga**, no con quien programa.

1. Se vende **tiempo ahorrado, errores evitados y control**, no tecnología.
2. Sin siglas ni nombres de librerías en el primer nivel (nada de ISAPI, AES-256-GCM, PKCE, Edge Functions, tokens, polling).
3. Lo técnico existe, pero **plegado y rotulado “Para tu equipo técnico”**, por si lo lee el responsable de sistemas del cliente.
4. Las cifras se explican con su consecuencia (“350 movimientos recuperados tras dos semanas sin conexión”) y no como dato suelto.
5. Cada caso sigue la secuencia: *el problema → qué hicimos → qué cambió*.

## Densidad de información (v3)

Feedback: “demasiado texto, muchísima data de golpe”. Regla desde esta versión:

1. **Primer nivel (siempre visible):** un título, una frase, una cifra. Nada más en cada paso del scroll.
2. **Segundo nivel (a pedido):** el detalle técnico y el problema resuelto viven detrás de un control explícito (“Ver cómo está resuelto”, “Ver detalle técnico”, “Ver las 7 versiones”, “Cómo está resuelto +”).
3. **Cada caso muestra 3 puntos** de solución y pliega el resto.
4. El grafo del paso “Decide” usa 17 nodos con 2 vecinos cada uno: con más nodos dejaba de leerse como grafo.

## Resultados como historias (v4)

La sección *Resultados* dejó de ser un tablero de cifras sueltas (10 releases, AES-256-GCM, tokens: poco legibles para un directivo) y pasó a **cuatro problemas reales** con la forma *Antes → Ahora → cifra*, en lenguaje de negocio. El detalle técnico y la línea de releases completa quedan en la página de Casos.

## Aparición

Todo bloque relevante entra con `appReveal`: opacidad + desplazamiento de 26 px con curva `cubic-bezier(.16,1,.3,1)` (entrada rápida, asentamiento largo), escalonada de 80–120 ms. Se desactiva con `prefers-reduced-motion`. El scroll de la story usa *smootherstep* e inercia (`1 − e^(−5,5·dt)`).

## Lenguaje visual

**Atmósfera:** negro profundo, casi sin gradientes. Mucho aire. Tipografía grande y callada.

| Token | Valor | Uso |
|---|---|---|
| `--im-bg` | `#050506` | Fondo |
| `--im-fg` | `#f4f4f2` | Texto principal (blanco cálido) |
| `--im-muted` | `#8b8b94` | Texto secundario |
| `--im-line` | `rgba(255,255,255,.08)` | Hairlines |
| `--im-accent` | `#6ee7b7` | Único color de marca (continuidad con el sitio actual), solo para estados y datos |
| `--im-warn` | `#fbbf24` | Override manual |
| `--im-danger` | `#f87171` | Acceso denegado |

**Tipografía:** Inter Variable (ya autoalojada). Display 600, tracking −0,04 em, línea 0,95. Etiquetas en versalitas con tracking +0,14 em. Datos y logs en monoespaciada del sistema.

**Reglas:**
1. Un solo acento. El color significa estado, no decoración.
2. Cero cajas con sombra y borde grueso: hairlines y espacio.
3. Una idea por pantalla. Máximo 3 bullets, cada uno con un mecanismo concreto.
4. Los números grandes siempre con su contexto (“26.500 → 560 registros”).

## Movimiento

- **Escena 3D:** rotación lenta (±0,5 rad) + paralaje leve con el mouse. El barrido de escaneo es lento (≈ 6 s) para no distraer.
- **Cambio de pilar:** morph de 1,8 s con `power3.inOut`; el texto cruza con fundido y desplazamiento de 12 px.
- **Scroll (v2, continuo):** la sección es *sticky* de 560 vh. El progreso real del scroll se suaviza con inercia independiente del framerate (`1 − e^(−7·dt)`) y ese único valor maneja a la vez el morph de la escena, el giro y el fundido/desplazamiento de cada panel. Hay ventanas de transición entre paneles; el último panel permanece hasta el final. Riel lateral con progreso y navegación a cada paso. No se bloquea el scroll nativo.
- **Demo:** malla facial en tiempo real, esquinas de encuadre tipo visor, línea de pipeline que se enciende por etapas.
- **Accesibilidad de movimiento:** con `prefers-reduced-motion` la escena se dibuja estática y los cambios son instantáneos.

## Estructura de la home

1. **Header** (transparente, se opaca al scroll).
2. **Story** (sticky, 4 pantallas): Hero → Reconoce → Cobra → Decide.
3. **Demo en vivo**: “Probalo ahora. Es tu cámara, es tu navegador.” (ver [05](05-demo-en-vivo.md)).
4. **Pruebas**: cifras duras y línea de releases reales.
5. **Ecosistema**: lista sobria de productos en operación.
6. **Contacto**: “Hablemos de lo que hoy no podés automatizar.”
7. **Footer**.

## Copy base (borrador)

**Hero**
> Reconoce. Cobra. Decide.
> Ingeniería de sistemas que ya operan: reconocimiento facial integrado a hardware real, pagos que nadie puede alterar e IA que consulta sin inventar.

**CTA principal:** “Ver demostración en vivo” · **Secundario:** “Agendar una conversación”.

**Cierre**
> Si el proceso es crítico, no lo resuelve una plantilla.

## Qué se descarta a propósito

- Fondos con “matrix”, neón saturado, glitch, cursores personalizados.
- Mockups genéricos de dashboards inventados.
- Lottie/animaciones decorativas sin significado.
- Testimonios inventados. Si no hay uno real y autorizado, no hay testimonio.

## Referencias de nivel (no de estilo a copiar)

Linear, Stripe, Vercel (rigor y contención), Apple (ritmo y escala tipográfica), Active Theory / Resn (calidad de 3D en web).
