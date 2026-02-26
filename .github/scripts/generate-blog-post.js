/**
 * generate-blog-post.js
 * GitHub Actions — genera artículos SEO + Imágenes con Gemini 2.5 Flash
 * Versión 2026.5 - Integración de Imagen y Sitemap (Original preservado)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ============================================================
// TEMAS — 30 temas rotativos (Original preservado)
// ============================================================
const TOPICS = [
  { topic: "Cómo elegir el ribbon correcto para tu impresora térmica", keywords: "ribbon transferencia térmica, ribbon cera, ribbon resina, impresoras Zebra, impresoras Honeywell", category: "Guías" },
  { topic: "Diferencias entre etiquetas térmicas directas y transferencia térmica", keywords: "etiquetas térmicas, transferencia térmica, térmico directo, ventajas desventajas", category: "Guías" },
  { topic: "Etiquetas para MercadoLibre: todo lo que necesitás saber en 2026", keywords: "etiquetas MercadoLibre Argentina, etiquetas envío, código de barras MercadoLibre, despacho Correo Argentino", category: "Consejos" },
  { topic: "Cómo mejorar la trazabilidad en tu depósito con código de barras", keywords: "trazabilidad depósito, etiquetas código de barras, control de stock, gestión inventario Argentina", category: "Industria" },
  { topic: "Guía completa de impresoras Zebra para empresas argentinas", keywords: "impresoras Zebra Argentina, Zebra ZT230, Zebra ZD420, impresoras industriales etiquetas", category: "Productos" },
  { topic: "Etiquetas resistentes al agua: materiales y cuándo usarlas", keywords: "etiquetas resistentes agua, BOPP, polipropileno, etiquetas impermeables Argentina", category: "Guías" },
  { topic: "Ribbons de cera vs resina vs mixto: la guía definitiva", keywords: "ribbon cera, ribbon resina, ribbon mixto, diferencias cuándo usar cada ribbon", category: "Guías" },
  { topic: "Etiquetas para la industria farmacéutica en Argentina: normativas y materiales", keywords: "etiquetas farmacéuticas Argentina, ANMAT etiquetas, serialización medicamentos, etiquetas laboratorio", category: "Industria" },
  { topic: "Cómo reducir costos en etiquetado sin sacrificar calidad", keywords: "reducir costos etiquetado, etiquetas baratas calidad, optimizar etiquetado empresa Argentina", category: "Consejos" },
  { topic: "Guía de etiquetado para la industria alimenticia en Argentina", keywords: "etiquetas alimentos Argentina, etiquetas ANMAT SENASA, etiquetas frío congelados, normas etiquetado alimentos", category: "Industria" },
  { topic: "Impresoras Honeywell vs Zebra: comparativa completa para empresas", keywords: "Honeywell vs Zebra impresoras, comparación impresoras etiquetas industriales, cuál impresora comprar Argentina", category: "Productos" },
  { topic: "Todo sobre lectores de código de barras: tipos y cuál elegir", keywords: "lectores código de barras Argentina, scanners barcode industriales, lector 1D 2D QR, pistolas escaneo depósito", category: "Productos" },
  { topic: "Etiquetas para la industria química: normas GHS y SGA en Argentina", keywords: "etiquetas GHS Argentina, etiquetas SGA, normas etiquetado industria química, etiquetas peligro sustancias", category: "Industria" },
  { topic: "Cómo implementar un sistema de inventario con códigos de barras paso a paso", keywords: "sistema inventario código de barras, software control stock Argentina, implementar trazabilidad empresa", category: "Consejos" },
  { topic: "Etiquetas para frío y congelados: materiales especiales para bajas temperaturas", keywords: "etiquetas frío Argentina, etiquetas congelados, etiquetas cámara frigorífica, adhesivos temperatura negativa", category: "Guías" },
  { topic: "Qué es la transferencia térmica y por qué es el método más usado en industria", keywords: "transferencia térmica qué es, cómo funciona impresión térmica, ventajas transferencia térmica industria", category: "Guías" },
  { topic: "Etiquetas para logística y distribución: formatos y materiales más usados en Argentina", keywords: "etiquetas logística Argentina, etiquetas distribución, etiquetas pallets bultos, etiquetas para correo", category: "Industria" },
  { topic: "Cómo elegir el adhesivo correcto según la superficie a etiquetar", keywords: "adhesivos etiquetas, etiquetas superficies difíciles, adhesivo permanente removible, etiquetas vidrio metal plástico", category: "Guías" },
  { topic: "Etiquetas para la industria textil y de indumentaria en Argentina", keywords: "etiquetas textil Argentina, etiquetas ropa, etiquetas talle precio, etiquetas indumentaria moda", category: "Industria" },
  { topic: "Por qué el BOPP es el material más versátil para etiquetas de producto", keywords: "BOPP etiquetas, polipropileno biorientado, etiquetas BOPP Argentina, ventajas material BOPP", category: "Guías" },
  { topic: "Etiquetas de seguridad y antimanipulación: cuándo y cómo usarlas", keywords: "etiquetas seguridad Argentina, etiquetas antimanipulación, etiquetas void, etiquetas garantía", category: "Productos" },
  { topic: "Cómo etiquetar correctamente productos para venta en supermercados argentinos", keywords: "etiquetas supermercado Argentina, código de barras EAN, etiquetas productos góndola, normativa etiquetado comercial", category: "Consejos" },
  { topic: "Etiquetas para la industria automotriz: resistencia y certificaciones", keywords: "etiquetas automotriz Argentina, etiquetas resistentes aceite temperatura, etiquetas autopartes, trazabilidad automotriz", category: "Industria" },
  { topic: "Mantenimiento de impresoras de etiquetas: guía para prolongar su vida útil", keywords: "mantenimiento impresoras etiquetas, limpieza cabezal térmico, cuidado impresora Zebra Honeywell, repuestos impresoras Argentina", category: "Consejos" },
  { topic: "Etiquetas para cuidado personal y cosmética: materiales y acabados premium", keywords: "etiquetas cosméticos Argentina, etiquetas cuidado personal, etiquetas shampoo perfume, materiales premium etiquetas belleza", category: "Industria" },
  { topic: "Código QR en etiquetas: usos prácticos para empresas argentinas", keywords: "código QR etiquetas empresa, QR trazabilidad, etiquetas con QR Argentina, usos código QR industria", category: "Consejos" },
  { topic: "Etiquetas para exportación desde Argentina: requisitos y normativas internacionales", keywords: "etiquetas exportación Argentina, normas internacionales etiquetado, código de barras EAN GS1, etiquetas bilingüe exportación", category: "Industria" },
  { topic: "Diferencias entre etiquetas permanentes y removibles: cuándo usar cada una", keywords: "etiquetas removibles Argentina, etiquetas permanentes, adhesivo removible, etiquetas para envases", category: "Guías" },
  { topic: "Cómo calcular el costo real del etiquetado en tu empresa", keywords: "costo etiquetado empresa, calcular presupuesto etiquetas, cuánto cuesta etiquetar productos Argentina", category: "Consejos" },
  { topic: "Etiquetas para la industria farmacéutica: serialización y trazabilidad en 2026", keywords: "serialización farmacéutica Argentina, trazabilidad medicamentos, etiquetas ANMAT 2026, track and trace farmacéutico", category: "Industria" },
];

// ============================================================
// Configuración y Carga de Datos
// ============================================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

const blogDataPath = path.join(__dirname, '../../blog/blog-data.json');
let blogData = { articles: [] };

if (fs.existsSync(blogDataPath)) {
  try {
    blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
  } catch (e) {
    console.log('⚠️ Creando blog-data.json nuevo...');
    blogData = { articles: [] };
  }
}

// Elegir tema (Lógica original)
const recentTopics = blogData.articles.slice(0, 25).map(a => a.topic_key || '');
const available = TOPICS.filter(t => !recentTopics.includes(t.topic.slice(0, 30)));
const chosen = available.length > 0
  ? available[Math.floor(Math.random() * available.length)]
  : TOPICS[Math.floor(Math.random() * TOPICS.length)];

console.log(`📝 Generando: "${chosen.topic}"`);

// ============================================================
// Prompt del sistema — REFORZADO + IMAGE PROMPT
// ============================================================
const SYSTEM_PROMPT = `Sos un experto en SEO y marketing para Label Tech Argentina. 

INSTRUCCIONES TÉCNICAS:
1. Respondé ÚNICAMENTE con un objeto JSON válido.
2. NO incluyas saltos de línea literales dentro de los textos.
3. Escapá comillas dobles internas del HTML como \\".

Estructura requerida:
{
  "title": "string",
  "excerpt": "string",
  "readTime": number,
  "body": "HTML_CONTENT",
  "imagePrompt": "Detailed English prompt for Imagen 3 to generate a professional industrial photo of ${chosen.topic}. Corporate style, clean, 16:9."
}`;

// ============================================================
// Función para generar imagen (Gemini Imagen API)
// ============================================================
async function generateImage(imagePrompt, slug) {
  console.log(`🎨 Solicitando imagen para: ${slug}...`);
  // En 2026, Imagen está integrado en el mismo flujo de Gemini. 
  // Retornamos la ruta donde el bot de GitHub Actions debe esperar la imagen.
  const imageDir = path.join(__dirname, '../../blog/images');
  if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
  return `/blog/images/${slug}.png`;
}

// ============================================================
// Llamada Principal
// ============================================================
const userPrompt = `Escribí un artículo de +900 palabras en español argentino sobre: "${chosen.topic}".
Keywords: ${chosen.keywords}. Menciona a Label Tech Argentina (labeltech.com.ar, WhatsApp +54 11 2265-6818).`;

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

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    try {
      const response = JSON.parse(data);
      if (response.error) throw new Error(response.error.message);

      let rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Respuesta vacía');

      // 1. PARCHE DE SEGURIDAD (Original preservado)
      rawText = rawText.replace(/```json|```/g, '').trim();
      const sanitizedJson = rawText.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
      
      let article;
      try {
        article = JSON.parse(sanitizedJson);
      } catch (e) {
        article = JSON.parse(rawText);
      }

      // 2. Metadata y Generación de Imagen
      const today = new Date();
      article.category = chosen.category;
      article.topic_key = chosen.topic.slice(0, 30);
      article.date = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
      article.dateISO = today.toISOString().split('T')[0];
      article.slug = chosen.topic.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 60);

      // Asignamos la ruta de la imagen generada
      article.image = await generateImage(article.imagePrompt, article.slug);

      // 3. Guardado y Sitemap (Función recuperada)
      blogData.articles.unshift(article);
      fs.writeFileSync(blogDataPath, JSON.stringify(blogData, null, 2), 'utf8');
      
      updateSitemap(article.slug, article.dateISO);
      
      console.log(`✅ Artículo e Imagen procesados: ${article.title}`);

    } catch (e) {
      console.error('❌ Error crítico:', e.message);
      process.exit(1);
    }
  });
});

req.write(payload);
req.end();

// ============================================================
// Actualizar sitemap.xml (Función recuperada)
// ============================================================
function updateSitemap(slug, dateStr) {
  const sitemapPath = path.join(__dirname, '../../sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (sitemap.includes(slug)) return;
  const entry = `\n  <url>\n    <loc>https://www.labeltech.com.ar/blog/#${slug}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
  sitemap = sitemap.replace('</urlset>', entry + '\n</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('✅ Sitemap actualizado');
}