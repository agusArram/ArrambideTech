# 02 · Capacidades y pruebas

Inventario de lo realmente construido, extraído del Notion de Arrambide Tech y de los repos. Cada afirmación del sitio sale de acá. Las URLs de origen están en [07-fuentes](07-fuentes.md).

Leyenda de estado: 🟢 en producción · 🟡 MVP / validado, no confirmado en producción · 🔴 deprecado / no usar como prueba.

---

## Pilar 1 — RECONOCE (acceso biométrico) 🟢

**Producto:** BiometriaAcceso (aplicación de escritorio, repo privado `agusArram/BiometriaAcceso`).
**Stack:** Java 21 + JavaFX 21, Supabase (PostgreSQL + Storage) vía REST, `java.net.http` nativo.
**Hardware:** Hikvision DS-K1T673DWX (terminal facial), integración vía **ISAPI** con **Digest Auth**.

### Hechos verificables

| Hecho | Detalle | Origen |
|---|---|---|
| Integración con hardware real | Motor Digest Auth genérico + gestión de usuarios (`UserInfo`) y rostros (`FDLib`) del terminal. Enrolamiento real en Fase 9 | Notion · Fase 9 |
| Bóveda biométrica cifrada | La misma imagen JPEG aceptada por el sensor se cifra con **AES-256-GCM** y se sube a un bucket privado de Supabase Storage (v10.0, 2026-05-25) | Notion · Fase 9 / Walkthrough v10.0 |
| Rollback atómico | Si el sensor rechaza la foto, esa imagen **nunca** llega al bucket. Si falla el cloud *después* del hardware: consistencia eventual, el acceso sigue funcionando | Notion · Fase 9 |
| Sincronización delta inteligente | Verifica por ISAPI quién ya está registrado y omite duplicados: evita fatiga de memoria flash y de red. Toggle “Full Sync” para hardware virgen | Notion · Fase 9 (v10) |
| Arquitectura *user-centric* | Solo **personas** viven en el sensor (límite de 10.000 en flash); entidades lógicas (embarcaciones/unidades) no se envían. La deuda se calcula en RAM | Notion · Fase 9 (v10.1) |
| Multi-empresa en un sensor | Dos empresas comparten sensor y oficina; el ID del sensor referencia al `user_id` de Supabase y se resuelve a unidades vía `user_units` | Notion · Acceso biométrico |
| Horarios/planes por categoría | Sincroniza `planTemplateNo` (plantilla horaria ISAPI) según la categoría de la unidad, incluso al editar categorías en lote | Notion · Fase 9 (Fix v1–v3) |
| Foto de webcam sin distorsión | Center-crop a 640×640 para cumplir el ratio que el sensor acepta (v10.1) | Notion · Fase 9 |
| Monitor en vivo | Tabla de eventos con estados `granted`, `denied_debt`, `manual_override`; accesos permitidos y denegados en tiempo real | Notion · Acceso biométrico; Release v1.9.8 |
| Línea de releases | **10 releases en la rama 1.9** (v1.9.0 → v1.9.9, 12 de julio a fines de septiembre de 2026) con notas completas, ver tabla siguiente | GitHub Releases |
| Importación de saldos | Pasó de subir **26.500** registros a **560** (carga directa “al grano”) | GitHub Release v1.9.9 |
| Paquete de instalación | `BiometriaAcceso.zip`, 127 MB | GitHub Release v1.9.9 |

### Línea de releases 1.9.x (notas completas aportadas por Agustín)

| Release | Fecha | Qué resolvió |
|---|---|---|
| v1.9.0 | 12 jul | CRM Analytics conectado a datos reales de Supabase; notas internas; filtro multi-tenant reactivo; “Histórico completo” con alerta y límite de 10.000; puntaje con formato de riesgo; DatePicker en tema oscuro |
| v1.9.1 | 12 jul | **Puerto interno 8080 → 18080** (otro programa lo ocupaba) y **detección de la IP de red real** con `DatagramSocket` (ignora adaptadores virtuales). Causa raíz: instrucción “envenenada” al terminal que colapsó su servidor web |
| v1.9.2 | 13 jul | Estado `is_active` real en CRM; inactivos tachados con insignia |
| v1.9.3 | 16 jul | Tres fixes de polling: ventana anti-spam de 60 s → 5 s, limpieza de mapas estáticos por ciclo y **`searchID` estable** (antes cambiaba por página y el terminal devolvía siempre los mismos 50). 350 eventos recuperados en 7 consultas |
| v1.9.4 | 16 jul | Request con `major:0, minor:0` (wildcard real en este firmware); mapa de códigos corregido (5_7 botón de salida, 5_22 puerta forzada, tamper 1_404/1_406); filtro anti-ruido por contexto (ventana de 3 s tras un `granted`) |
| v1.9.5 | 16 jul | Se vacía el `employeeNo` en eventos de infraestructura (identidad falsa del hardware); **redirección activa multi-tenant** y **ancla en RAM** para que el polling avance sin atascos ni pérdida |
| v1.9.6 | 24 jul | Botón “Dar de baja” vs “Desvincular de embarcación” (`unlinkUserFromUnit` sobre `user_units`); **instancia única por IPC** (`SHOW_WINDOW`) |
| v1.9.7 | 24 jul | Monitor en vivo incluye morosos/denegados; desvinculación informa bien al sensor; composición de saldos importa la fecha del recibo (gráficos y filtro por fechas) |
| v1.9.8 | 8 ago | Monitor en vivo: permitidos y denegados en tiempo real sin reabrir la aplicación |
| v1.9.9 | hace 2 semanas | Importación de saldos: de 26.500 datos a 560 |

