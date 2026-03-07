# labeltech.com.ar — Documentación del Sitio Web

**Label Tech** · Etiquetas industriales · Buenos Aires, Argentina  
`https://www.labeltech.com.ar` · Deploy: Cloudflare Pages · Repo: `RelowARG/labeltech.com.ar`

---

## Índice

1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de archivos](#3-estructura-de-archivos)
4. [Filosofías de desarrollo](#4-filosofías-de-desarrollo)
5. [Sistema de componentes](#5-sistema-de-componentes)
6. [Galerías de producto](#6-galerías-de-producto)
7. [SEO y structured data](#7-seo-y-structured-data)
8. [Analytics y tracking](#8-analytics-y-tracking)
9. [Mapa completo de URLs](#9-mapa-completo-de-urls)
10. [Imágenes — estructura de carpetas](#10-imágenes--estructura-de-carpetas)
11. [Deploy y flujo de trabajo](#11-deploy-y-flujo-de-trabajo)
12. [Blog — generación automática con IA](#12-blog--generación-automática-con-ia)
13. [Pendientes y hoja de ruta](#13-pendientes-y-hoja-de-ruta)

---

## 1. Descripción general

Sitio web estático para Label Tech, empresa argentina con más de 10 años de experiencia en soluciones de etiquetado industrial. Distribuidor oficial autorizado de **Zebra** y **Honeywell**.

El sitio cubre el ciclo completo de venta: awareness en industrias → productos específicos → servicios → contacto por WhatsApp. No tiene backend ni base de datos. Todo el contacto comercial se canaliza a WhatsApp (`+54 11 2265-6818`) con mensajes pre-completados según el producto consultado.

---

## 2. Stack tecnológico

| Componente | Tecnología |
|---|---|
| Markup | HTML5 semántico |
| Estilos | CSS3 con custom properties (`--primary`, `--accent`, etc.) |
| JavaScript | Vanilla JS (sin frameworks) |
| Web Components | Custom Elements v1 (`site-navbar`, `site-footer`) |
| Fuentes | Google Fonts — DM Sans + Space Mono |
| Íconos | Lucide SVG inline (sin dependencia externa) |
| Analytics | Google Analytics 4 (`G-YVV0X54KK9`) |
| Deploy | Cloudflare Pages (CD automático desde `main`) |
| Repositorio | GitHub — `RelowARG/labeltech.com.ar` |

Sin npm, sin build step, sin bundler. El sitio se sirve tal como está en el repo.

---

## 3. Estructura de archivos

```
labeltech.com.ar/
├── index.html                  # Home
├── nosotros.html
├── sustentabilidad.html
├── faq.html
├── privacidad.html
├── sitemap.xml                 # 52+ URLs
├── robots.txt
├── styles.css                  # Estilos globales
├── script.js                   # JS global (navbar scroll, animaciones)
├── components.js               # Web Components: site-navbar + site-footer
│
├── productos/                  # Páginas de producto y servicios
│   ├── impresoras-zebra.html
│   ├── impresoras-honeywell.html
│   ├── impresoras-tsc.html
│   ├── ribbons.html
│   ├── ribbon-por-modelo.html
│   ├── lectores-codigo-barras.html
│   ├── etiquetadoras-manuales.html
│   ├── pistolas-aplicadoras.html
│   ├── hilos-plasticos.html
│   ├── rollos-entintadores.html
│   ├── rebobinadores.html
│   ├── medidas-y-colores.html
│   ├── etiquetas-ilustracion.html
│   ├── etiquetas-termicas.html
│   ├── etiquetas-opp.html
│   ├── etiquetas-void.html
│   ├── poliamida-textil.html
│   ├── servicio-impresion.html
│   ├── servicio-tecnico.html
│   ├── software.html
│   └── calculadora-etiquetas.html
│
├── industrias/                 # 8 páginas de industria
│   ├── transporte-logistica.html
│   ├── industria-textil.html
│   ├── cuidado-personal-higiene.html
│   ├── industria-quimica.html
│   ├── industria-alimenticia.html
│   ├── industria-automotriz.html
│   ├── industria-farmaceutica.html
│   └── industria-general.html
│
├── blog/                       # 17+ artículos + índice
│   ├── index.html
│   └── *.html
│
└── public/
    └── images/
        ├── impresoras/         # Fotos Zebra, Honeywell, TSC
        ├── videos-zebra/       # Videos MP4 oficiales Zebra
        ├── Etiquetadoras-Manuales/
        ├── Etiquetas-Adhesivas/
        ├── Etiquetas-Adhesivas-Impresas/
        ├── Pistolas-Aplicadoras/
        ├── Poliamida-Blanca/
        ├── Poliamida-Impresa/
        ├── Ribbons/
        ├── lector-codigo-de-barras/
        └── [logos, heroes, og-image, etc.]
```

---

## 4. Filosofías de desarrollo

### 4.1 Sin dependencias externas de runtime
No hay jQuery, no hay frameworks JS, no hay CDN de terceros en runtime (excepto Google Fonts). Esto garantiza velocidad de carga y cero riesgo de romper el sitio por una dependencia externa.

### 4.2 Íconos SVG inline (sin emojis)
Todos los íconos son SVGs de la librería Lucide inlineados en el HTML. No se usan emojis en el contenido porque en algunos sistemas operativos y navegadores se renderizan de forma inconsistente y afectan el SEO. El selector Unicode `U+FE0F` (variation selector) fue eliminado de todos los archivos.

### 4.3 Web Components para navbar y footer
La navbar y el footer son Custom Elements (`<site-navbar>` y `<site-footer>`) definidos en `components.js`. Esto evita duplicar 80+ líneas de HTML en cada página y permite modificar la navegación en un solo lugar. La función `getBase()` detecta automáticamente si la página está en la raíz, en `/productos/` o en `/industrias/` y ajusta todos los paths relativos.

```js
// Uso en cualquier página de /productos/:
<site-navbar active="productos"></site-navbar>
<site-footer></site-footer>
```

### 4.4 CSS con custom properties
Los colores, tipografías y espaciados globales se definen como variables CSS en `:root` dentro de `styles.css`. Las páginas de producto tienen su propia hoja `../productos.css` para estilos específicos de las cards.

### 4.5 WhatsApp como único CTA de conversión
No hay formulario con backend. Cada botón "Consultar" abre WhatsApp con un mensaje pre-completado específico al producto que se está mirando. Ejemplo:

```
https://wa.me/541122656818?text=Hola!%20Consulto%20por%20impresoras%20Zebra.
```

Esto reduce la fricción al mínimo y lleva las consultas directo al canal de venta.

### 4.6 Hero con imagen de fondo
Todas las páginas (productos e industrias) tienen un hero con fondo oscuro superpuesto a una imagen relevante. El overlay garantiza legibilidad del texto en cualquier imagen de fondo.

### 4.7 Structured data (LD+JSON)
Las páginas de producto más importantes tienen un bloque `<script type="application/ld+json">` con schema `Product` o `Service` para mejorar la aparición en Google. Las páginas de industria tienen schema `WebPage`.

### 4.8 Imágenes sin nombres con espacios
Las carpetas de imágenes usan guiones medios en lugar de espacios (`Etiquetadoras-Manuales`, `lector-codigo-de-barras`, etc.) para evitar problemas de URL encoding en distintos servidores y sistemas operativos.

---

## 5. Sistema de componentes

### `<site-navbar active="...">`
- Acepta el atributo `active` con valores: `productos`, `industrias`, `servicios`, `blog`, `nosotros`
- Renderiza dropdown de Industrias (8 items), Productos (13 items), Servicios (4 items)
- Dropdown "Nosotros" incluye el link a `sustentabilidad.html`
- Incluye íconos SVG de WhatsApp, Instagram y LinkedIn en el extremo derecho
- Manejo de menú hamburguesa para móvil con toggle interno (no depende de `script.js`)
- Efecto scroll: agrega clase `.scrolled` al navbar cuando `window.scrollY > 20`

### `<site-footer>`
- Cuatro columnas: Industrias · Productos y Servicios · Empresa · Contacto
- Badges de pie: bandera Argentina SVG inline + "Hecho en Argentina" + "+10 años de experiencia" + logo Zebra Registered Reseller
- El logo Zebra es un link a `impresoras-zebra.html`

---

## 6. Galerías de producto

Las páginas de impresora y la mayoría de páginas de insumos tienen galerías de fotos por producto. El sistema es vanilla JS sin dependencias:

```html
<!-- En el <head> de la página -->
<style>
  .pcard-gallery { ... }
  .pcard-main-img { width:100%; height:220px; object-fit:contain; }
  .pcard-thumbs { display:flex; gap:.375rem; }
  .pcard-thumb { width:52px; height:40px; cursor:pointer; }
  .pcard-thumb.active { border-color: var(--primary); }
</style>

<!-- Antes del </body> -->
<script>
function pgSwap(el, src) {
  var g = el.closest('.pcard-gallery');
  var mi = g.querySelector('.pcard-main-img');
  mi.style.opacity = '0';
  setTimeout(function(){ mi.src = src; mi.style.opacity = '1'; }, 200);
  g.querySelectorAll('.pcard-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
</script>
```

La galería se inyecta **dentro** del `product-card-body`, al inicio, antes de la descripción. Esto garantiza que si la imagen no carga, el contenido de la card sigue siendo legible.

### Estado de fotos por página

| Página | Cards con foto |
|---|---|
| impresoras-zebra | 5 (ZD230, ZD421, ZT231, ZT411, ZD621) |
| impresoras-honeywell | 4 (PC42T+, PC45, PD45, PD45S) |
| impresoras-tsc | 6+ (TE200, TE300, TE310, TTP-244, TTP-247, TX series) |
| ribbons | 4 (Cera, Cera-Resina, Resina, Textil) |
| etiquetadoras-manuales | 3 (1 línea, 2 líneas, barril) |
| pistolas-aplicadoras | 2 (Estándar, Fina) |
| lectores-codigo-barras | 4 |
| etiquetas-ilustracion | 3 |
| etiquetas-termicas | 3 |
| etiquetas-opp | 3 |
| poliamida-textil | 3 |
| servicio-impresion | 3 |
| etiquetas-void | **sin foto** |
| hilos-plasticos | **sin foto** |
| rebobinadores | **sin foto** |

### Videos — Impresoras Zebra
La página `impresoras-zebra.html` tiene una sección "Zebra en acción" con 3 videos MP4 oficiales:

| Archivo | Serie |
|---|---|
| `zd200-video-printer-es-la.mp4` | ZD200 |
| `zd200-zd400-video-printer-es-la.mp4` | ZD400 |
| `zt400-video-printer-es-la.mp4` | ZT400 |

Todos están en `public/images/videos-zebra/`. Usan `preload="none"` y un poster de foto de producto.

---

## 7. SEO y structured data

- **Sitemap:** `sitemap.xml` con 52+ URLs incluyendo prioridades y frecuencias de cambio
- **Google Search Console:** sitemap enviado, dominio verificado
- **OG image:** `public/images/og-image.png` declarado en todas las páginas
- **Canonical:** `<link rel="canonical">` en todas las páginas
- **LD+JSON:** schema `Product` en páginas de impresoras, `Service` en servicios, `WebPage` en industrias
- **Sin emojis:** eliminados en favor de SVGs para evitar penalizaciones
- **Blog:** 17 artículos orientados a palabras clave de intención de compra argentina ("ribbon zebra argentina", "impresora etiquetas pyme", etc.)

---

## 8. Analytics y tracking

```html
<!-- En el <head> de todas las páginas -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YVV0X54KK9"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YVV0X54KK9');
</script>
```

Measurement ID: `G-YVV0X54KK9`

---

## 9. Mapa completo de URLs

### Raíz
- `/` — Home
- `/nosotros.html`
- `/sustentabilidad.html`
- `/faq.html`
- `/privacidad.html`

### Industrias (`/industrias/`)
- `transporte-logistica.html`
- `industria-textil.html`
- `cuidado-personal-higiene.html`
- `industria-quimica.html`
- `industria-alimenticia.html`
- `industria-automotriz.html`
- `industria-farmaceutica.html`
- `industria-general.html`

### Productos (`/productos/`)
**Impresoras**
- `impresoras-zebra.html` — ZD230, ZD421, ZT231, ZT411, ZD621
- `impresoras-honeywell.html` — PC42T Plus, PC45, PD45, PD45S
- `impresoras-tsc.html` — TE200, TE300, TE310, TTP-244 Pro, TTP-247, TX series

**Insumos de impresión**
- `ribbons.html` — Cera, Cera-Resina, Resina, Textil
- `ribbon-por-modelo.html` — Tabla de compatibilidad por modelo de impresora

**Etiquetas**
- `etiquetas-ilustracion.html`
- `etiquetas-termicas.html`
- `etiquetas-opp.html`
- `etiquetas-void.html`
- `poliamida-textil.html`
- `medidas-y-colores.html`

**Equipos complementarios**
- `lectores-codigo-barras.html`
- `etiquetadoras-manuales.html`
- `pistolas-aplicadoras.html`
- `hilos-plasticos.html`
- `rollos-entintadores.html`
- `rebobinadores.html`

**Servicios**
- `servicio-impresion.html`
- `servicio-tecnico.html`
- `software.html`
- `calculadora-etiquetas.html`

### Blog (`/blog/`)
17 artículos sobre transferencia térmica, ribbons, lectores, normativas argentinas, mantenimiento de equipos, etc.

---

## 10. Imágenes — estructura de carpetas

Todas las imágenes viven en `public/images/`. Los paths desde páginas en `/productos/` usan el prefijo `../public/images/`.

```
public/images/
├── impresoras/                         # Zebra (.jpg), Honeywell (.webp/.avif), TSC (.png)
├── videos-zebra/                       # MP4 oficiales (>30MB c/u, no commitear en LFS)
├── Etiquetadoras-Manuales/             # Jolly1l.png, OpenC20.png, opentex.png, ...
├── Etiquetas-Adhesivas/                # Rollos de etiquetas.jpg, 61aWvh-..._SX425_.jpg, ...
├── Etiquetas-Adhesivas-Impresas/       # Fotos de etiquetas impresas (GGL, chocolate, etc.)
├── Pistolas-Aplicadoras/               # TGFine.png, TGSTD.png
├── Poliamida-Blanca/                   # D_NQ_NP_911348-...jpg
├── Poliamida-Impresa/                  # 20230722_141409.jpg (VL Uniformes)
├── Ribbons/                            # IMG_20220726_...Photoroom.png, 5_edited_edited.png, ...
├── lector-codigo-de-barras/            # lector1.png, lector2.png
├── logolabel_transparent.png
├── logolabelvertical_white.png
├── logolabelvertical.png
├── black_and_white_reverse.png         # Logo Zebra Registered Reseller
├── Honeywell-Auth-Distributor.png
├── tsc.png
├── og-image.png
├── hero-bg-1.jpg
└── hero-bg-2.jpg
```

> **Nota:** Los videos en `videos-zebra/` pesan más de 30MB cada uno. Si el repo se vuelve pesado, considerar Git LFS o servir desde un CDN externo.

---

## 11. Deploy y flujo de trabajo

### Deploy automático
Cloudflare Pages monitorea la rama `main`. Cualquier push a `main` dispara un deploy automático. No hay pasos de build — los archivos se sirven tal como están.

### Flujo habitual para modificaciones

```bash
# 1. Editar archivos en local (WSL o Windows)
# 2. Verificar en navegador con servidor local
python -m http.server 8000   # o Live Server en VS Code

# 3. Commit y push
git add .
git commit -m "feat: descripción del cambio"
git push origin main

# 4. Cloudflare Pages despliega automáticamente (~30 segundos)
```

### Variables de entorno
No hay variables de entorno. Todo es estático.

### Dominio
`labeltech.com.ar` apunta a Cloudflare Pages. SSL/HTTPS automático vía Cloudflare.

---

## 12. Blog — generación automática con IA

El blog se auto-genera diariamente usando **GitHub Actions + Gemini 2.5 Flash**. Sin intervención manual, el sitio publica un artículo SEO nuevo cada día a las 00:05 AM (hora Argentina).

### Archivos del sistema

| Archivo | Ubicación | Función |
|---|---|---|
| `daily-blog.yml` | `.github/workflows/` | Workflow de GitHub Actions — schedula y orquesta |
| `generate-blog-post.js` | `.github/scripts/` | Script Node.js — llama a Gemini, genera HTML, actualiza datos |
| `blog/blog-data.json` | `blog/` | Array JSON con todos los artículos publicados |
| `blog/index.html` | `blog/` | Índice del blog — lee `blog-data.json` en runtime |
| `blog/*.html` | `blog/` | Una página HTML por artículo generado |

### Cómo funciona el flujo completo

```
GitHub Actions (cron 03:05 UTC)
  └─▶ checkout repo
  └─▶ node generate-blog-post.js
        ├─ Lee blog-data.json → extrae los últimos 25 temas publicados
        ├─ Elige tema del pool de 30 (evitando repetidos recientes)
        ├─ Llama a Gemini 2.5 Flash con prompt SEO en español argentino
        ├─ Recibe JSON: {title, excerpt, readTime, body (HTML)}
        ├─ Genera slug limpio (sin acentos, sin caracteres especiales)
        ├─ Escribe blog/{slug}.html — página individual completa
        ├─ Actualiza blog/blog-data.json → agrega artículo al inicio del array
        └─ Actualiza sitemap.xml → agrega la nueva URL
  └─▶ git commit "📝 Blog: nuevo artículo DD/MM/YYYY"
  └─▶ git push → Cloudflare Pages despliega automáticamente
```

### Pool de temas (30 temas rotativos)

Los temas están hardcodeados en `generate-blog-post.js` y cubren las principales palabras clave del rubro en Argentina:

| Categoría | Ejemplos de temas |
|---|---|
| Ribbons | Cera vs Resina vs Mixto · Cómo reducir costos · Cómo elegir el ribbon correcto |
| Impresoras | Zebra vs Honeywell · Guía Zebra para empresas · Transferencia térmica qué es |
| Etiquetas | MercadoLibre · Frío y congelados · Logística · Cosmética · Textil · BOPP |
| Normativas | Farmacéutica ANMAT · Alimenticia SENASA · GHS/SGA química · Exportación |
| Software | Inventario con código de barras · QR en etiquetas · NiceLabel / BarTender |
| Servicio Técnico | Mantenimiento cabezal térmico · Vida útil impresoras |

El sistema evita repetir temas que ya aparecen entre los últimos 25 artículos publicados. Cuando todos los temas fueron usados, vuelve a empezar.

### Estructura de cada artículo generado

Cada artículo generado es una página HTML standalone con:
- **Hero** con gradiente oscuro, badge de categoría con color por tipo, fecha y tiempo de lectura
- **Layout de dos columnas:** cuerpo del artículo (prose `1rem / 1.85 line-height`) + sidebar sticky con CTA de WhatsApp y links a productos relacionados
- **Breadcrumb:** Inicio → Blog → Título del artículo
- **LD+JSON:** schema `Article` con publisher, datePublished, headline
- **GA4** tracking
- **CTA inline** al final del cuerpo: "¿Tenés dudas sobre tu caso puntual?" → WhatsApp con mensaje pre-completado
- **WhatsApp float button** en esquina inferior derecha
- Navbar hardcodeada (no usa `<site-navbar>` porque está en `/blog/`, fuera del alcance del `getBase()` estándar)

### Categorías y colores de badge

| Categoría | Color |
|---|---|
| Ribbons | `#3b82f6` (azul) |
| Impresoras | `#7c3aed` (violeta) |
| Servicio Técnico | `#059669` (verde) |
| Etiquetas | `#d97706` (ámbar) |
| Software | `#0891b2` (cyan) |
| Normativas | `#dc2626` (rojo) |

### Secret requerido en GitHub

```
GEMINI_API_KEY  →  Settings > Secrets > Actions
```

El workflow usa la API gratuita de Gemini. El cron está configurado a las `03:05 UTC` (00:05 AM Argentina) para ejecutar justo después del reset de cuota diaria de Gemini.

### Ejecución manual

Desde GitHub → Actions → "Generar artículo de blog diario" → "Run workflow". Útil para testear o generar un artículo bajo demanda sin esperar al cron.

### Nota sobre la navbar del blog

Los artículos del blog tienen la navbar **hardcodeada** dentro de `generate-blog-post.js` en lugar de usar `<site-navbar>`. Esto es así porque el blog vive en `/blog/` y los paths relativos del componente `getBase()` no contemplan ese nivel. **Si se actualiza la navbar principal en `components.js`, hay que actualizar también la constante `NAV` dentro del script.**

---

## 13. Pendientes y hoja de ruta

### Alta prioridad (mayor impacto en conversión)
- [ ] **Logos de clientes reales** en la home — mayor prueba social
- [ ] **Google Reviews embed** en home o servicio-tecnico
- [ ] **Fotos propias** para `etiquetas-void.html`, `hilos-plasticos.html`, `rebobinadores.html`

### SEO
- [ ] **BreadcrumbList schema** en todas las páginas de producto e industria (estructura lista)
- [ ] Actualizar `sitemap.xml` cuando se agreguen nuevas páginas
- [ ] Reindexar en Google Search Console tras cada actualización mayor

### Contenido nuevo
- [ ] Sección **repuestos Zebra por modelo** (keyword: "repuesto zebra ZT410 Argentina")
- [ ] Página `transporte-logistica.html` — sección productos cruzados pendiente
- [ ] **Tutorial videos** en páginas de producto relevantes
- [ ] Sección de **impresoras reacondicionadas/usadas**

### Técnico
- [ ] Revisar emojis en blog: `grep -rl $'[^\x00-\x7F]' blog/*.html`
- [ ] Confirmar permiso escrito de RD Printer para usar sus fotos (permiso verbal dado)
- [ ] Evaluar Git LFS para videos Zebra si el repo supera 1GB

---

## Contacto del proyecto

- **WhatsApp:** +54 11 2265-6818
- **Email:** ventas@labeltech.com.ar
- **Instagram:** [@labeltech.ar](https://www.instagram.com/labeltech.ar/)
- **LinkedIn:** [labeltech-ar](https://www.linkedin.com/company/labeltech-ar/)
- **Repositorio:** [github.com/RelowARG/labeltech.com.ar](https://github.com/RelowARG/labeltech.com.ar)

---

*Última actualización: marzo 2026*
