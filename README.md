# Windows 95 Web Simulator & WebAssembly Games

Simulador funcional, interactivo y retro de **Windows 95** ejecutado 100% en el navegador con **React**, **Vite** y **`98.css`**, capaz de correr videojuegos clásicos de los años 90 mediante **WebAssembly (WASM)**, además de aplicaciones de escritorio y juegos arcade propios con temática del **Instituto Tecnológico Universitario Cordillera (Quito, Ecuador)**.

> Proyecto desarrollado para la materia **Programación Web 2**.

---

## Características Principales

### 1. Sistema Operativo & Gestor de Ventanas
- **Estética fiel de Windows 95 (`98.css`):** bordes biselados 3D (`#c0c0c0`), tipografía pixelada *MS Sans Serif*, barras de título activas/inactivas (`#000080` / `#808080`) e iconos SVG pixel-art.
- **Multitarea completa (`WindowManagerContext`):**
  - Arrastrar ventanas desde la barra de título respetando límites de pantalla.
  - `z-index` dinámico al hacer clic en cualquier ventana.
  - Minimizar a la barra de tareas (preservando el estado de los juegos en ejecución), Maximizar/Restaurar y Cerrar.
- **Escritorio, Barra de Tareas y Menú Inicio:**
  - Iconos con selección y doble clic.
  - Menú **Inicio** con submenú de **Programas** y pantalla de **Apagar el sistema**.
  - Bandeja del sistema con reloj en tiempo real (segundo a segundo) y control de silencio.
- **Audio retro sintetizado (`Web Audio API`):** acorde clásico de bienvenida al interactuar por primera vez y efectos de interfaz sin archivos MP3 externos.
- **Temática Cordillera Quito:** fondo de pantalla retro pixel-art con el símbolo de Cordillera, personalización en Buscaminas, Solitario, Breakout 95, SkiFree 95 y Mi PC.

### 2. Aplicaciones Funcionales
- **Bloc de Notas:** edición de texto con guardado dentro de la página (`localStorage` en `virtualFs.js`), aparición automática en el Escritorio y en **Mi PC (C:\)**, apertura de `.txt` locales y descarga real a la PC.
- **Microsoft Paint:** lienzo `<canvas>` con Lápiz, Borrador, Línea, Rectángulo, Círculo, Relleno (*Flood Fill*), paleta de 28 colores y descarga en `.png`.
- **Calculadora:** operaciones estándar, raíz cuadrada, porcentaje, inverso y memoria (`MC`, `MR`, `MS`, `M+`).
- **Símbolo del Sistema (MS-DOS):** terminal interactiva (`C:\WINDOWS>`) conectada al sistema de archivos virtual (`HELP`, `DIR`, `TYPE <archivo.txt>`, `DOOM`, `NOTEPAD`, `PAINT`, `CALC`, `COLOR`, `CLS`, `EXIT`).
- **Mi PC, Papelera de Reciclaje y Propiedades de Pantalla** (selector de 6 fondos retro).

### 3. Videojuegos Clásicos
- **En WebAssembly (`js-dos` / DOSBox local en `public/`):**
  - **DOOM (1993)** (`public/doom.jsdos`)
  - **WarCraft II: Tides of Darkness (1995)** (`public/war2.jsdos`)
  - **Duke Nukem 3D (1996)** (`public/duke3d.jsdos`)
- **Ports Nativos WebAssembly:**
  - **Diablo (1996)** vía Diabloweb WASM
  - **Quake (1996)** vía Quake-WASM
- **Juegos Nativos en React / Canvas 2D (60 FPS):**
  - **Buscaminas** (temática Cordillera, 9x9 y 12x12, contadores LED)
  - **Solitario Klondike** (baraja personalizada Cordillera)
  - **SkiFree 95** (con rampas y el Yeti a los 450m)
  - **Tetris 95** (vista previa de pieza, niveles y récord en `localStorage`)
  - **Breakout 95** (control con ratón o teclado y niveles progresivos)

---

## Tecnologías Utilizadas
- **React 19** + **Vite 8**
- **98.css** (UI retro Windows 95/98)
- **js-dos v8** (DOSBox compilado a WebAssembly)
- **HTML5 Canvas 2D**, **Web Audio API** y **localStorage**

---

## Instalación y Uso Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre la URL que muestra Vite en tu navegador (por ejemplo `http://localhost:5173`) y presiona **`F11`** para probarlo en pantalla completa.

### Otros comandos
```bash
# Compilar para producción
npm run build

# Ejecutar linter
npm run lint
```