### Frases para el sitio (respaldadas)

- “La imagen que acepta el sensor es la que se cifra: si el hardware la rechaza, nunca llega a la bóveda.”
- “Solo personas en el terminal; la lógica de negocio vive en el servidor.”
- “Dos empresas, un mismo terminal, cero cruces de datos.”

### Pendiente de confirmar

- Cantidad de sensores/usuarios en operación (para una métrica de escala honesta).
- El sitio **nombra** a Marinas del Paraná Guazú y Guazú Entre Ríos SRL (instrucción: “nombrá todo y después te digo”). Marcado con `TODO(Agustín)`.

---

## Pilar 2 — COBRA (pagos integrados) 🟢

**Producto de referencia:** *La Ñata* — SaaS multi-tenant de reservas deportivas (Angular PWA + Supabase + Mercado Pago). Cierre comercial documentado: ~USD 300 iniciales + USD 55/mes.
**Stack:** Angular, Supabase (Edge Functions, Realtime, RLS), Mercado Pago (Checkout Pro / Bricks), Cloudflare Turnstile, Resend.

### Hechos verificables

| Hecho | Detalle | Origen |
|---|---|---|
| El monto no viaja desde el cliente | El frontend envía solo `booking_id` + `payment_type` (`deposit` \| `full`). La Edge Function calcula el precio desde la base y crea la preferencia | Notion · MP B2B2C Fase 1 |
| Modelo B2B2C sin comisión por transacción | Usa el `mp_access_token` **del comercio**: el 100 % del dinero va a su cuenta. Sin `marketplace_fee`; cuota fija mensual | Notion · MP B2B2C Fase 1 |
| Vinculación OAuth segura | OAuth de MP con **PKCE** (RFC 7636) y validación CSRF por `state`; verificación por email OTP antes de vincular (se descartó TOTP por fricción: decisión de producto documentada) | Notion · MP B2B2C v3/v4 |
| Idempotencia | Preferencias con TTL de 30 min en `mp_payment_preferences`; webhooks tolerantes a reintentos | Notion · MP B2B2C / Detalle del proyecto |
| Aislamiento multi-tenant | Verificación de pertenencia a la `company_id` en la Edge Function + RLS por JWT | Notion · MP B2B2C Fase 1 |
| Concurrencia y tiempo real | Estados `Pendiente_Pago`/`Pago_Total` visibles en la grilla; race condition de Realtime resuelta con eventos `paymentStarted`/`paymentFailed` | Notion · MP B2B2C v2/v3 |
| Billetera virtual en vez de refunds | Ante suspensión por lluvia, la seña se acredita como saldo a favor (evita 10–30 días de reintegro bancario) | Notion · Detalle del proyecto |
| Recibo para invitados | Flujo *Guest Receipt* con *smart polling* para usuarios sin sesión | Notion · Guest Receipt |

### Frases para el sitio (respaldadas)

- “El precio lo decide el servidor. Aunque alguien modifique el navegador, el monto que llega a Mercado Pago no cambia.”
- “El dinero va directo a la cuenta del comercio. Sin comisión por transacción.”

### Pendiente de confirmar

- Volumen transaccionado (si se quiere mostrar). No se inventa.
- ✅ Resuelto: Agustín confirmó que el webhook está blindado por Edge Functions de Supabase y todo corre en el backend, nada en el front. La frase del sitio es “los webhooks se procesan en Edge Functions de Supabase: nada de la lógica de pago vive en el cliente”. No se afirma “firma HMAC”, que una nota de v4 indica desactivada.

---

## Pilar 3 — DECIDE (automatización con IA, n8n) 🟢

**Producto de referencia:** *SAP (Sistema de Asistencia al Personal)* — asistente conversacional por Telegram para consultas de RRHH de una Secretaría de Salud municipal.
**Stack:** n8n (orquestador), Google Gemini (LangChain Agent), MySQL, Google Sheets (auditoría), Telegram Bot API.

