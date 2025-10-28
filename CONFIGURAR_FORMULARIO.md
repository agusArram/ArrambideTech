# 📧 Configuración del Formulario de Contacto

El formulario de contacto está configurado para enviarte emails a **arrambide.agustin@gmail.com** usando Web3Forms.

## 🔑 Paso 1: Obtener tu Access Key

1. Ve a **[Web3Forms.com](https://web3forms.com/)**
2. Ingresa tu email: `arrambide.agustin@gmail.com`
3. Haz clic en "Create Access Key"
4. **Guarda el Access Key** que te dan (se ve así: `a1b2c3d4-1234-5678-abcd-123456789abc`)

## ⚙️ Paso 2: Configurar la Access Key en el código

Abre el archivo: `src/app/pages/contacto/contacto.html`

Busca la línea 32 y reemplaza `YOUR_ACCESS_KEY_HERE` con tu Access Key real:

```html
<!-- ANTES: -->
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">

<!-- DESPUÉS (con tu key real): -->
<input type="hidden" name="access_key" value="a1b2c3d4-1234-5678-abcd-123456789abc">
```

## ✅ Paso 3: Rebuild y Deploy

```bash
npm run build
```

¡Listo! Ahora cuando alguien complete el formulario de contacto, te llegará un email a `arrambide.agustin@gmail.com`

## 📋 Características del formulario:

- ✅ Validación de campos obligatorios
- ✅ Mensajes de éxito/error visuales
- ✅ Estado de "Enviando..." mientras procesa
- ✅ Botón deshabilitado durante el envío
- ✅ Reseteo automático del form al enviarse con éxito
- ✅ Email de respaldo en caso de error

## 🆓 Límites de Web3Forms (Plan Gratuito):

- **250 envíos por mes** - Completamente gratis
- Sin publicidad en los emails
- Sin marca de agua
- Respuesta automática opcional
- Protección anti-spam incluida

## 🔒 Seguridad:

- La Access Key es pública (puede estar en el código)
- Web3Forms solo envía a TU email configurado
- Nadie más puede cambiar el email de destino
- Incluye protección contra spam

---

**¿Necesitas más capacidad?**
Si necesitas más de 250 emails/mes, Web3Forms tiene un plan Pro ($8/mes) con 2500 emails/mes.
