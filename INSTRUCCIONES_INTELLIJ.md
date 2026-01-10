# 🚀 Instrucciones para correr ArrambideTech en IntelliJ IDEA

## ✅ Configuraciones creadas

Ya están configuradas 3 run configurations tipo **Shell Script** que aparecerán en el dropdown de IntelliJ:

1. **Install Dependencies** - Instala las dependencias (npm install)
2. **Dev Server** - Corre el servidor de desarrollo (npm start)
3. **Build Production** - Compila para producción (npm run build)

**IMPORTANTE:** Las dependencias ya fueron instaladas automáticamente, así que podés ir directo al paso 2.

---

## 📋 Pasos para ejecutar

### **SI ES LA PRIMERA VEZ y necesitás reinstalar:**

1. **Instalar dependencias (OPCIONAL):**
   - En el dropdown de configuraciones (arriba a la derecha), seleccioná: **"Install Dependencies"**
   - Dale click al botón ▶️ PLAY verde
   - Esperá a que termine (puede tardar 1-2 minutos)
   - Verás "npm install completed" cuando termine

### **CADA VEZ que quieras correr el proyecto:**

2. **Correr el servidor:**
   - **Cerrá y volvé a abrir IntelliJ** para que detecte las nuevas configuraciones
   - En el dropdown de configuraciones (arriba a la derecha), seleccioná: **"Dev Server"**
   - Dale click al botón ▶️ PLAY verde
   - Se abrirá una terminal dentro de IntelliJ
   - Esperá a que compile (la primera vez tarda un poco)
   - Cuando veas en la consola:
     ```
     ✔ Built successfully
     Watch mode enabled. Watching for file changes...
     Application running at: http://localhost:4200/
     ```
   - Abrí tu navegador en: **http://localhost:4200/**

3. **Para parar el servidor:**
   - Hacé click en el botón ⏹️ STOP rojo en la barra de herramientas

---

## 🛠️ Compilar para producción

Si querés compilar el proyecto para subirlo a producción:

1. Seleccioná: **"Build Production"**
2. Dale PLAY ▶️
3. Los archivos compilados quedan en: `dist/sortproyects/browser/`

---

## 🔧 Solución de problemas

### Si el servidor no arranca:

1. Pará el servidor (botón STOP)
2. Borrá `node_modules` y volvé a correr **"Install Dependencies"**
3. Intentá correr **"Dev Server"** de nuevo

### Si IntelliJ no muestra las configuraciones:

1. Abrí el menú: **Run → Edit Configurations...**
2. Deberías ver las 3 configuraciones en la lista de la izquierda
3. Si no aparecen, hacé click en **"+"** y agregá manualmente:
   - Tipo: **npm**
   - Package.json: buscar el archivo `package.json` del proyecto
   - Command: `start` (para Dev Server)

---

## ✅ Todo listo

Una vez que el servidor esté corriendo en http://localhost:4200/, deberías ver:

- ✨ Nuevo Hero con "Software hecho para vos, no para que te adaptes"
- 📦 Sección "Nuestros Productos" con 4 cards (SortProject, EmpleadosMarinas, Páginas Web, Apps Android)
- 💚 Botones de WhatsApp funcionando
- 🎯 Modales para EmpleadosMarinas y Apps Android
- 🤝 Sección "Por Qué Elegirnos"

¡Cualquier cambio que hagas en el código se recargará automáticamente!