> Es información institucional con datos personales. **Nunca se muestran datos reales** en el sitio. Estado confirmado por Agustín: **el bot está en producción** en la Secretaría de Salud de la Municipalidad de Pilar. El sitio lo nombra así; lo que dicen la jefa del Hospital Central y el intendente **no se publica** (queda como `TODO(Agustín)` en `soluciones-page.html`).

### Hechos verificables

| Hecho | Detalle | Origen |
|---|---|---|
| *Text-to-SQL* restringido | La IA **no tiene la base en memoria**: solo traduce lenguaje natural a SQL; n8n lo ejecuta de forma determinista | Notion · Documentación Bot SAP |
| Control de acceso Zero Trust | Whitelist por `chat_id` interno de Telegram (no por @usuario); intento no autorizado dispara alerta | Notion · Documentación Bot SAP |
| Auditoría completa | Cada consulta registra fecha, usuario, pregunta, columnas y SQL ejecutado | Notion · Documentación Bot SAP |
| Control de consumo | `LIMIT 5` obligatorio y prohibido `SELECT *` (de 55+ columnas se usan 8) | Notion · Documentación Bot SAP |
| Benchmarks reales | Promedio ≈ **8.162 tokens** por consulta (4 casos medidos); un error de desbordamiento llegó a ~138.000; sin restricciones habría sido >1.500.000 por iteración | Notion · Documentación Bot SAP §4 y §7 |
| ETL automatizado | Flujo de sincronización que normaliza el Excel maestro (snake_case), deduplica por legajo y hace upsert masivo | Notion · Documentación Bot SAP §5 |
| Feedback loop | “Observaciones” del usuario se guardan en planilla de QA separada | Notion · Documentación Bot SAP §3 |

### Contexto de plataforma (SAP Pilar)

- Infraestructura de microservicios en Docker con red privada (`red_salud`), base central `SAP-global` (MySQL maestro), login centralizado y módulos aislados: si uno falla no tumba al resto. Origen: Notion · “Microservicios global”.
- Módulos: dashboard principal, ticketera, autenticación centralizada, bot SAP.
- ⚠️ En Notion coexisten “SAP Pilar ( DEPRECADO )” y “SAP Pilar Fix”. Usar solo lo del *Fix* como referencia vigente.

### Frases para el sitio (respaldadas)

- “La IA no guarda tus datos ni los inventa: traduce la pregunta, el sistema ejecuta, y todo queda auditado.”
- “Una consulta cuesta ~8.000 tokens, no millones: el diseño impone los límites.”

### Pendiente de confirmar

- Autorización para mencionar las valoraciones de la dirección del Hospital Central y del intendente.
- Si se puede mostrar el logo/nombre institucional más allá del texto.

---

## Plataforma interna (soporte de credibilidad)

**AT Core** (`core.arrambidetech.com`): panel interno Angular 21 + Supabase.

- Roles con seguridad en backend (`requireRole` en edge functions; el “goku lock” atado a un email).
- Finanzas con **Dual Ledger** USD/ARS y costo promedio en inversiones.
- Seis herramientas que corren 100 % en el navegador (incluye eliminación de fondo con modelo ONNX local).
- Documentación de módulos y grafo de conocimiento del código (704 nodos, 55 comunidades).

Úsese como prueba de **disciplina de ingeniería** (seguridad, documentación, testing) más que como producto.

---

## Ecosistema y clientes

| Proyecto | Tipo | Estado | Se puede nombrar |
|---|---|---|---|
| SortProject | SaaS de inventario/ventas (desktop JavaFX + web Angular, offline-first) | 🟢 | Sí (ya público) |
| Gestión de empleados / presentismo | JavaFX + ESP32/QR, reportes automáticos | 🟢 | Cliente: confirmar |
| La Ñata | SaaS de reservas + pagos | 🟢 | Sí (ya público en el sitio) |
| Demode | SaaS de barberías (planes, reservas) | 🟢 | Sí (ya público) |
| Hyder | Plataforma para cliente | 🟢 | Confirmar |
| Mezuri Carpintería | Web institucional, vendida y publicada | 🟢 | Sí |
| HabitTracker | App Android nativa (Kotlin/Compose) | 🟢 | Sí |
| AT Core | Panel interno | 🟢 interno | — |

## Principios de ingeniería declarados (usables en el sitio)

- Iron Law TDD: no hay código sin test que lo valide.
- Seguridad en el backend; los guards del frontend son UX.
- Offline-first con sincronización y resolución de conflictos.
- Multi-tenancy con aislamiento estricto por `company_id`/`organization_id`.
- Documentación viva (docs en repo + espejo en Notion).
