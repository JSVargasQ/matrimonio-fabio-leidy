# Leidy & Fabio — Invitación Digital de Matrimonio

Página web de invitación de boda con temática Disney (estilo Encanto). Una sola página, mobile-first, con scrollytelling y animaciones scroll-triggered.

---

## Datos del evento

| Campo       | Detalle                                                      |
|-------------|--------------------------------------------------------------|
| Novios      | Leidy & Fabio                                                |
| Fecha       | 2 de noviembre de 2026                                       |
| Hora        | 11:00 AM                                                     |
| Lugar       | Via Puente Piedra a Subachoque KM 6.5, Vereda La Cuesta, Desvio Vía La Porquera |
| RSVP antes  | 12 de junio de 2026                                          |
| WhatsApp    | +57 315 253 1231                                             |

### Itinerario
- 11:00 AM — Inicio Recepción Capilla
- 11:30 AM — Inicio de Ceremonia
- 1:00 PM — Recepción

### Colores bloqueados (dress code)
- **Mujeres:** blanco, palo rosa, rojo
- **Hombres:** por definir

---

## Stack técnico

- **HTML + CSS + JavaScript puros** — sin framework, sin build step
- **GSAP 3 + ScrollTrigger** (CDN) — animaciones scroll-triggered
- **CSS Scroll-driven animations** — barra de progreso nativa del browser
- **Google Fonts** — Dancing Script, Playfair Display, Lato
- **Canvas 2D** — polvo de hada (fairy dust) que sigue el cursor/touch

## Estructura de archivos

```
matrimonio-fabio-leidy/
├── index.html      # Estructura HTML con las 9 secciones
├── style.css       # Estilos mobile-first, paleta Encanto, animaciones CSS
├── main.js         # GSAP ScrollTrigger, Canvas fairy dust, countdown, partículas
├── context.md      # Datos crudos del matrimonio (fuente de verdad del contenido)
└── img/
    ├── WhatsApp Image 2026-05-16 at 22.58.03.jpeg      # Couple (hero + venue bg)
    ├── WhatsApp Image 2026-05-16 at 22.58.03 (1).jpeg  # Manos / anillo
    └── WhatsApp Image 2026-05-16 at 22.58.03 (2).jpeg  # Familia completa
```

## Cómo ver el proyecto

Abrir `index.html` directamente en el browser. No requiere servidor ni build.

Para probar la experiencia móvil correctamente:
1. Abrir en Chrome
2. DevTools → Toggle device toolbar (Cmd+Shift+M)
3. Seleccionar iPhone 14 Pro (390px) o similar

---

## Temática y diseño

### Paleta Encanto-inspirada

| Variable         | Color     | Uso                          |
|------------------|-----------|------------------------------|
| `--gold`         | `#E8A838` | Títulos, detalles decorativos |
| `--purple`       | `#7B2FBE` | Fondos de sección, acentos   |
| `--green`        | `#2D6A4F` | Follaje, separadores SVG     |
| `--pink`         | `#E84C7D` | Acento romántico, CTA        |
| `--cream`        | `#FFF8F0` | Fondos claros, texto          |
| `--orange`       | `#D4623A` | Flores cálidas, gradientes    |

### Secciones (en orden de scroll)

1. **Hero** — Pantalla completa, imagen couple con parallax, luciérnagas flotantes, nombres + fecha con entrada animada
2. **Versículo** — Eclesiastés 4:9 y 4:12, texto revelado carácter a carácter con GSAP stagger
3. **Save the Date** — Número "2" con efecto elástico, fondo estrellado, countdown regresivo en tiempo real
4. **Itinerario** — Timeline vertical con línea que crece al hacer scroll (scrub)
5. **Ubicación** — Imagen de fondo con parallax y overlay, botón a Google Maps
6. **Familia** — Foto de la familia con entrada scroll-triggered, ornamentos SVG
7. **Dress Code** — Swatches de colores bloqueados con animación stagger
8. **Anillo / Manos** — Foto con pétalos cayendo animados en CSS
9. **RSVP** — CTA final con castillo SVG, botón WhatsApp con pulso, confeti

### Efectos visuales generados en código (sin imágenes externas)

- Polvo de hada (fairy dust) en Canvas — sigue cursor y touch
- Luciérnagas flotantes — CSS keyframes con posiciones aleatorias en JS
- Estrellas con efecto twinkle — CSS keyframes, generadas en JS
- Pétalos de flores cayendo — CSS keyframes, generados en JS
- Confeti en RSVP — CSS keyframes, generado en JS
- Flores y vides decorativas — SVG inline
- Silueta de castillo Disney — SVG path inline
- Sparkles 4-puntas — SVG inline con animación CSS

---

## Fase 2 — Invitaciones personalizadas (pendiente)

El hook ya está preparado en `main.js`. La idea es usar un query param `?code=XXXX` para mostrar el nombre del invitado y su número de cupos, sin que quien no tenga el código acceda a esa información.

### Flujo planeado

```
URL: https://tu-dominio.com/?code=ABC123
```

- Si no hay `?code` → invitación genérica (estado actual)
- Si hay `?code` válido → aparece banner personalizado: _"Estimado/a **Nombre**, tienes **N** cupo(s) reservado(s)."_
- Si el código no existe → tratar como invitación genérica (sin error visible)

### Código base ya en main.js

```js
function resolveGuest() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return null;
  // TODO Fase 2: lookup en tabla de códigos o API
  // return { name: 'Juan Pérez', seats: 2 };
  return null;
}
```

### Opciones para implementar el lookup (decidir en Fase 2)

| Opción                   | Pros                              | Contras                        |
|--------------------------|-----------------------------------|--------------------------------|
| JSON hardcodeado en JS   | Sin backend, deploy simple        | Códigos visibles en el fuente  |
| Google Sheets + API      | Fácil de editar por los novios    | Requiere autenticación Google  |
| Netlify Functions / CF Workers | Códigos ocultos, serverless  | Un poco más de setup           |
| Archivo JSON en servidor | Simple y privado                  | Requiere hosting con servidor  |

---

## Deployment sugerido

El proyecto es estático — se puede hostear en:
- **Netlify** (drag & drop de la carpeta) — recomendado, gratis
- **GitHub Pages** — gratis, requiere repo público o plan pago para privado
- **Vercel** — drag & drop o desde GitHub

Para Fase 2 con backend de códigos, Netlify Functions o Cloudflare Workers son la opción más limpia.

---

## Versículos de referencia

> *"Dos son mejor que uno, porque tienen mejor paga de su trabajo."*
> — Eclesiastés 4:9

> *"Y si alguno prevaleciere contra uno, dos le resistirán; y cordón de tres dobleces no se rompe pronto."*
> — Eclesiastés 4:12
