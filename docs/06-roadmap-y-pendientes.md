# 06 · Roadmap y pendientes

## Fases

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Análisis de Notion + repos, documentación | ✅ |
| 1 | Prototipo: story 3D (rostro → tarjeta → red), demo facial, pruebas, nuevo home | ✅ en esta rama |
| 2 | Pulido: copy final, métricas confirmadas, capturas reales (anonimizadas), tipografía y ritmo | ⏳ |
| 3 | Páginas hijas: `/reconocimiento-facial`, `/pagos`, `/automatizacion-ia` (casos de uso, arquitectura, FAQ de seguridad) | ⏳ |
| 4 | SEO + prerender + analítica + versión EN | ⏳ |
| 5 | Despliegue (preview → producción) | ⏳ |

## Decisiones ya tomadas (v2)

- **Nombrar todo** (clientes e instituciones) y filtrar después: los puntos dudosos están marcados con `TODO(Agustín)` en `src/app/pages/soluciones/soluciones-page.html`.
- **El bot SAP está en producción** en la Secretaría de Salud de la Municipalidad de Pilar. Se publica eso; las valoraciones de la dirección del Hospital Central y del intendente quedan como TODO.
- **Mercado Pago:** webhook procesado en Edge Functions de Supabase, nada en el front.
- **Hero:** logo de la marca hecho de puntos + órbitas (la cabeza y luego el terminal como intro se descartaron). El terminal es el paso “Reconoce”.
- **Interacción:** arrastre y gesto horizontal del trackpad rotan la escena.
- **Instituciones:** se puede mencionar a Marinas del Paraná Guazú y a la Municipalidad de Pilar; **nunca nombres de personas**.
- **Producción:** microservicios y bot confirmados en producción.
- **Scroll:** continuo con inercia.
- **Sitio solo oscuro**, páginas y componentes rehechos.

## Lo que necesito de Agustín

### Pendiente de autorización
- [ ] Mencionar las valoraciones de la dirección del Hospital Central y del intendente (hoy **no** se muestran y quedan como `TODO(Agustín)`). Si se autorizan, se publican sin nombres propios.

### Material (para la próxima ronda)
- [ ] 3–4 capturas de pantalla de BiometriaAcceso: Monitor en vivo, CRM Analytics, Usuarios/Unidades. Con datos ficticios o difuminados.
- [ ] Foto del terminal Hikvision instalado, sin personas ni matrículas.
- [ ] Una foto tuya (formato vertical u horizontal, buena luz) y 3 líneas de bio.
- [ ] Logos o autorización de uso de marca de los clientes que se quieran mostrar.
- [ ] Cifras de escala que quieras publicar: cantidad de terminales, personas habilitadas, accesos por mes, reservas o transacciones procesadas, consultas del bot por mes.
- [ ] Un testimonio textual autorizado (sin nombre propio si hace falta), de cualquier cliente.
- [ ] ¿Idioma EN además de ES?

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El modelo de MediaPipe se carga de CDN externo | Dependencia de terceros en la demo | Alojarlo en `public/mediapipe/` antes de producción (4 MB) |
| Peso del wasm (13 MB) en el hosting | Tiempo de primera demo en 3G | Solo se descarga al pulsar; mostrar progreso; opción de omitir la demo |
| Claims que no se puedan sostener (HMAC webhook, producción del bot) | Pérdida de credibilidad con directivos | Tabla de estados (🟢/🟡) en 02; copy solo con lo verificado |
| Datos personales en capturas (salud, RRHH, clientes) | Legal / reputacional | Solo datos de ejemplo; revisión manual antes de publicar |
| Tema claro del header sobre secciones oscuras | Inconsistencia visual | Fase 2: forzar tema oscuro en la home o ajustar header |
| Mobile: GPU baja | Frames bajos | Menos partículas, `prefers-reduced-motion`, fallback estático |
| Hardware Hikvision en el copy | Marca registrada | Mencionar como “terminales Hikvision” de forma descriptiva, sin logos |

## Ideas para después (sin prioridad)

1. **Calculadora de ahorro** para el pilar Decide (horas/mes × costo).
2. **Línea de tiempo v1 → v10.1** del biométrico, con las decisiones de diseño (rollback, delta, user-centric).
3. **Mapa de ecosistema** interactivo (nodos = productos, núcleo = Supabase).
4. **Modo “sala de reuniones”**: la demo conectada a un terminal real en la mesa.
5. **Caso de estudio PDF** de una página por pilar para enviar a directivos.
6. Integrar un **widget WhatsApp** con agente n8n propio (dogfooding: el sitio usa lo que vende).

## Cómo revisar esta rama

```bash
git checkout rediseno-3d
npm install
npm start
```
Abrir `http://localhost:4200`, probar: scroll por los cuatro pasos, demo con cámara (permitir permiso), responsive y `prefers-reduced-motion` (DevTools → Rendering).

## Estado de verificación del prototipo

| Qué | Cómo se verificó | Resultado |
|---|---|---|
| Compila (dev y producción) | `ng build` | ✅ Bundle inicial 423 kB (≈109 kB transferidos); `three` (155 kB gz), MediaPipe (39 kB gz) y la escena en chunks diferidos |
| Escena 3D: hero, 3 morphs, layout desktop y portrait | Navegador integrado, capturas | ✅ |
| Carga de wasm + modelo FaceLandmarker | Script en página con canvas sintético | ✅ (0,7 s en CPU, 0 rostros en canvas vacío, 2.556 conexiones de malla) |
| Manejo de permiso de cámara denegado | Click en “Iniciar demostración” con cámara bloqueada | ✅ mensaje claro, sin errores |
| **Captura real con cámara, firma y cifrado** | **No verificado**: el panel de navegador bloquea la cámara | ⚠️ Probar en Chrome/Safari reales |
| Móvil real (iOS/Android), rendimiento en GPU baja | No verificado | ⚠️ Probar |
| Scroll continuo: opacidades de panel y progreso en 8 puntos del recorrido | Script en página | ✅ |
| Demo con cámara simulada (stream de canvas): import dinámico, carga de modelo, detección | Script en página | ✅ llega a “No detecto un rostro” con un canvas sin cara |
| Páginas `/soluciones`, `/servicios`, `/contacto` | Navegador integrado | ✅ renderizan; sin errores de consola |
| Envío real del formulario (Web3Forms) | No ejecutado, para no generar un lead falso | ⚠️ Probar |
