/**
 * generate-geo-post.js
 * LabelTech Argentina — Generador de posts SEO geo-localizados
 * Uso: node generate-geo-post.js              → genera 1 post
 *      node generate-geo-post.js --batch 6    → genera 6 posts seguidos
 *      node generate-geo-post.js --loc "Flores" → fuerza una localidad
 *
 * Funciona en paralelo a generate-blog-post.js,
 * usa los mismos archivos (blog-data.json, /blog/, sitemap.xml)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ============================================================
// ARGS
// ============================================================
const args       = process.argv.slice(2);
const batchArg   = args.indexOf('--batch');
const BATCH      = batchArg !== -1 ? parseInt(args[batchArg + 1]) || 1 : 1;
const locArg     = args.indexOf('--loc');
const FORCE_LOC  = locArg !== -1 ? args[locArg + 1] : null;
const DELAY_MS   = 12000; // 12 segundos entre llamadas → sin problemas de rate limit

// ============================================================
// GEO — todas las localidades de Argentina
// CABA barrios, GBA partidos, capitales provinciales + provincias
// ============================================================
const GEO_LOCATIONS = [
  // ── CABA — barrios ─────────────────────────────────────────
  { name: 'Barracas',          region: 'CABA',           type: 'barrio'    },
  { name: 'Caballito',         region: 'CABA',           type: 'barrio'    },
  { name: 'Flores',            region: 'CABA',           type: 'barrio'    },
  { name: 'Floresta',          region: 'CABA',           type: 'barrio'    },
  { name: 'Villa del Parque',  region: 'CABA',           type: 'barrio'    },
  { name: 'Palermo',           region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Urquiza',     region: 'CABA',           type: 'barrio'    },
  { name: 'Almagro',           region: 'CABA',           type: 'barrio'    },
  { name: 'Once',              region: 'CABA',           type: 'barrio'    },
  { name: 'Balvanera',         region: 'CABA',           type: 'barrio'    },
  { name: 'San Cristóbal',     region: 'CABA',           type: 'barrio'    },
  { name: 'Parque Patricios',  region: 'CABA',           type: 'barrio'    },
  { name: 'La Boca',           region: 'CABA',           type: 'barrio'    },
  { name: 'San Telmo',         region: 'CABA',           type: 'barrio'    },
  { name: 'Constitución',      region: 'CABA',           type: 'barrio'    },
  { name: 'Boedo',             region: 'CABA',           type: 'barrio'    },
  { name: 'Parque Chacabuco',  region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Lugano',      region: 'CABA',           type: 'barrio'    },
  { name: 'Mataderos',         region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Luro',        region: 'CABA',           type: 'barrio'    },
  { name: 'Liniers',           region: 'CABA',           type: 'barrio'    },
  { name: 'Versalles',         region: 'CABA',           type: 'barrio'    },
  { name: 'Monte Castro',      region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Real',        region: 'CABA',           type: 'barrio'    },
  { name: 'Vélez Sársfield',   region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Devoto',      region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Pueyrredón',  region: 'CABA',           type: 'barrio'    },
  { name: 'Agronomía',         region: 'CABA',           type: 'barrio'    },
  { name: 'Paternal',          region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Santa Rita',  region: 'CABA',           type: 'barrio'    },
  { name: 'Chacarita',         region: 'CABA',           type: 'barrio'    },
  { name: 'Colegiales',        region: 'CABA',           type: 'barrio'    },
  { name: 'Belgrano',          region: 'CABA',           type: 'barrio'    },
  { name: 'Núñez',             region: 'CABA',           type: 'barrio'    },
  { name: 'Saavedra',          region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Ortúzar',     region: 'CABA',           type: 'barrio'    },
  { name: 'Coghlan',           region: 'CABA',           type: 'barrio'    },
  { name: 'Villa Riachuelo',   region: 'CABA',           type: 'barrio'    },
  { name: 'Nueva Pompeya',     region: 'CABA',           type: 'barrio'    },
  { name: 'Puerto Madero',     region: 'CABA',           type: 'barrio'    },
  { name: 'Retiro',            region: 'CABA',           type: 'barrio'    },
  { name: 'San Nicolás',       region: 'CABA',           type: 'barrio'    },
  { name: 'Monserrat',         region: 'CABA',           type: 'barrio'    },
  { name: 'Recoleta',          region: 'CABA',           type: 'barrio'    },
  { name: 'Barrio Norte',      region: 'CABA',           type: 'barrio'    },

  // ── GBA ZONA NORTE ─────────────────────────────────────────
  { name: 'San Martín',        region: 'GBA Norte',      type: 'partido'   },
  { name: 'Tres de Febrero',   region: 'GBA Norte',      type: 'partido'   },
  { name: 'General San Martín',region: 'GBA Norte',      type: 'partido'   },
  { name: 'Vicente López',     region: 'GBA Norte',      type: 'partido'   },
  { name: 'San Isidro',        region: 'GBA Norte',      type: 'partido'   },
  { name: 'Tigre',             region: 'GBA Norte',      type: 'partido'   },
  { name: 'San Fernando',      region: 'GBA Norte',      type: 'partido'   },
  { name: 'Pilar',             region: 'GBA Norte',      type: 'partido'   },
  { name: 'Escobar',           region: 'GBA Norte',      type: 'partido'   },
  { name: 'José C. Paz',       region: 'GBA Norte',      type: 'partido'   },
  { name: 'Malvinas Argentinas',region: 'GBA Norte',     type: 'partido'   },
  { name: 'Moreno',            region: 'GBA Oeste',      type: 'partido'   },
  { name: 'Hurlingham',        region: 'GBA Oeste',      type: 'partido'   },
  { name: 'Ituzaingó',         region: 'GBA Oeste',      type: 'partido'   },
  { name: 'Merlo',             region: 'GBA Oeste',      type: 'partido'   },

  // ── GBA ZONA OESTE ─────────────────────────────────────────
  { name: 'Morón',             region: 'GBA Oeste',      type: 'partido'   },
  { name: 'Haedo',             region: 'GBA Oeste',      type: 'localidad' },
  { name: 'El Palomar',        region: 'GBA Oeste',      type: 'localidad' },
  { name: 'Ramos Mejía',       region: 'GBA Oeste',      type: 'localidad' },
  { name: 'La Matanza',        region: 'GBA Oeste',      type: 'partido'   },
  { name: 'Ramos Mejía',       region: 'GBA Oeste',      type: 'localidad' },
  { name: 'San Justo',         region: 'GBA Oeste',      type: 'localidad' },
  { name: 'Tapiales',          region: 'GBA Oeste',      type: 'localidad' },
  { name: 'Laferrere',         region: 'GBA Oeste',      type: 'localidad' },
  { name: 'Gonzalez Catán',    region: 'GBA Oeste',      type: 'localidad' },

  // ── GBA ZONA SUR ───────────────────────────────────────────
  { name: 'Lanús',             region: 'GBA Sur',        type: 'partido'   },
  { name: 'Avellaneda',        region: 'GBA Sur',        type: 'partido'   },
  { name: 'Quilmes',           region: 'GBA Sur',        type: 'partido'   },
  { name: 'Lomas de Zamora',   region: 'GBA Sur',        type: 'partido'   },
  { name: 'Almirante Brown',   region: 'GBA Sur',        type: 'partido'   },
  { name: 'Esteban Echeverría',region: 'GBA Sur',        type: 'partido'   },
  { name: 'Florencio Varela',  region: 'GBA Sur',        type: 'partido'   },
  { name: 'Berazategui',       region: 'GBA Sur',        type: 'partido'   },
  { name: 'Ezeiza',            region: 'GBA Sur',        type: 'partido'   },
  { name: 'Cañuelas',          region: 'GBA Sur',        type: 'partido'   },
  { name: 'Banfield',          region: 'GBA Sur',        type: 'localidad' },
  { name: 'Temperley',         region: 'GBA Sur',        type: 'localidad' },
  { name: 'Adrogué',           region: 'GBA Sur',        type: 'localidad' },
  { name: 'Monte Grande',      region: 'GBA Sur',        type: 'localidad' },
  { name: 'Don Bosco',         region: 'GBA Sur',        type: 'localidad' },
  { name: 'Wilde',             region: 'GBA Sur',        type: 'localidad' },

  // ── PROVINCIA DE BUENOS AIRES (interior) ───────────────────
  { name: 'La Plata',          region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Mar del Plata',     region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Bahía Blanca',      region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Tandil',            region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Junín',             region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Olavarría',         region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Pergamino',         region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'San Nicolás de los Arroyos', region: 'Buenos Aires', type: 'ciudad' },
  { name: 'Zárate',            region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Campana',           region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Luján',             region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Mercedes',          region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Azul',              region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Necochea',          region: 'Buenos Aires',   type: 'ciudad'    },
  { name: 'Tres Arroyos',      region: 'Buenos Aires',   type: 'ciudad'    },

  // ── CÓRDOBA ────────────────────────────────────────────────
  { name: 'Córdoba',           region: 'Córdoba',        type: 'ciudad'    },
  { name: 'Río Cuarto',        region: 'Córdoba',        type: 'ciudad'    },
  { name: 'Villa María',       region: 'Córdoba',        type: 'ciudad'    },
  { name: 'San Francisco',     region: 'Córdoba',        type: 'ciudad'    },
  { name: 'Alta Gracia',       region: 'Córdoba',        type: 'ciudad'    },
  { name: 'Villa Carlos Paz',  region: 'Córdoba',        type: 'ciudad'    },
  { name: 'Cosquín',           region: 'Córdoba',        type: 'ciudad'    },
  { name: 'Bell Ville',        region: 'Córdoba',        type: 'ciudad'    },

  // ── SANTA FE ───────────────────────────────────────────────
  { name: 'Rosario',           region: 'Santa Fe',       type: 'ciudad'    },
  { name: 'Santa Fe',          region: 'Santa Fe',       type: 'ciudad'    },
  { name: 'Rafaela',           region: 'Santa Fe',       type: 'ciudad'    },
  { name: 'Venado Tuerto',     region: 'Santa Fe',       type: 'ciudad'    },
  { name: 'Reconquista',       region: 'Santa Fe',       type: 'ciudad'    },
  { name: 'Villa Gobernador Gálvez', region: 'Santa Fe', type: 'ciudad'   },

  // ── MENDOZA ────────────────────────────────────────────────
  { name: 'Mendoza',           region: 'Mendoza',        type: 'ciudad'    },
  { name: 'San Rafael',        region: 'Mendoza',        type: 'ciudad'    },
  { name: 'Godoy Cruz',        region: 'Mendoza',        type: 'ciudad'    },
  { name: 'Luján de Cuyo',     region: 'Mendoza',        type: 'ciudad'    },
  { name: 'Maipú',             region: 'Mendoza',        type: 'ciudad'    },

  // ── TUCUMÁN ────────────────────────────────────────────────
  { name: 'San Miguel de Tucumán', region: 'Tucumán',    type: 'ciudad'    },
  { name: 'Tafí Viejo',        region: 'Tucumán',        type: 'ciudad'    },
  { name: 'Concepción',        region: 'Tucumán',        type: 'ciudad'    },

  // ── ENTRE RÍOS ─────────────────────────────────────────────
  { name: 'Paraná',            region: 'Entre Ríos',     type: 'ciudad'    },
  { name: 'Concordia',         region: 'Entre Ríos',     type: 'ciudad'    },
  { name: 'Gualeguaychú',      region: 'Entre Ríos',     type: 'ciudad'    },
  { name: 'Colón',             region: 'Entre Ríos',     type: 'ciudad'    },

  // ── SALTA ──────────────────────────────────────────────────
  { name: 'Salta',             region: 'Salta',          type: 'ciudad'    },
  { name: 'Tartagal',          region: 'Salta',          type: 'ciudad'    },
  { name: 'Orán',              region: 'Salta',          type: 'ciudad'    },

  // ── MISIONES ───────────────────────────────────────────────
  { name: 'Posadas',           region: 'Misiones',       type: 'ciudad'    },
  { name: 'Oberá',             region: 'Misiones',       type: 'ciudad'    },
  { name: 'Eldorado',          region: 'Misiones',       type: 'ciudad'    },

  // ── CORRIENTES ─────────────────────────────────────────────
  { name: 'Corrientes',        region: 'Corrientes',     type: 'ciudad'    },
  { name: 'Goya',              region: 'Corrientes',     type: 'ciudad'    },
  { name: 'Paso de los Libres',region: 'Corrientes',     type: 'ciudad'    },

  // ── CHACO ──────────────────────────────────────────────────
  { name: 'Resistencia',       region: 'Chaco',          type: 'ciudad'    },
  { name: 'Presidencia Roque Sáenz Peña', region: 'Chaco', type: 'ciudad' },

  // ── FORMOSA ────────────────────────────────────────────────
  { name: 'Formosa',           region: 'Formosa',        type: 'ciudad'    },

  // ── JUJUY ──────────────────────────────────────────────────
  { name: 'San Salvador de Jujuy', region: 'Jujuy',      type: 'ciudad'   },
  { name: 'Palpalá',           region: 'Jujuy',          type: 'ciudad'    },

  // ── SANTIAGO DEL ESTERO ────────────────────────────────────
  { name: 'Santiago del Estero', region: 'Santiago del Estero', type: 'ciudad' },
  { name: 'La Banda',          region: 'Santiago del Estero', type: 'ciudad'   },

  // ── CATAMARCA ──────────────────────────────────────────────
  { name: 'San Fernando del Valle de Catamarca', region: 'Catamarca', type: 'ciudad' },

  // ── LA RIOJA ───────────────────────────────────────────────
  { name: 'La Rioja',          region: 'La Rioja',       type: 'ciudad'    },

  // ── SAN JUAN ───────────────────────────────────────────────
  { name: 'San Juan',          region: 'San Juan',       type: 'ciudad'    },
  { name: 'Rivadavia',         region: 'San Juan',       type: 'ciudad'    },

  // ── SAN LUIS ───────────────────────────────────────────────
  { name: 'San Luis',          region: 'San Luis',       type: 'ciudad'    },
  { name: 'Villa Mercedes',    region: 'San Luis',       type: 'ciudad'    },

  // ── LA PAMPA ───────────────────────────────────────────────
  { name: 'Santa Rosa',        region: 'La Pampa',       type: 'ciudad'    },
  { name: 'General Pico',      region: 'La Pampa',       type: 'ciudad'    },

  // ── NEUQUÉN ────────────────────────────────────────────────
  { name: 'Neuquén',           region: 'Neuquén',        type: 'ciudad'    },
  { name: 'Zapala',            region: 'Neuquén',        type: 'ciudad'    },
  { name: 'Cutral-Có',         region: 'Neuquén',        type: 'ciudad'    },

  // ── RÍO NEGRO ──────────────────────────────────────────────
  { name: 'Viedma',            region: 'Río Negro',      type: 'ciudad'    },
  { name: 'Bariloche',         region: 'Río Negro',      type: 'ciudad'    },
  { name: 'General Roca',      region: 'Río Negro',      type: 'ciudad'    },
  { name: 'Cipolletti',        region: 'Río Negro',      type: 'ciudad'    },

  // ── CHUBUT ─────────────────────────────────────────────────
  { name: 'Rawson',            region: 'Chubut',         type: 'ciudad'    },
  { name: 'Comodoro Rivadavia',region: 'Chubut',         type: 'ciudad'    },
  { name: 'Trelew',            region: 'Chubut',         type: 'ciudad'    },
  { name: 'Puerto Madryn',     region: 'Chubut',         type: 'ciudad'    },

  // ── SANTA CRUZ ─────────────────────────────────────────────
  { name: 'Río Gallegos',      region: 'Santa Cruz',     type: 'ciudad'    },
  { name: 'El Calafate',       region: 'Santa Cruz',     type: 'ciudad'    },
  { name: 'Caleta Olivia',     region: 'Santa Cruz',     type: 'ciudad'    },

  // ── TIERRA DEL FUEGO ───────────────────────────────────────
  { name: 'Ushuaia',           region: 'Tierra del Fuego', type: 'ciudad'  },
  { name: 'Río Grande',        region: 'Tierra del Fuego', type: 'ciudad'  },
];

// ============================================================
// PLANTILLAS DE TEMAS GEO — 12 variantes por localidad
// El script elige la menos usada para esa zona
// ============================================================
const GEO_TEMPLATES = [
  {
    template: (loc) => `Impresoras de etiquetas en ${loc.name}: dónde comprar y qué modelo elegir`,
    keywords: (loc) => `impresoras etiquetas ${loc.name}, impresoras Zebra ${loc.name}, impresoras Honeywell ${loc.name}, comprar impresora etiquetas ${loc.region} Argentina`,
    category: 'Impresoras',
  },
  {
    template: (loc) => `Ribbons transferencia térmica en ${loc.name}: proveedores y precios`,
    keywords: (loc) => `ribbons transferencia térmica ${loc.name}, comprar ribbon ${loc.name}, ribbon Zebra ${loc.region}, insumos impresoras etiquetas ${loc.name} Argentina`,
    category: 'Ribbons',
  },
  {
    template: (loc) => `Etiquetas adhesivas industriales en ${loc.name}: materiales y formatos`,
    keywords: (loc) => `etiquetas adhesivas ${loc.name}, etiquetas industriales ${loc.region}, proveedor etiquetas ${loc.name}, etiquetas en rollo ${loc.name} Argentina`,
    category: 'Etiquetas',
  },
  {
    template: (loc) => `Distribuidor de insumos para etiquetado en ${loc.name} y alrededores`,
    keywords: (loc) => `insumos etiquetado ${loc.name}, distribuidor ribbons etiquetas ${loc.region}, proveedor impresoras etiquetas ${loc.name}, Label Tech ${loc.region}`,
    category: 'Etiquetas',
  },
  {
    template: (loc) => `Lectores de código de barras en ${loc.name}: guía de compra para empresas`,
    keywords: (loc) => `lectores código barras ${loc.name}, scanners barcode ${loc.region}, comprar lector código barras ${loc.name}, pistolas escaneo ${loc.name} Argentina`,
    category: 'Lectores',
  },
  {
    template: (loc) => `Servicio técnico de impresoras Zebra y Honeywell en ${loc.name}`,
    keywords: (loc) => `service impresoras Zebra ${loc.name}, reparación impresoras etiquetas ${loc.region}, servicio técnico Honeywell ${loc.name}, mantenimiento impresoras ${loc.name}`,
    category: 'Servicio Técnico',
  },
  {
    template: (loc) => `Etiquetas para empresas de ${loc.name}: soluciones de trazabilidad e identificación`,
    keywords: (loc) => `etiquetas empresas ${loc.name}, trazabilidad productos ${loc.region}, identificación inventario ${loc.name}, etiquetas código barras ${loc.name} Argentina`,
    category: 'Etiquetas',
  },
  {
    template: (loc) => `Zebra Technologies en ${loc.name}: impresoras, insumos y soporte`,
    keywords: (loc) => `Zebra Technologies ${loc.name}, distribuidor oficial Zebra ${loc.region}, impresoras Zebra precio ${loc.name}, soporte Zebra ${loc.name} Argentina`,
    category: 'Impresoras',
  },
  {
    template: (loc) => `Cómo mejorar el control de stock en empresas de ${loc.name} con código de barras`,
    keywords: (loc) => `control stock ${loc.name}, código barras inventario ${loc.region}, trazabilidad depósito ${loc.name}, sistema etiquetas stock ${loc.name} Argentina`,
    category: 'Software',
  },
  {
    template: (loc) => `Etiquetas térmicas en ${loc.name}: qué son, cuándo usarlas y dónde comprarlas`,
    keywords: (loc) => `etiquetas térmicas ${loc.name}, etiquetas térmica directa ${loc.region}, comprar etiquetas térmicas ${loc.name}, rollo térmico ${loc.name} Argentina`,
    category: 'Etiquetas',
  },
  {
    template: (loc) => `Impresoras de tickets y etiquetas para comercios en ${loc.name}`,
    keywords: (loc) => `impresora tickets ${loc.name}, impresora etiquetas local comercial ${loc.region}, impresora góndola ${loc.name}, impresora precios comercio ${loc.name}`,
    category: 'Impresoras',
  },
  {
    template: (loc) => `Colectores de datos para logística en ${loc.name} y zona ${loc.region}`,
    keywords: (loc) => `colectores datos ${loc.name}, terminal portátil Zebra ${loc.region}, WMS depósito ${loc.name}, colector datos logística ${loc.name} Argentina`,
    category: 'Colectores',
  },
];

// ============================================================
// Rutas (idénticas al script original)
// ============================================================
const blogDataPath = path.join(__dirname, '../../blog/blog-data.json');
const blogDir      = path.join(__dirname, '../../blog');
const sitemapPath  = path.join(__dirname, '../../sitemap.xml');

// ============================================================
// Leer blog-data.json
// ============================================================
function loadArticles() {
  if (!fs.existsSync(blogDataPath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    return Array.isArray(raw) ? raw : (raw.articles || []);
  } catch (e) {
    console.log('⚠️  blog-data.json inválido, empezando de cero');
    return [];
  }
}

// ============================================================
// Elegir localidad — evitar repetir las recientes
// ============================================================
function chooseLoc(articles) {
  if (FORCE_LOC) {
    const found = GEO_LOCATIONS.find(l => l.name.toLowerCase() === FORCE_LOC.toLowerCase());
    if (found) return found;
    console.log(`⚠️  Localidad "${FORCE_LOC}" no encontrada, eligiendo aleatoriamente`);
  }
  // Localidades ya usadas en los últimos 200 posts
  const usedLocs = new Set(
    articles.slice(0, 200)
      .filter(a => a.geo_loc)
      .map(a => a.geo_loc)
  );
  const available = GEO_LOCATIONS.filter(l => !usedLocs.has(l.name));
  const pool = available.length > 0 ? available : GEO_LOCATIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================
// Elegir template — evitar repetir para la misma región reciente
// ============================================================
function chooseTemplate(loc, articles) {
  const usedTemplates = new Set(
    articles.slice(0, 50)
      .filter(a => a.geo_region === loc.region)
      .map(a => a.geo_template_idx)
  );
  const available = GEO_TEMPLATES
    .map((t, i) => ({ t, i }))
    .filter(({ i }) => !usedTemplates.has(i));
  const pool = available.length > 0 ? available : GEO_TEMPLATES.map((t, i) => ({ t, i }));
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return { template: picked.t, idx: picked.i };
}

// ============================================================
// Slug limpio
// ============================================================
function makeSlug(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 70)
    .replace(/-+$/, '');
}

// ============================================================
// Generar HTML del post individual (mismo estilo que el original)
// ============================================================
function generatePostHTML(article) {
  const catColors = {
    'Ribbons': '#3b82f6', 'Impresoras': '#7c3aed', 'Servicio Técnico': '#059669',
    'Etiquetas': '#d97706', 'Software': '#0891b2', 'Normativas': '#dc2626',
    'Lectores': '#0f766e', 'Colectores': '#9333ea',
  };
  const catColor   = catColors[article.category] || '#3b82f6';
  const titleShort = article.title.length > 55 ? article.title.slice(0, 55) + '…' : article.title;

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
        .geo-badge{display:inline-flex;align-items:center;gap:.375rem;padding:.25rem .875rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:2rem;font-size:.75rem;color:rgba(255,255,255,.8);margin-bottom:.75rem}
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
            <span class="geo-badge">📍 ${article.geo_loc}${article.geo_region ? ', ' + article.geo_region : ''}</span>
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
                    <p style="font-weight:700;font-size:1rem;margin-bottom:.5rem;">¿Necesitás insumos o equipos en ${article.geo_loc}?</p>
                    <p style="color:var(--text-secondary);margin-bottom:1.25rem;font-size:.9375rem;">Hacemos envíos a todo el país y atendemos empresas en CABA y GBA. Consultanos sin cargo.</p>
                    <a href="https://wa.me/541122656818?text=Hola!%20Le%C3%AD%20el%20artículo%20y%20tengo%20una%20consulta%20para%20${encodeURIComponent(article.geo_loc)}." target="_blank" style="display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;background:var(--accent);color:white;border-radius:.75rem;font-weight:700;text-decoration:none;font-size:.875rem;">Consultar por WhatsApp →</a>
                </div>
            </article>
            <aside class="post-sidebar">
                <div class="sidebar-card">
                    <div class="sidebar-card-title">Label Tech Argentina</div>
                    <p style="font-size:.875rem;color:var(--text-secondary);line-height:1.6;margin-bottom:.5rem;">Distribuidor oficial Zebra y Honeywell. Enviamos a <strong>${article.geo_loc}</strong> y todo el país.</p>
                    <p style="font-size:.8rem;color:var(--text-secondary);margin-bottom:1rem;">Perdriel 1485 3°C · Barracas · CABA</p>
                    <a href="https://wa.me/541122656818" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1rem;background:var(--accent);color:white;border-radius:.75rem;font-weight:700;text-decoration:none;font-size:.875rem;">Consultá gratis →</a>
                </div>
                <div class="sidebar-card">
                    <div class="sidebar-card-title">Productos relacionados</div>
                    <div style="display:flex;flex-direction:column;gap:.625rem;">
                        <a href="../productos/ribbons.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Ribbons transferencia térmica</a>
                        <a href="../productos/impresoras-zebra.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Impresoras Zebra</a>
                        <a href="../productos/impresoras-honeywell.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Impresoras Honeywell</a>
                        <a href="../productos/lectores-codigo-barras.html" style="font-size:.875rem;color:var(--accent);text-decoration:none;font-weight:500;">→ Lectores de Código de Barras</a>
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
// Actualizar sitemap
// ============================================================
function updateSitemap(slug, dateISO) {
  if (!fs.existsSync(sitemapPath)) return;
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const url = `https://www.labeltech.com.ar/blog/${slug}.html`;
  if (sitemap.includes(url)) return;
  const newUrl = `  <url><loc>${url}</loc><lastmod>${dateISO}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
  sitemap = sitemap.replace('</urlset>', newUrl + '</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`   🗺️  Sitemap actualizado: ${slug}.html`);
}

// ============================================================
// Llamada a Gemini y guardado — devuelve Promise
// ============================================================
function generateOne(postNum, totalPosts) {
  return new Promise((resolve, reject) => {
    const articles = loadArticles();
    const loc      = chooseLoc(articles);
    const { template, idx } = chooseTemplate(loc, articles);

    const topic    = template.template(loc);
    const keywords = template.keywords(loc);
    const category = template.category;

    console.log(`\n[${ postNum}/${totalPosts}] 📍 ${loc.name} (${loc.region}) — ${category}`);
    console.log(`   📝 "${topic}"`);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      reject(new Error('GEMINI_API_KEY no definida. Exportala antes: export GEMINI_API_KEY=tu_clave'));
      return;
    }

    const SYSTEM_PROMPT = `Sos un experto en SEO y marketing local para Label Tech Argentina.

INSTRUCCIONES TÉCNICAS DE SALIDA:
1. Respondé ÚNICAMENTE con un objeto JSON válido.
2. NO incluyas saltos de línea literales dentro de los valores de texto.
3. Para separar párrafos en "body" usá etiquetas HTML (<p>, <h2>, <ul>, <li>).
4. Escapá todas las comillas dobles internas como \\".

Estructura exacta:
{
  "title": "string — título SEO del artículo con localidad",
  "excerpt": "string — descripción de 150 caracteres para meta description, debe mencionar ${loc.name}",
  "readTime": "string — ej: '5 min'",
  "body": "string — contenido HTML completo del artículo, mínimo 900 palabras"
}`;

    const userPrompt =
      `Escribí un artículo de +900 palabras en español argentino sobre: "${topic}".\n` +
      `Keywords a incluir naturalmente: ${keywords}.\n` +
      `El artículo está orientado a empresas y profesionales de ${loc.name}, ${loc.region}, Argentina.\n` +
      `Mencioná que Label Tech Argentina (labeltech.com.ar, WhatsApp +54 11 2265-6818, ` +
      `Perdriel 1485 3°C, Barracas, CABA) hace envíos a ${loc.name} y todo el país.\n` +
      `Incluí al menos una referencia a cómo llegar / zonas de entrega cercanas a ${loc.name}.\n` +
      `El body debe ser HTML limpio con <h2>, <p>, <ul>/<li>. Sin <html>, <body> ni <head>.`;

    const payload = JSON.stringify({
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) throw new Error(response.error.message);

          let rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) throw new Error('Respuesta vacía de Gemini');

          rawText = rawText.replace(/```json|```/g, '').trim();

          let article;
          try {
            article = JSON.parse(rawText.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
          } catch (e) {
            article = JSON.parse(rawText);
          }

          // Metadata
          const today = new Date();
          article.category         = category;
          article.topic_key        = topic.slice(0, 30);
          article.date             = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
          article.dateISO          = today.toISOString().split('T')[0];
          article.slug             = makeSlug(topic);
          article.readTime         = typeof article.readTime === 'number'
            ? article.readTime + ' min'
            : (article.readTime || '5 min');
          article.geo_loc          = loc.name;
          article.geo_region       = loc.region;
          article.geo_type         = loc.type;
          article.geo_template_idx = idx;

          // Guardar en blog-data.json
          const freshArticles = loadArticles();
          freshArticles.unshift(article);
          fs.writeFileSync(blogDataPath, JSON.stringify(freshArticles, null, 2), 'utf8');
          console.log(`   ✅ blog-data.json → ${freshArticles.length} posts`);

          // Generar HTML individual
          const htmlContent = generatePostHTML(article);
          const htmlPath    = path.join(blogDir, `${article.slug}.html`);
          fs.writeFileSync(htmlPath, htmlContent, 'utf8');
          console.log(`   ✅ HTML → blog/${article.slug}.html`);

          // Sitemap
          updateSitemap(article.slug, article.dateISO);

          console.log(`   🎉 "${article.title}"`);
          resolve(article.slug);

        } catch (e) {
          console.error(`   ❌ Error procesando respuesta: ${e.message}`);
          console.log('   --- RAW PREVIEW ---');
          console.log(data.slice(0, 600));
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

// ============================================================
// Sleep helper
// ============================================================
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ============================================================
// MAIN — corre batch secuencial
// ============================================================
async function main() {
  console.log(`\n🚀 generate-geo-post.js — LabelTech Argentina`);
  console.log(`   Posts a generar: ${BATCH}`);
  console.log(`   Localidades disponibles: ${GEO_LOCATIONS.length}`);
  console.log(`   Delay entre posts: ${DELAY_MS / 1000}s\n`);

  const results = { ok: [], fail: [] };

  for (let i = 1; i <= BATCH; i++) {
    try {
      const slug = await generateOne(i, BATCH);
      results.ok.push(slug);
    } catch (e) {
      console.error(`   ❌ Post ${i} falló: ${e.message}`);
      results.fail.push(i);
    }

    // Delay entre posts (excepto el último)
    if (i < BATCH) {
      console.log(`   ⏳ Esperando ${DELAY_MS / 1000}s antes del próximo...`);
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅ Posts generados: ${results.ok.length}/${BATCH}`);
  if (results.fail.length > 0) {
    console.log(`❌ Fallidos: posts #${results.fail.join(', #')}`);
  }
  console.log(`─────────────────────────────────────────\n`);
}

main().catch(e => {
  console.error('Error fatal:', e.message);
  process.exit(1);
});
