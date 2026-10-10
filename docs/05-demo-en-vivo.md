# 05 · Demo en vivo de reconocimiento facial

Objetivo: que quien visita **pruebe** el pilar “Reconoce” en 30 segundos, sin instalar nada, y entienda cómo se protege la información.

## Qué es real y qué es simulado

| Etapa de la demo | ¿Es real? | Qué ocurre |
|---|---|---|
| Captura de cámara | ✅ Real | `getUserMedia`, en tu navegador |
| Detección + malla facial | ✅ Real | MediaPipe FaceLandmarker (478 puntos) corriendo local en WASM |
| Calidad del encuadre | ✅ Real | Tamaño y centrado del rostro, estabilidad en ~1 s |
| Firma geométrica | ✅ Real (conceptual) | SHA-256 de distancias normalizadas entre puntos clave. **No es un template biométrico de producción** |
| Cifrado de la imagen | ✅ Real | Recorte 640×640 → JPEG → **AES-256-GCM** con clave no exportable y IV aleatorio de 96 bits; se muestran tamaño, IV y primeros bytes del texto cifrado |
| Descarte de la clave | ✅ Real | La referencia a la clave se elimina al terminar |
| Decisión de acceso | 🟡 Simulada | El visitante elige un perfil de ejemplo; el estado replica los del monitor real: `granted`, `denied_debt`, `manual_override` |
| Terminal Hikvision / Supabase | ❌ No hay | No se conecta a ningún hardware ni servidor. Se explica en pantalla |

> En producción: la imagen la valida el terminal Hikvision por ISAPI; el cifrado y la bóveda corren en Java; la deuda se calcula en el servidor. La demo reproduce la **forma** del flujo con piezas reales del navegador.

## Flujo de usuario

1. **Estado inicial.** Texto: “Se procesa en tu navegador. No se envía ni se guarda nada.” Botón **Iniciar demostración**.
2. **Cargando.** Pide permiso de cámara, descarga el modelo (barra de progreso textual).
3. **Escaneo.** Se dibuja la malla sobre el video (espejado). Esquinas de visor. Pipeline lateral con 5 etapas:
   1. Captura
   2. Detección (478 puntos)
   3. Firma geométrica (`a3f9…`)
   4. Cifrado AES-256-GCM (tamaño, IV, bytes)
   5. Decisión
4. **Decisión.** Tres perfiles de ejemplo (“Propietario al día”, “Cuenta con deuda”, “Personal en horario”). Se muestra el resultado, la latencia **medida** del pipeline y una línea de log como en el monitor real.
5. **Cierre.** “Detener cámara” y CTA “Hablemos de llevar esto a tu operación”.

## Estados de error contemplados

- Permiso denegado / sin cámara.
- Navegador sin WebGL/WASM.
- Fallo de descarga del modelo (reintento manual).
- Más de un rostro: se usa el más prominente (parámetro `numFaces: 1`).
- Poca luz o rostro parcial: el indicador de calidad no avanza y se da la indicación.

## Datos y privacidad

- Ningún frame, landmark ni hash se transmite. Verificable en la pestaña *Red* de DevTools: las únicas peticiones son el modelo (Google CDN) y el wasm (propio).
- Lo que sale de esta demo **no** es un dato biométrico utilizable: la firma muestra solo 12 caracteres de un hash y se descarta.
- No se usan cookies ni analíticas dentro de la demo.

## Variantes futuras

- **Modo “presentación a cliente”**: la misma demo conectada a un terminal real (WebSocket local) solo en reuniones.
- **Detección de vivacidad** (parpadeo / giro) para mostrar anti-spoofing.
- **Panel “Monitor en vivo”** animado con eventos de ejemplo debajo de la demo.
