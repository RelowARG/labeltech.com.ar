#!/usr/bin/env node
/* ============================================================
   add-breadcrumbs.js
   Inyecta BreadcrumbList LD+JSON en páginas de /productos/ e /industrias/
   Uso: node .github/scripts/add-breadcrumbs.js
   ============================================================ */

const fs   = require('fs');
const path = require('path');

const BASE_URL = 'https://labeltech.com.ar';

// Nombres legibles por archivo — se usan como "name" en el breadcrumb
const NOMBRES = {
  // productos/
  'impresoras-zebra.html':        'Impresoras Zebra',
  'impresoras-honeywell.html':    'Impresoras Honeywell',
  'impresoras-tsc.html':          'Impresoras TSC',
  'etiquetas-termicas.html':      'Etiquetas Térmicas',
  'etiquetas-opp.html':           'Etiquetas OPP',
  'etiquetas-ilustracion.html':   'Etiquetas Ilustración',
  'etiquetas-void.html':          'Etiquetas VOID',
  'poliamida-textil.html':        'Poliamida Textil',
  'ribbons.html':                 'Ribbons',
  'ribbon-por-modelo.html':       'Ribbon por Modelo',
  'lectores-codigo-barras.html':  'Lectores de Código de Barras',
  'etiquetadoras-manuales.html':  'Etiquetadoras Manuales',
  'pistolas-aplicadoras.html':    'Pistolas Aplicadoras',
  'hilos-plasticos.html':         'Hilos Plásticos',
  'rollos-entintadores.html':     'Rollos y Entintadores',
  'rebobinadores.html':           'Rebobinadores',
  'medidas-y-colores.html':       'Medidas y Colores',
  'servicio-tecnico.html':        'Servicio Técnico',
  'servicio-impresion.html':      'Servicio de Impresión',
  'software.html':                'Software',
  'calculadora-etiquetas.html':   'Calculadora de Etiquetas',
  // industrias/
  'transporte-logistica.html':    'Transporte y Logística',
  'industria-textil.html':        'Industria Textil',
  'cuidado-personal-higiene.html':'Cuidado Personal e Higiene',
  'industria-quimica.html':       'Industria Química',
  'industria-alimenticia.html':   'Industria Alimenticia',
  'industria-automotriz.html':    'Industria Automotriz',
  'industria-farmaceutica.html':  'Industria Farmacéutica',
  'industria-general.html':       'Industria General',
};

function buildBreadcrumb(section, filename) {
  const nombre = NOMBRES[filename];
  if (!nombre) {
    console.warn(`  ⚠ Sin nombre para: ${filename} — saltando`);
    return null;
  }

  const isProducto  = section === 'productos';
  const isIndustria = section === 'industrias';

  const items = [
    {
      '@type':  'ListItem',
      position: 1,
      name:     'Inicio',
      item:     `${BASE_URL}/`,
    },
  ];

  if (isProducto) {
    items.push({
      '@type':  'ListItem',
      position: 2,
      name:     'Productos',
      item:     `${BASE_URL}/#productos`,
    });
  } else if (isIndustria) {
    items.push({
      '@type':  'ListItem',
      position: 2,
      name:     'Industrias',
      item:     `${BASE_URL}/#industrias`,
    });
  }

  items.push({
    '@type':  'ListItem',
    position: 3,
    name:     nombre,
    item:     `${BASE_URL}/${section}/${filename}`,
  });

  return {
    '@context':       'https://schema.org',
    '@type':          'BreadcrumbList',
    itemListElement:  items,
  };
}

function processFile(filePath, section, filename) {
  let html = fs.readFileSync(filePath, 'utf8');

  const breadcrumb = buildBreadcrumb(section, filename);
  if (!breadcrumb) return false;

  const jsonBlock = `<script type="application/ld+json">\n${JSON.stringify(breadcrumb, null, 2)}\n</script>`;

  // Si ya existe un BreadcrumbList, reemplazarlo
  const breadcrumbRe = /<script type="application\/ld\+json">[\s\S]*?"@type"\s*:\s*"BreadcrumbList"[\s\S]*?<\/script>/;
  if (breadcrumbRe.test(html)) {
    html = html.replace(breadcrumbRe, jsonBlock);
    console.log(`  ↺ Reemplazado breadcrumb existente`);
  } else {
    // Insertar antes de </head>
    if (!html.includes('</head>')) {
      console.warn(`  ⚠ No se encontró </head> en ${filename}`);
      return false;
    }
    html = html.replace('</head>', `${jsonBlock}\n</head>`);
    console.log(`  ✓ Breadcrumb inyectado`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function processDir(dirName) {
  const repoRoot = path.resolve(__dirname, '../../');
  const dirPath  = path.join(repoRoot, dirName);

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directorio no encontrado: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
  console.log(`\n📁 /${dirName}/ — ${files.length} archivos`);

  let ok = 0;
  for (const filename of files) {
    console.log(`  → ${filename}`);
    const filePath = path.join(dirPath, filename);
    if (processFile(filePath, dirName, filename)) ok++;
  }
  console.log(`  ${ok}/${files.length} procesados correctamente`);
}

// ── Main ──────────────────────────────────────────────────────
console.log('🔖 add-breadcrumbs.js — Label Tech\n');
processDir('productos');
processDir('industrias');
console.log('\n✅ Listo. Revisá 2-3 archivos antes de commitear.');
