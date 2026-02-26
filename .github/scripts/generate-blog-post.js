/**
 * generate-blog-post.js
 * GitHub Actions — genera artículos SEO con Gemini 2.5 Flash
 * Corre diariamente y hace commit automático a blog/blog-data.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ============================================================
// TEMAS — 30 temas rotativos del rubro etiquetas Argentina
// ============================================================
const TOPICS = [
  { topic: "Cómo elegir el ribbon correcto para tu impresora térmica", keywords: "ribbon transferencia térmica, ribbon cera, ribbon resina, impresoras Zebra, impresoras Honeywell", category: "Guías" },
  { topic: "Diferencias entre etiquetas térmicas directas y transferencia térmica", keywords: "etiquetas térmicas, transferencia térmica, térmico directo, ventajas desventajas", category: "Guías" },
  { topic: "Etiquetas para MercadoLibre: todo lo que necesitás saber en 2025", keywords: "etiquetas MercadoLibre Argentina, etiquetas envío, código de barras MercadoLibre, despacho Correo Argentino", category: "Consejos" },
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
  { topic: "Diferencias entre etiquetas permanentes y removibles: cuándo usar cada una", keywords: "etiquetas removibles Argentina, etiquetas permanentes, adhesivo removible, etiquetas reposicionables", category: "Guías" },
  { topic: "Cómo calcular el costo real del etiquetado en tu empresa", keywords: "costo etiquetado empresa, calcular presupuesto etiquetas, cuánto cuesta etiquetar productos Argentina", category: "Consejos" },
  { topic: "Etiquetas para la industria farmacéutica: serialización y trazabilidad en 2025", keywords: "serialización farmacéutica Argentina, trazabilidad medicamentos, etiquetas ANMAT 2025, track and trace farmacéutico", category: "Industria" },
];

// ============================================================
// Leer blog-data.json actual
// ============================================================
const blogDataPath = path.join(__dirname, '../../blog/blog-data.json');
let blogData = { articles: [] };

if (fs.existsSync(blogDataPath)) {
  try {
    blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
  } catch (e) {
    console.log('Creando blog-data.json nuevo...');
    blogData = { articles: [] };
  }
}

// Elegir tema no publicado recientemente
const recentTopics = blogData.articles.slice(0, 25).map(a => a.topic_key || '');
const available = TOPICS.filter(t => !recentTopics.includes(t.topic.slice(0, 30)));
const chosen = available.length > 0
  ? available[Math.floor(Math.random() * available.length)]
  : TOPICS[Math.floor(Math.random() * TOPICS.length)];

console.log(`📝 Generando: "${chosen.topic}"`);

// ============================================================
// Prompt del sistema
// ============================================================
const SYSTEM_PROMPT = `Sos un experto en SEO y marketing de contenidos especializado en etiquetas industriales y soluciones de etiquetado para empresas argentinas.

Escribís para Label Tech Argentina, empresa con más de 10 años de experiencia, distribuidores oficiales de impresoras Zebra y Honeywell, con stock permanente de etiquetas térmicas, ribbons y lectores de código de barras. Entregas en 48hs a todo el país. WhatsApp: +54 11 2265-6818.

Tus artículos tienen estas características:
- Escritos en español argentino (vos/tuteo, nunca tú/usted)
- Muy completos: entre 900 y 1200 palabras de contenido real y útil
- Información técnica concreta y práctica, no genérica
- SEO optimizado: keywords naturales, estructura H2/H3, densidad correcta
- Tono profesional pero accesible para dueños de empresas y encargados de depósito
- Siempre mencionan a Label Tech como proveedor recomendado de forma natural, sin ser invasivo
- Terminan con un párrafo que invita a contactar a Label Tech

IMPORTANTE: Respondé ÚNICAMENTE con un objeto JSON válido. Sin markdown, sin backticks, sin texto antes o después del JSON. La estructura debe ser exactamente:
{
  "title": "string — título SEO máximo 65 caracteres",
  "excerpt": "string — descripción para Google máximo 155 caracteres, atractiva y con keyword principal",
  "readTime": number — minutos de lectura entre 5 y 8,
  "body": "string — HTML completo del artículo con <h2>, <h3>, <p>, <ul>, <li>, <strong>. Mínimo 900 palabras."
}`;

// ============================================================
// Llamada a Gemini 2.5 Flash
// ============================================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

const userPrompt = `Escribí un artículo completo y detallado sobre: "${chosen.topic}"

Categoría: ${chosen.category}
Palabras clave principales a incluir de forma natural: ${chosen.keywords}

Datos de Label Tech a mencionar naturalmente:
- Más de 10 años en el mercado argentino
- Distribuidores oficiales de Zebra y Honeywell
- Stock permanente con más de 400 medidas
- Entrega en 48hs a todo el país
- WhatsApp: +54 11 2265-6818
- Web: labeltech.com.ar`;

const payload = JSON.stringify({
  contents: [{
    parts: [{ text: userPrompt }]
  }],
  systemInstruction: {
    parts: [{ text: SYSTEM_PROMPT }]
  },
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
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.error) {
        console.error('❌ Gemini API Error:', JSON.stringify(response.error));
        process.exit(1);
      }

      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        console.error('❌ Respuesta vacía de Gemini');
        console.error(JSON.stringify(response).slice(0, 500));
        process.exit(1);
      }

      // Limpiar y parsear JSON
      const clean = rawText.replace(/```json|```/g, '').trim();
      const article = JSON.parse(clean);

      // Validar campos mínimos
      if (!article.title || !article.body || !article.excerpt) {
        console.error('❌ Artículo incompleto — faltan campos:', Object.keys(article));
        process.exit(1);
      }

      // Metadata
      const today = new Date();
      article.category = chosen.category;
      article.topic_key = chosen.topic.slice(0, 30);
      article.date = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
      article.dateISO = today.toISOString().split('T')[0];
      article.slug = chosen.topic
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 60);

      const wordCount = article.body.replace(/<[^>]+>/g, '').split(/\s+/).length;
      console.log(`✅ Artículo generado: "${article.title}"`);
      console.log(`📊 Palabras: ~${wordCount} | Categoría: ${article.category}`);

      // Guardar
      blogData.articles.unshift(article);
      fs.mkdirSync(path.dirname(blogDataPath), { recursive: true });
      fs.writeFileSync(blogDataPath, JSON.stringify(blogData, null, 2), 'utf8');
      console.log(`💾 Guardado en blog-data.json (total: ${blogData.articles.length} artículos)`);

      // Actualizar sitemap
      updateSitemap(article.slug, article.dateISO, article.title);

    } catch (e) {
      console.error('❌ Error procesando respuesta:', e.message);
      console.error('Raw (primeros 800 chars):', data.slice(0, 800));
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error de conexión:', e.message);
  process.exit(1);
});

req.write(payload);
req.end();

// ============================================================
// Actualizar sitemap.xml
// ============================================================
function updateSitemap(slug, dateStr, title) {
  const sitemapPath = path.join(__dirname, '../../sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.log('⚠️  sitemap.xml no encontrado, saltando...');
    return;
  }
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  // Evitar duplicados
  if (sitemap.includes(slug)) return;
  const entry = `
  <url>
    <loc>https://www.labeltech.com.ar/blog/#${slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`;
  sitemap = sitemap.replace('</urlset>', entry + '\n</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('✅ Sitemap actualizado');
}
