# Video Demo - Portfolio Pixel

## Info General

- **Duración objetivo**: ~3 minutos (180s)
- **Resolución**: 1920x1080 (1080p)
- **FPS**: 30
- **Plataforma**: YouTube
- **Estilo**: Composición HTML/CSS/JS renderizada con HyperFrames + animaciones GSAP
- **Framework**: [HyperFrames](https://hyperframes.heygen.com/) (Heygen)

## Credenciales de Prueba

| Rol     | Email                     | Contraseña |
| ------- | ------------------------- | ---------- |
| Miembro | jmalvarez@unimayor.edu.co | est123     |
| Admin   | admin@unimayor.edu.co     | admin123   |

---

## Storyboard

### 0:00-0:15 | Apertura

- **Vista**: Landing page - sección hero
- **Texto emergente**: "Portfolio Pixel - Gestión de Portafolios Universitarios"
- **Animación**: Logo fade-in + tagline + gráfico hero
- **Audio**: Música ambiente (techno/corporate uplifting)

### 0:15-0:45 | Visitante (sin login)

- Mock del navegador mostrando landing: métricas, proyectos destacados
- **Textos emergentes**:
  - "Explora proyectos tecnológicos"
  - "Descubre talento estudiantil"
  - "Busca integrantes por competencias"
- **Animación**: Browser mock slide-in + métricas fade-in

### 0:45-1:15 | Login como Miembro

- Pantalla de login con credenciales prellenadas
- Login: `jmalvarez@unimayor.edu.co` / `est123`
- **Texto**: "Área personal del miembro"
- **Animación**: Login card scale-in

### 1:15-1:45 | Dashboard Miembro - Proyectos

- Dashboard con sidebar + grid de proyectos
- **Texto**: "Mis proyectos - Portafolio personal"
- **Animación**: Sidebar slide-left + content slide-right + project cards stagger

### 1:45-2:00 | Dashboard Miembro - Participaciones

- Dashboard con lista de participaciones
- **Texto**: "Proyectos en los que participo"
- **Animación**: Participación items stagger fade-in

### 2:00-2:30 | Login como Admin

- Pantalla de login con credenciales de admin
- Login: `admin@unimayor.edu.co` / `admin123`
- **Texto**: "Panel de Administración - Como admin también puedo gestionar mi perfil como miembro"
- **Animación**: Login card scale-in

### 2:30-2:45 | Dashboard Admin - Competencias

- Dashboard admin con tabla de competencias
- **Texto**: "Gestión global: usuarios, competencias, aprobaciones, auditorías"
- **Animación**: Sidebar + table fade-in

### 2:45-3:00 | Cierre

- Pantalla de cierre con branding
- **Texto**: "¡Gracias por ver!"
- **Animación**: Thank you text scale-in + CTA fade-in

---

## Estructura del Proyecto HyperFrames

```
video-pixel/
├── index.html          # Composición principal (8 escenas)
├── hyperframes.json    # Configuración del proyecto
├── package.json        # Scripts: dev, check, render, publish
├── meta.json           # Metadata del proyecto
├── AGENTS.md           # Instrucciones para agentes AI
└── CLAUDE.md           # Instrucciones para Claude
```

## Escenas (timelines)

| Escena | Track | Start | Duración | ID |
|--------|-------|-------|----------|----|
| Apertura | 1 | 0s | 15s | `scene-apertura` |
| Visitante | 1 | 15s | 30s | `scene-visitante` |
| Login Miembro | 1 | 45s | 30s | `scene-login-member` |
| Dashboard Miembro | 1 | 75s | 30s | `scene-dashboard-member` |
| Participaciones | 1 | 105s | 15s | `scene-participations` |
| Login Admin | 1 | 120s | 30s | `scene-login-admin` |
| Dashboard Admin | 1 | 150s | 15s | `scene-dashboard-admin` |
| Cierre | 1 | 165s | 15s | `scene-cierre` |

## Comandos

```bash
# Instalar dependencias
cd video-pixel && npm install

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

- Todas las escenas son composiciones HTML/CSS estáticas (NO grabación de pantalla)
- Las animaciones usan GSAP con `window.__timelines["main"]`
- Cada escena tiene `data-start`, `data-duration`, `data-track-index`, y `class="clip"`
- Colores y estilos replican la UI real de Portfolio Pixel (tema oscuro, accent blue #3b82f6)
- Fuentes: Inter (Google Fonts)
- Total: 180 segundos a 30fps = 5400 frames

## Notas Post-Render

- Añadir audio ambiente en edición externa si es necesario
- Ajustar timing de escenas si es necesario
- Exportar a 1080p para YouTube