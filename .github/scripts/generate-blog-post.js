/**
 * generate-blog-post.js
 * GitHub Actions — genera artículos SEO con Gemini 2.5 Flash
 * Versión 2026.3 — genera HTML individual + actualiza blog-data.json como array
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ============================================================
// TEMAS — 30 temas rotativos del rubro etiquetas Argentina
// ============================================================
const TOPICS = [
  { topic: "Cómo elegir el ribbon correcto para tu impresora térmica", keywords: "ribbon transferencia térmica, ribbon cera, ribbon resina, impresoras Zebra, impresoras Honeywell", category: "Ribbons" },
  { topic: "Diferencias entre etiquetas térmicas directas y transferencia térmica", keywords: "etiquetas térmicas, transferencia térmica, térmico directo, ventajas desventajas", category: "Impresoras" },
  { topic: "Etiquetas para MercadoLibre: todo lo que necesitás saber en 2026", keywords: "etiquetas MercadoLibre Argentina, etiquetas envío, código de barras MercadoLibre, despacho Correo Argentino", category: "Etiquetas" },
  { topic: "Cómo mejorar la trazabilidad en tu depósito con código de barras", keywords: "trazabilidad depósito, etiquetas código de barras, control de stock, gestión inventario Argentina", category: "Etiquetas" },
  { topic: "Guía completa de impresoras Zebra para empresas argentinas", keywords: "impresoras Zebra Argentina, Zebra ZT230, Zebra ZD420, impresoras industriales etiquetas", category: "Impresoras" },
  { topic: "Etiquetas resistentes al agua: materiales y cuándo usarlas", keywords: "etiquetas resistentes agua, BOPP, polipropileno, etiquetas impermeables Argentina", category: "Etiquetas" },
  { topic: "Ribbons de cera vs resina vs mixto: la guía definitiva", keywords: "ribbon cera, ribbon resina, ribbon mixto, diferencias cuándo usar cada ribbon", category: "Ribbons" },
  { topic: "Etiquetas para la industria farmacéutica en Argentina: normativas y materiales", keywords: "etiquetas farmacéuticas Argentina, ANMAT etiquetas, serialización medicamentos, etiquetas laboratorio", category: "Normativas" },
  { topic: "Cómo reducir costos en etiquetado sin sacrificar calidad", keywords: "reducir costos etiquetado, etiquetas baratas calidad, optimizar etiquetado empresa Argentina", category: "Ribbons" },
  { topic: "Guía de etiquetado para la industria alimenticia en Argentina", keywords: "etiquetas alimentos Argentina, etiquetas ANMAT SENASA, etiquetas frío congelados, normas etiquetado alimentos", category: "Normativas" },
  { topic: "Impresoras Honeywell vs Zebra: comparativa completa para empresas", keywords: "Honeywell vs Zebra impresoras, comparación impresoras etiquetas industriales, cuál impresora comprar Argentina", category: "Impresoras" },
  { topic: "Todo sobre lectores de código de barras: tipos y cuál elegir", keywords: "lectores código de barras Argentina, scanners barcode industriales, lector 1D 2D QR, pistolas escaneo depósito", category: "Impresoras" },
  { topic: "Etiquetas para la industria química: normas GHS y SGA en Argentina", keywords: "etiquetas GHS Argentina, etiquetas SGA, normas etiquetado industria química, etiquetas peligro sustancias", category: "Normativas" },
  { topic: "Cómo implementar un sistema de inventario con códigos de barras paso a paso", keywords: "sistema inventario código de barras, software control stock Argentina, implementar trazabilidad empresa", category: "Software" },
  { topic: "Etiquetas para frío y congelados: materiales especiales para bajas temperaturas", keywords: "etiquetas frío Argentina, etiquetas congelados, etiquetas cámara frigorífica, adhesivos temperatura negativa", category: "Etiquetas" },
  { topic: "Qué es la transferencia térmica y por qué es el método más usado en industria", keywords: "transferencia térmica qué es, cómo funciona impresión térmica, ventajas transferencia térmica industria", category: "Impresoras" },
  { topic: "Etiquetas para logística y distribución: formatos y materiales más usados en Argentina", keywords: "etiquetas logística Argentina, etiquetas distribución, etiquetas pallets bultos, etiquetas para correo", category: "Etiquetas" },
  { topic: "Cómo elegir el adhesivo correcto según la superficie a etiquetar", keywords: "adhesivos etiquetas, etiquetas superficies difíciles, adhesivo permanente removible, etiquetas vidrio metal plástico", category: "Etiquetas" },
  { topic: "Etiquetas para la industria textil y de indumentaria en Argentina", keywords: "etiquetas textil Argentina, etiquetas ropa, etiquetas talle precio, etiquetas indumentaria moda", category: "Etiquetas" },
  { topic: "Por qué el BOPP es el material más versátil para etiquetas de producto", keywords: "BOPP etiquetas, polipropileno biorientado, etiquetas BOPP Argentina, ventajas material BOPP", category: "Etiquetas" },
  { topic: "Etiquetas de seguridad y antimanipulación: cuándo y cómo usarlas", keywords: "etiquetas seguridad Argentina, etiquetas antimanipulación, etiquetas void, etiquetas garantía", category: "Etiquetas" },
  { topic: "Cómo etiquetar correctamente productos para venta en supermercados argentinos", keywords: "etiquetas supermercado Argentina, código de barras EAN, etiquetas productos góndola, normativa etiquetado comercial", category: "Normativas" },
  { topic: "Etiquetas para la industria automotriz: resistencia y certificaciones", keywords: "etiquetas automotriz Argentina, etiquetas resistentes aceite temperatura, etiquetas autopartes, trazabilidad automotriz", category: "Etiquetas" },
  { topic: "Mantenimiento de impresoras de etiquetas: guía para prolongar su vida útil", keywords: "mantenimiento impresoras etiquetas, limpieza cabezal térmico, cuidado impresora Zebra Honeywell, repuestos impresoras Argentina", category: "Servicio Técnico" },
  { topic: "Etiquetas para cuidado personal y cosmética: materiales y acabados premium", keywords: "etiquetas cosméticos Argentina, etiquetas cuidado personal, etiquetas shampoo perfume, materiales premium etiquetas belleza", category: "Etiquetas" },
  { topic: "Código QR en etiquetas: usos prácticos para empresas argentinas", keywords: "código QR etiquetas empresa, QR trazabilidad, etiquetas con QR Argentina, usos código QR industria", category: "Software" },
  { topic: "Etiquetas para exportación desde Argentina: requisitos y normativas internacionales", keywords: "etiquetas exportación Argentina, normas internacionales etiquetado, código de barras EAN GS1, etiquetas bilingüe exportación", category: "Normativas" },
  { topic: "Diferencias entre etiquetas permanentes y removibles: cuándo usar cada una", keywords: "etiquetas removibles Argentina, etiquetas permanentes, adhesivo removible, etiquetas para envases", category: "Etiquetas" },
  { topic: "Cómo calcular el costo real del etiquetado en tu empresa", keywords: "costo etiquetado empresa, calcular presupuesto etiquetas, cuánto cuesta etiquetar productos Argentina", category: "Ribbons" },
  { topic: "Etiquetas para la industria farmacéutica: serialización y trazabilidad en 2026", keywords: "serialización farmacéutica Argentina, trazabilidad medicamentos, etiquetas ANMAT 2026, track and trace farmacéutico", category: "Normativas" },
];

// ============================================================
// Rutas
// ============================================================
const blogDataPath = path.join(__dirname, '../../blog/blog-data.json');
const blogDir = path.join(__dirname, '../../blog');
const sitemapPath = path.join(__dirname, '../../sitemap.xml');

// ============================================================
// Leer blog-data.json — soporta AMBOS formatos (array o {articles:[]})
// ============================================================
let articles = [];
if (fs.existsSync(blogDataPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    articles = Array.isArray(raw) ? raw : (raw.articles || []);
  } catch (e) {
    console.log('⚠️ blog-data.json inválido, empezando de cero');
    articles = [];
  }
}

// ============================================================
// Elegir tema — evitar repetidos recientes
// ============================================================
const recentKeys = articles.slice(0, 25).map(a => a.topic_key || '');
const available = TOPICS.filter(t => !recentKeys.includes(t.topic.slice(0, 30)));
const chosen = available.length > 0
  ? available[Math.floor(Math.random() * available.length)]
  : TOPICS[Math.floor(Math.random() * TOPICS.length)];

console.log(`📝 Generando: "${chosen.topic}"`);

// ============================================================
// Prompt Gemini
// ============================================================
const SYSTEM_PROMPT = `Sos un experto en SEO y marketing para Label Tech Argentina.

INSTRUCCIONES TÉCNICAS DE SALIDA:
1. Respondé ÚNICAMENTE con un objeto JSON válido.
2. NO incluyas saltos de línea literales dentro de los valores de texto.
3. Para separar párrafos en "body" usá etiquetas HTML (<p>, <h2>, <ul>, <li>).
4. Escapá todas las comillas dobles internas como \\.

Estructura exacta:
{
  "title": "string — título SEO del artículo",
  "excerpt": "string — descripción de 150 caracteres para meta description",
  "readTime": "string — ej: '5 min'",
  "body": "string — contenido HTML completo del artículo, mínimo 900 palabras"
}`;

const userPrompt = `Escribí un artículo de +900 palabras en español argentino sobre: "${chosen.topic}".
Keywords a incluir naturalmente: ${chosen.keywords}.
Mencioná a Label Tech Argentina (labeltech.com.ar, WhatsApp +54 11 2265-6818) de forma natural 1 o 2 veces.
El body debe ser HTML limpio con <h2>, <p>, <ul>/<li>. Sin <html>, <body> ni <head>.`;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

const payload = JSON.stringify({
  contents: [{ parts: [{ text: userPrompt }] }],
  systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json'
  }
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

// ============================================================
// Generar slug limpio
// ============================================================
function makeSlug(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .replace(/-+$/, '');
}

// ============================================================
// Generar HTML de la página individual del post
// ============================================================
function generatePostHTML(article) {
  const catColors = {
    'Ribbons': '#3b82f6',
    'Impresoras': '#7c3aed',
    'Servicio Técnico': '#059669',
    'Etiquetas': '#d97706',
    'Software': '#0891b2',
    'Normativas': '#dc2626',
  };
  const catColor = catColors[article.category] || '#3b82f6';

  const NAV = `<nav class="navbar" id="navbar" role="navigation">
        <div class="container"><div class="nav-wrapper">
            <a href="../index.html" class="logo"><img src="../public/images/logolabel.png" alt="Label Tech" class="logo-img"></a>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="../index.html" class="nav-link">Inicio</a></li>
                <li class="nav-dropdown"><a href="../index.html#industrias" class="nav-link">Industrias ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="../industrias/transporte-logistica.html">Transporte y Logística</a></li>
                        <li><a href="../industrias/industria-textil.html">Industria Textil</a></li>
                        <li><a href="../industrias/cuidado-personal-higiene.html">Cuidado Personal</a></li>
                        <li><a href="../industrias/industria-quimica.html">Industria Química</a></li>
                        <li><a href="../industrias/industria-alimenticia.html">Industria Alimenticia</a></li>
                        <li><a href="../industrias/industria-automotriz.html">Industria Automotriz</a></li>
                        <li><a href="../industrias/industria-farmaceutica.html">Industria Farmacéutica</a></li>
                        <li><a href="../industrias/industria-general.html">Industria General</a></li>
                    </ul>
                </li>
                <li class="nav-dropdown"><a href="../index.html#productos" class="nav-link">Productos ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="../productos/impresoras-zebra.html">Impresoras Zebra</a></li>
                        <li><a href="../productos/impresoras-honeywell.html">Impresoras Honeywell</a></li>
                        <li><a href="../productos/ribbons.html">Ribbons</a></li>
                        <li><a href="../productos/lectores-codigo-barras.html">Lectores de Código de Barras</a></li>
                        <li><a href="../productos/etiquetadoras-manuales.html">Etiquetadoras Manuales</a></li>
                        <li><a href="../productos/pistolas-aplicadoras.html">Pistolas Aplicadoras</a></li>
                        <li><a href="../productos/hilos-plasticos.html">Hilos Plásticos</a></li>
                        <li><a href="../productos/rollos-entintadores.html">Rollos y Entintadores</a></li>
                    </ul>
                </li>
                <li class="nav-dropdown"><a href="../index.html#servicios" class="nav-link">Servicios ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="../productos/servicio-impresion.html">Servicio de Impresión</a></li>
                        <li><a href="../productos/servicio-tecnico.html">Servicio Técnico</a></li>
                        <li><a href="../productos/software.html">Software</a></li>
                    </ul>
                </li>
                <li><a href="index.html" class="nav-link active">Blog</a></li>
                <li><a href="../nosotros.html" class="nav-link">Nosotros</a></li>
                <li><a href="../faq.html" class="nav-link">FAQ</a></li>
                <li><a href="../index.html#contacto" class="nav-link">Contacto</a></li>
            </ul>
            <div class="nav-social">
                <a href="https://wa.me/541122656818" target="_blank" class="social-link" aria-label="WhatsApp"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
            </div>
        </div></div>
    </nav>`;

  const titleShort = article.title.length > 55 ? article.title.slice(0, 55) + '…' : article.title;

  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-YVV0X54KK9"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-YVV0X54KK9');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | Blog Label Tech Argentina</title>
    <meta name="description" content="${article.excerpt}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.labeltech.com.ar/blog/${article.slug}.html">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.excerpt}">
    <meta property="og:url" content="https://www.labeltech.com.ar/blog/${article.slug}.html">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="es_AR">
    <meta property="article:published_time" content="${article.dateISO}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${article.title.replace(/"/g, '\\"')}","description":"${article.excerpt.replace(/"/g, '\\"')}","datePublished":"${article.dateISO}","author":{"@type":"Organization","name":"Label Tech Argentina"},"publisher":{"@type":"Organization","name":"Label Tech Argentina","logo":{"@type":"ImageObject","url":"https://www.labeltech.com.ar/public/images/logolabel.png"}},"url":"https://www.labeltech.com.ar/blog/${article.slug}.html"}</script>
    <style>
        .post-hero{padding:6rem 0 3rem;background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);color:white}
        .post-cat{padding:.25rem .875rem;background:${catColor}22;border:1px solid ${catColor}44;border-radius:2rem;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${catColor}}
        .post-meta{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
        .post-hero h1{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:800;line-height:1.2;max-width:760px;margin-bottom:1rem}
        .post-hero .excerpt{font-size:1.0625rem;color:rgba(255,255,255,.75);max-width:680px;line-height:1.7}
        .breadcrumb{padding:.875rem 0;border-bottom:1px solid var(--border)}
        .breadcrumb nav{display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:var(--text-secondary);flex-wrap:wrap}
        .breadcrumb a{color:var(--text-secondary);text-decoration:none}
        .breadcrumb a:hover{color:var(--accent)}
        .post-layout{display:grid;grid-template-columns:1fr 300px;gap:3rem;padding:4rem 0;align-items:start}
        @media(max-width:900px){.post-layout{grid-template-columns:1fr}.post-sidebar{display:none}}
        .article-body{font-size:1rem;color:var(--text-primary);line-height:1.85}
        .article-body h2{font-size:1.375rem;font-weight:700;margin:2.25rem 0 .875rem;letter-spacing:-.01em}
        .article-body h3{font-size:1.125rem;font-weight:600;margin:1.75rem 0 .625rem}
        .article-body p{margin-bottom:1.25rem}
        .article-body ul,.article-body ol{padding-left:1.5rem;margin-bottom:1.25rem}
        .article-body li{margin-bottom:.5rem}
        .article-body strong{font-weight:700}
        .post-sidebar{position:sticky;top:6rem;display:flex;flex-direction:column;gap:1.25rem}
        .sidebar-card{background:white;border:1px solid var(--border);border-radius:1rem;padding:1.5rem}
        .sidebar-card-title{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-secondary);margin-bottom:1rem}
    </style>
</head>
<body>
    ${NAV}

    <div class="breadcrumb"><div class="container"><nav aria-label="breadcrumb">
        <a href="../index.html">Inicio</a>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <a href="index.html">Blog</a>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span>${titleShort}</span>
    </nav></div></div>

    <section class="post-hero"><div class="container">
        <div class="post-meta">
            <span class="post-cat">${article.category}</span>
            <span style="font-size:.875rem;color:rgba(255,255,255,.6);">📅 ${article.date}</span>
            <span style="font-size:.875rem;color:rgba(255,255,255,.6);">⏱ ${article.readTime} de lectura</span>
        </div>
        <h1>${article.title}</h1>
        <p class="excerpt">${article.excerpt}</p>
    </div></section>

    <div class="container">
        <div class="post-layout">
            <article class="article-body">
                ${article.body}
                <div style="margin-top:3rem;padding:2rem;background:linear-gradient(135deg,rgba(59,130,246,.06),rgba(168,85,247,.06));border:1px solid rgba(59,130,246,.15);border-radius:1rem;">
                    <p style="font-weight:700;font-size:1rem;margin-bottom:.5rem;">¿Tenés dudas sobre tu caso puntual?</p>
                    <p style="color:var(--text-secondary);margin-bottom:1.25rem;font-size:.9375rem;">Nuestro equipo técnico responde consultas sin cargo. Contanos tu impresora y material de etiqueta.</p>
                    <a href="https://wa.me/541122656818?text=Hola!%20Le%C3%AD%20el%20artículo%20y%20tengo%20una%20consulta." target="_blank" style="display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;background:var(--accent);color:white;border-radius:.75rem;font-weight:700;text-decoration:none;font-size:.875rem;">Consultar por WhatsApp →</a>
                </div>
            </article>
            <aside class="post-sidebar">
                <div class="sidebar-card">
                    <div class="sidebar-card-title">Label Tech Argentina</div>
                    <p style="font-size:.875rem;color:var(--text-secondary);line-height:1.6;margin-bottom:1rem;">Distribuidor oficial Zebra y Honeywell. Ribbons, insumos y servicio técnico certificado.</p>
                    <a href="https://wa.me/541122656818" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1rem;background:var(--accent);color:white;border-radius:.75rem;font-weight:700;text-decoration:none;font-size:.875rem;">Consultá gratis →</a>
                </div>
                <div class="sidebar-card">
                    <div class="sidebar-card-title">Productos relacionados</div>
                    <div style="display:flex;flex-direction:column;gap:.625rem;">
                        <a href="../productos/ribbons.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Ribbons transferencia térmica</a>
                        <a href="../productos/impresoras-zebra.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Impresoras Zebra</a>
                        <a href="../productos/impresoras-honeywell.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Impresoras Honeywell</a>
                        <a href="../productos/software.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Software NiceLabel / BarTender</a>
                        <a href="../faq.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Preguntas frecuentes</a>
                    </div>
                </div>
            </aside>
        </div>
    </div>

    <a href="https://wa.me/541122656818" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
    <script src="../script.js"></script>
</body>
</html>`;
}

// ============================================================
// Actualizar sitemap.xml con la nueva URL
// ============================================================
function updateSitemap(slug, dateISO) {
  if (!fs.existsSync(sitemapPath)) return;
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const url = `https://www.labeltech.com.ar/blog/${slug}.html`;
  if (sitemap.includes(url)) return; // ya existe
  const newUrl = `  <url><loc>${url}</loc><lastmod>${dateISO}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
  sitemap = sitemap.replace('</urlset>', newUrl + '</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`🗺️ Sitemap actualizado con: ${slug}.html`);
}

// ============================================================
// Request a Gemini
// ============================================================
const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.error) throw new Error(response.error.message);

      let rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Respuesta vacía de Gemini');

      // Limpiar markdown fences
      rawText = rawText.replace(/```json|```/g, '').trim();

      // Sanitizar saltos de línea reales dentro de strings JSON
      let article;
      try {
        article = JSON.parse(rawText.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
      } catch (e) {
        article = JSON.parse(rawText);
      }

      // Metadata
      const today = new Date();
      article.category = chosen.category;
      article.topic_key = chosen.topic.slice(0, 30);
      article.date = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
      article.dateISO = today.toISOString().split('T')[0];
      article.slug = makeSlug(chosen.topic);
      article.readTime = typeof article.readTime === 'number'
        ? article.readTime + ' min'
        : (article.readTime || '5 min');

      // 1. Guardar en blog-data.json como ARRAY (formato nuevo)
      articles.unshift(article);
      fs.writeFileSync(blogDataPath, JSON.stringify(articles, null, 2), 'utf8');
      console.log(`✅ blog-data.json actualizado (${articles.length} posts)`);

      // 2. Generar página HTML individual
      const htmlContent = generatePostHTML(article);
      const htmlPath = path.join(blogDir, `${article.slug}.html`);
      fs.writeFileSync(htmlPath, htmlContent, 'utf8');
      console.log(`✅ HTML generado: blog/${article.slug}.html`);

      // 3. Actualizar sitemap
      updateSitemap(article.slug, article.dateISO);

      console.log(`\n🎉 Listo: "${article.title}"`);

    } catch (e) {
      console.error('❌ Error procesando artículo:', e.message);
      console.log('--- RAW PREVIEW ---');
      console.log(data.slice(0, 800));
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error de red:', e.message);
  process.exit(1);
});

req.write(payload);
req.end();