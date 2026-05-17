# Video Demo - Portfolio Pixel

## Info General

- **Duración objetivo**: ~60-75 segundos (mínimo 1 minuto)
- **Resolución**: 1920x1080 (1080p)
- **FPS**: 30
- **Plataforma**: YouTube
- **Estilo**: Screen recording interactivo + overlays de texto/anotaciones en HyperFrames
- **Framework**: [HyperFrames](https://hyperframes.heygen.com/) (Heygen)
- **Enfoque**: Video tipo "UX walkthrough" — usuario real navegando, haciendo scroll, clicks, interactuando

## Credenciales de Prueba

| Rol     | Email                     | Contraseña |
| ------- | ------------------------- | ---------- |
| Miembro | jmalvarez@unimayor.edu.co | est123     |
| Admin   | admin@unimayor.edu.co     | admin123   |

---

## Grabación de Pantalla (OBS)

### Configuración OBS

1. **Escena**: Captura de ventana del navegador (Chrome/Edge)
2. **Resolución**: 1920x1080
3. **FPS**: 30
4. **Formato de grabación**: MP4
5. **Sin audio** (se añade después si es necesario)

### Flujo de Grabación

1. Abrir app en `http://localhost:3000`
2. Iniciar grabación en OBS
3. Seguir el storyboard abajo (navegar paso a paso)
4. Detener grabación al final
5. Guardar como `assets/screen-recording.mp4` en el proyecto HyperFrames

---

## Storyboard (Interactivo)

### 0:00-0:03 | Apertura

- **Vista**: Pantalla negra → fade-in a landing page
- **Texto overlay**: "Portfolio Pixel - Gestión de Portafolios Universitarios"
- **Acción**: Fade-in de la landing page, cursor aparece

### 0:03-0:12 | Landing - Hero + Scroll

- **Vista**: Sección hero con buscador
- **Acción**: 
  - Cursor se mueve al buscador (hover)
  - Scroll lento hacia abajo
- **Texto overlay**: "Explora proyectos tecnológicos"

### 0:12-0:20 | Landing - Talento Destacado

- **Vista**: Grid de estudiantes ("Talento Destacado")
- **Acción**: 
  - Scroll por las cards de estudiantes
  - Hover sobre una card (efecto visual)
  - Click en un perfil de estudiante
- **Texto overlay**: "Descubre talento estudiantil"

### 0:20-0:28 | Perfil de Estudiante

- **Vista**: Página de perfil de un miembro (`/profile/[id]`)
- **Acción**: 
  - Scroll por el perfil (competencias, info)
  - Click en "Volver" o back button
- **Texto overlay**: "Perfiles con competencias verificadas"

### 0:28-0:35 | Landing - Proyectos

- **Vista**: Sección de proyectos en la landing
- **Acción**: 
  - Scroll por proyectos
  - Hover sobre un proyecto
  - Click en un proyecto
- **Texto overlay**: "Proyectos reales de la universidad"

### 0:35-0:42 | Detalle de Proyecto

- **Vista**: Página de detalle de proyecto (`/project/[id]`)
- **Acción**: 
  - Scroll por la info del proyecto
  - Ver participantes, descripción
  - Volver a la landing
- **Texto overlay**: "Portafolio personal de cada integrante"

### 0:42-0:48 | Transición a Login

- **Vista**: Landing page → cursor va a botón de login en navbar
- **Acción**: 
  - Click en "Iniciar Sesión"
  - Transición a página de login
- **Texto overlay**: "Área personal del miembro"

### 0:48-0:55 | Login como Miembro

- **Vista**: Página de login (`/login`)
- **Acción**: 
  - Escribir email: `jmalvarez@unimayor.edu.co`
  - Escribir contraseña: `est123`
  - Click en "INICIAR SESIÓN"
  - Loading spinner → redirect al dashboard
- **Texto overlay**: "Acceso seguro con autenticación"

### 0:55-1:05 | Dashboard Miembro - Mi Perfil

- **Vista**: Dashboard con sidebar + "Mi Perfil"
- **Acción**: 
  - Sidebar aparece
  - Scroll por el perfil del miembro
  - Ver competencias, enlaces profesionales
- **Texto overlay**: "Gestiona tu perfil y competencias"

### 1:05-1:15 | Dashboard Miembro - Mis Proyectos

- **Vista**: Click en "Mis Proyectos" en sidebar
- **Acción**: 
  - Navegación a `/dashboard/projects`
  - Scroll por la lista de proyectos
  - Ver estado de aprobación
- **Texto overlay**: "Mis proyectos - Portafolio personal"

### 1:15-1:22 | Dashboard Miembro - Mis Participaciones

- **Vista**: Click en "Mis Participaciones" en sidebar
- **Acción**: 
  - Navegación a `/dashboard/participations`
  - Scroll por la lista de participaciones
- **Texto overlay**: "Proyectos en los que participo"

### 1:22-1:28 | Logout

- **Vista**: Dashboard → cursor va a "Cerrar Sesión"
- **Acción**: 
  - Click en "Cerrar Sesión"
  - Redirect a landing page
  - Cursor va a login de nuevo
- **Texto overlay**: "Cambio de rol: Admin"

### 1:28-1:35 | Login como Admin

- **Vista**: Página de login
- **Acción**: 
  - Escribir email: `admin@unimayor.edu.co`
  - Escribir contraseña: `admin123`
  - Click en "INICIAR SESIÓN"
  - Loading → redirect al dashboard
- **Texto overlay**: "Panel de Administración"

### 1:35-1:45 | Dashboard Admin - Gestión de Usuarios

- **Vista**: Dashboard admin con sidebar completo
- **Acción**: 
  - Click en "Gestión de Usuarios"
  - Scroll por la tabla de usuarios
  - Ver roles, estados
- **Texto overlay**: "Gestión global de usuarios"

### 1:45-1:52 | Dashboard Admin - Competencias

- **Vista**: Click en "Catálogo Competencias"
- **Acción**: 
  - Navegación a `/dashboard/competencies`
  - Scroll por la tabla de competencias
- **Texto overlay**: "Catálogo de competencias tecnológicas"

### 1:52-2:00 | Dashboard Admin - Aprobaciones

- **Vista**: Click en "Aprobaciones Pendientes"
- **Acción**: 
  - Navegación a `/dashboard/approvals`
  - Ver proyectos pendientes de aprobación
- **Texto overlay**: "Aprobaciones y auditoría"

### 2:00-2:05 | Cierre

- **Vista**: Fade-out a pantalla de cierre
- **Texto overlay**: "¡Gracias por ver!"
- **Acción**: Fade-out + branding

---

## Estructura del Proyecto HyperFrames

```
my-video/
├── index.html                    # Composición principal
├── hyperframes.json              # Configuración del proyecto
├── package.json                  # Scripts: dev, check, render, publish
├── meta.json                     # Metadata del proyecto
├── assets/
│   └── screen-recording.mp4      # Video grabado con OBS
├── compositions/
│   ├── scene-apertura.html       # 0-3s: Intro overlay
│   ├── overlay-text-1.html       # Textos overlay para landing
│   ├── overlay-text-2.html       # Textos overlay para login
│   ├── overlay-text-3.html       # Textos overlay para dashboard member
│   ├── overlay-text-4.html       # Textos overlay para logout/login admin
│   ├── overlay-text-5.html       # Textos overlay para dashboard admin
│   └── scene-cierre.html         # 120-125s: Outro overlay
└── AGENTS.md                     # Instrucciones para agentes AI
```

## Escenas (timelines)

| Escena | Track | Start | Duración | ID |
|--------|-------|-------|----------|----|
| Video principal | 0 | 0s | 125s | `main-video` |
| Overlay Apertura | 1 | 0s | 3s | `scene-apertura` |
| Overlay Landing | 1 | 3s | 39s | `overlay-landing` |
| Overlay Login Member | 1 | 42s | 13s | `overlay-login-member` |
| Overlay Dashboard Member | 1 | 55s | 27s | `overlay-dashboard-member` |
| Overlay Logout/Transition | 1 | 82s | 6s | `overlay-logout` |
| Overlay Login Admin | 1 | 88s | 7s | `overlay-login-admin` |
| Overlay Dashboard Admin | 1 | 95s | 25s | `overlay-dashboard-admin` |
| Overlay Cierre | 1 | 120s | 5s | `scene-cierre` |

## Comandos

```bash
# Instalar dependencias
cd my-video && npm install

# Preview en navegador (hot reload)
npm run dev

# Validar composición (lint + validate + inspect)
npm run check

# Renderizar a MP4
npm run render -- --output final.mp4

# Renderizar borrador rápido
npm run render -- --quality draft

# Publicar y obtener enlace compartible
npm run publish
```

## Notas de Producción

### Grabación OBS

1. Abrir app en `http://localhost:3000`
2. Configurar OBS para capturar ventana del navegador (1920x1080, 30fps)
3. Iniciar grabación
4. Seguir el storyboard paso a paso (mover cursor lentamente, hacer scroll suave, clicks claros)
5. Detener grabación al final (~125 segundos)
6. Guardar como `my-video/assets/screen-recording.mp4`

### HyperFrames

- El video grabado es el A-roll (track 0, duración total)
- Los overlays de texto son sub-composiciones (track 1+) con `data-composition-src`
- Animaciones GSAP para fade-in/fade-out de textos overlay
- Colores y estilos replican la UI real de Portfolio Pixel (tema oscuro, accent #F37021, verde #2D5A27)
- Fuentes: Inter (Google Fonts)
- Total: ~125 segundos a 30fps = 3750 frames

## Notas Post-Render

- Añadir audio ambiente en edición externa si es necesario
- Ajustar timing de escenas si es necesario
- Exportar a 1080p para YouTube
