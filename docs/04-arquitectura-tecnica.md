# 04 · Arquitectura técnica

## Stack

| Capa | Tecnología | Nota |
|---|---|---|
| Framework | Angular 20 (standalone, signals, OnPush) | Ya en uso en el sitio |
| 3D | `three` (r186) | Importado con `import()` dinámico: no entra en el bundle inicial |
| Animación | Tween propio dentro de la escena (easing cúbico) + CSS | Sin librería de animación: menos peso y menos superficie de falla |
| Visión por computadora | `@mediapipe/tasks-vision` (FaceLandmarker) | Solo se carga al pulsar “Iniciar demostración” |
| Cifrado en demo | Web Crypto API (AES-256-GCM, SHA-256) | Nativo del navegador, sin dependencias |
| Hosting | Hostinger (estático) | Sin servidor propio: la demo no necesita backend |

## Estructura

```
src/app/
├── immersive/                 # Lógica 3D sin Angular
│   ├── shapes.ts              # Generadores de puntos: marca (logo muestreado), terminal, tarjeta, red
│   └── morph-scene.ts         # Escena Three.js + shader de morph/escaneo
├── components/
│   ├── header/ footer/        # Rehechos (solo oscuro, sin selector de tema)
│   ├── contact-form/          # Mismo envío (Web3Forms), UI nueva
│   ├── story/                 # Hero + 3 pilares, escena sticky con scroll continuo
│   ├── face-demo/             # Demo de reconocimiento facial en vivo
│   └── proof/                 # Cifras y línea de releases
└── pages/
    ├── home/              # Story + demo + pruebas + casos + contacto
    ├── soluciones/            # Casos en producción (ruta histórica /soluciones)
    ├── servicios/             # Capacidades, método y principios
    └── contacto/              # Formulario + FAQ
```

## Decisiones clave

### 1. Un solo draw call
`THREE.Points` con `ShaderMaterial`. Cuatro posiciones objetivo por vértice (`position`, `positionB/C/D`) y un uniform `uMorph ∈ [0,3]`. La interpolación ocurre en GPU. El barrido de escaneo es un uniform más.

### 2. Carga diferida
- `three` y la escena se importan dentro de `ngAfterViewInit`, solo en navegador.
- MediaPipe se importa al iniciar la demo.
- El *wasm* (13 MB) se sirve desde `/mediapipe/` y se copia en build desde `node_modules` (ver `angular.json`); no se commitea. **No lo descarga nadie que no pulse el botón.**
- El modelo `face_landmarker.task` (~4 MB) se descarga desde el CDN oficial de Google al iniciar. Alternativa para producción: alojarlo en `public/mediapipe/` (ver [06](06-roadmap-y-pendientes.md)).

### 3. Degradación
| Condición | Comportamiento |
|---|---|
| `prefers-reduced-motion` | Una sola imagen estática, sin bucle |
| Pantalla < 768 px o pocos núcleos | 4.500 partículas, sin paralaje |
| Sin WebGL | La sección muestra solo texto (la story sigue legible) |
| Pestaña oculta / fuera de pantalla | Se pausa el bucle de render (`IntersectionObserver` + `visibilitychange`) |
| Sin cámara / permiso denegado | Mensaje claro y la demo explica lo que haría |

### 3b. Calidad adaptativa (v10)

La escena mide el tiempo de cada cuadro (promedio móvil, ignorando los primeros 30 cuadros por la compilación de shaders):

| Nivel | Condición | Acción |
|---|---|---|
| 0 | Equipo que sostiene ≥ ~40 fps | Resolución nativa (hasta DPR 2) y 100 % de los puntos |
| 1 | Promedio > 26 ms durante 60 cuadros | DPR 1 y 70 % de los puntos (`setDrawRange`) |
| 2 | Sigue > 30 ms | 45 % de los puntos |

No reconstruye geometría ni recarga nada, y respeta el cambio de tamaño de ventana. Además: pausa fuera de pantalla y con la pestaña oculta, 4.500 puntos en móvil o equipos de ≤ 4 núcleos, y modo estático con `prefers-reduced-motion`.

### 4. Rendimiento
- `devicePixelRatio` limitado a 2.
- Sin post-procesado, sin sombras, sin texturas.
- Un buffer de ~9.000 × 3 flotantes × 3 formas ≈ 324 KB.
- El bucle de MediaPipe corre fuera de `NgZone` para no disparar detección de cambios por frame.

### 5. Privacidad (clave para el pitch)
- El video **no sale del navegador**. No hay `fetch`/`WebSocket`/`sendBeacon` con imágenes ni landmarks.
- La instantánea se cifra con AES-256-GCM usando una clave **no exportable** generada en el momento; se descarta tras mostrar el resultado.
- Se pide permiso de cámara solo al hacer click, con texto explícito antes.
- Los tracks de la cámara se detienen al salir o al pulsar “Detener”.

### 6. Accesibilidad
- Todo el contenido narrativo está en HTML real, no dentro del canvas.
- El canvas es `aria-hidden`; los textos de la story se leen en orden aunque la escena no cargue.
- Contraste AA+ sobre fondo oscuro. Foco visible. Botones con `aria-label`.
- Navegación por teclado completa en la demo.

### 7. SEO
- El contenido textual (hero, pilares, cifras) está en el DOM inicial (CSR). Para mejorar indexación se podría **prerenderizar** con `@angular/ssr` (hoy el sitio es CSR puro).
- JSON-LD existente en `index.html` se mantiene; falta actualizar descripciones a los tres pilares.

## Compatibilidad

- Navegadores objetivo: Chrome/Edge/Safari/Firefox actuales (WebGL2 + WASM SIMD).
- `getUserMedia` requiere HTTPS (o `localhost`). En producción ya es HTTPS.

## Comandos

```bash
git checkout rediseno-3d
npm install
npm start          # http://localhost:4200
npm run build      # producción
```

## Qué cambió respecto a producción

- Se rehicieron header, footer, formulario y las cuatro páginas. Se mantuvieron las URLs (`/servicios`, `/soluciones`, `/contacto`) para no perder SEO.
- Se eliminaron componentes huérfanos (`hero`, `solutions`, `benefits`, `features`, `pricing`, `modal`); siguen en el historial de git.
- Sistema visual global con prefijo `im-` en `src/styles.css`. El sitio queda **solo oscuro**; se retiró el selector de tema.
- `public/htaccess`: MIME `application/wasm`, cache inmutable para assets con hash y `Permissions-Policy` de cámara.
- `vercel.json`: listo para la migración (ver [08](08-migracion-vercel.md)).
- Rama `main`/`Dev` y el despliegue actual: sin tocar.

## Nota de desarrollo

Si la demo falla en local con *“Failed to fetch dynamically imported module … vite/deps/@mediapipe_tasks-vision.js”*, es la caché de dependencias del servidor de desarrollo desactualizada tras reiniciarlo: recargar la página con Cmd+Shift+R (o reiniciar `npm start`). No ocurre en producción, donde el módulo va en un *chunk* con hash.
