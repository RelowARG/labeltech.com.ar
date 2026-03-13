/* ============================================================
   components.js — Web Components universales de Label Tech
   <site-navbar active="industrias|productos|servicios|blog|nosotros">
   <site-footer></site-footer>
   ============================================================ */

// ── Helpers ──────────────────────────────────────────────────
function getBase() {
  // Detecta el prefijo de ruta según dónde vive la página:
  // /industrias/ o /productos/ → "../"   |   raíz → ""
  const path = window.location.pathname;
  if (path.match(/\/(industrias|productos|blog)\//)) return '../';
  return '';
}

// ── SVG icons ────────────────────────────────────────────────
const WA_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const IG_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;

const LI_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

// ── <site-navbar> ─────────────────────────────────────────────
class SiteNavbar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || '';
    const p = getBase();

    const industries = [
      ['transporte-logistica.html',   'Transporte y Logística'],
      ['industria-textil.html',       'Industria Textil'],
      ['cuidado-personal-higiene.html','Cuidado Personal'],
      ['industria-quimica.html',      'Industria Química'],
      ['industria-alimenticia.html',  'Industria Alimenticia'],
      ['industria-automotriz.html',   'Industria Automotriz'],
      ['industria-farmaceutica.html', 'Industria Farmacéutica'],
      ['industria-general.html',      'Industria General'],
    ];

    // Pillar pages live at root (use p, not pp)
    const pillarProductos = [
      ['impresoras-de-etiquetas.html', 'Impresoras de Etiquetas'],
      ['etiquetas-adhesivas.html',     'Etiquetas Adhesivas'],
      ['ribbon-transferencia-termica.html', 'Ribbon Transferencia Térmica'],
    ];



    const servicios = [
      ['servicio-impresion.html',      'Servicio de Impresión'],
      ['servicio-tecnico.html',        'Servicio Técnico'],
      ['software.html',                'Software'],
      ['calculadora-etiquetas.html',   'Calculadora de Etiquetas'],
    ];

    const dropdown = (items, prefix) =>
      items.map(([f, l]) => `<li><a href="${p}${prefix}${f}">${l}</a></li>`).join('\n');

    const ac = (key) => active === key ? ' active' : '';

    // Grupos para el mega-menú de Productos
    const grupoImpresoras = [
      ['impresoras-zebra.html',       'Impresoras Zebra'],
      ['impresoras-honeywell.html',   'Impresoras Honeywell'],
      ['impresoras-tsc.html',         'Impresoras TSC'],
    ];
    const grupoLectores = [
      ['lectores-codigo-barras.html', 'Lectores de Código de Barras'],
      ['etiquetadoras-manuales.html', 'Etiquetadoras Manuales'],
      ['pistolas-aplicadoras.html',   'Pistolas Aplicadoras'],
    ];
    const grupoEtiquetas = [
      ['etiquetas-termicas.html',     'Etiquetas Térmicas'],
      ['etiquetas-opp.html',          'Etiquetas OPP'],
      ['etiquetas-ilustracion.html',  'Etiquetas Ilustración'],
      ['etiquetas-void.html',         'Etiquetas VOID'],
      ['poliamida-textil.html',       'Poliamida Textil'],
    ];
    const grupoInsumos = [
      ['ribbons.html',                'Ribbons'],
      ['ribbon-por-modelo.html',      'Ribbon por Modelo'],
      ['hilos-plasticos.html',        'Hilos Plásticos'],
      ['rollos-entintadores.html',    'Rollos y Entintadores'],
    ];
    const grupoAccesorios = [
      ['rebobinadores.html',          'Rebobinadores'],
      ['medidas-y-colores.html',      'Medidas y Colores'],
    ];

    const megaGroup = (title, items, prefix) => `
      <div class="mega-group">
        <p class="mega-group-title">${title}</p>
        ${items.map(([f, l]) => `<a href="${p}${prefix}${f}" class="mega-product-link">${l}</a>`).join('\n')}
      </div>`;

    this.innerHTML = `
      <nav class="navbar" id="navbar" role="navigation" aria-label="Navegación principal">
        <div class="container">
          <div class="nav-wrapper">
            <a href="${p}index.html" class="logo">
              <img src="${p}public/images/logolabel_transparent.png" alt="Label Tech" class="logo-img">
            </a>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
              <li><a href="${p}index.html" class="nav-link">Inicio</a></li>
              <li class="nav-dropdown">
                <a href="${p}index.html#industrias" class="nav-link${ac('industrias')}">Industrias ▾</a>
                <ul class="dropdown-menu">
                  ${dropdown(industries, 'industrias/')}
                </ul>
              </li>
              <li class="nav-dropdown nav-dropdown--mega">
                <a href="${p}index.html#productos" class="nav-link${ac('productos')}">Productos ▾</a>
                <div class="mega-menu">
                  <div class="mega-pillars">
                    <p class="mega-pillars-label">Guías principales</p>
                    ${pillarProductos.map(([f, l]) => `<a href="${p}${f}" class="mega-pillar-card">${l}</a>`).join('\n')}
                    <a href="${p}index.html#productos" class="mega-ver-todos">Ver todos los productos →</a>
                  </div>
                  <div class="mega-products">
                    ${megaGroup('Impresoras', grupoImpresoras, 'productos/')}
                    ${megaGroup('Lectores y aplicadores', grupoLectores, 'productos/')}
                    ${megaGroup('Etiquetas', grupoEtiquetas, 'productos/')}
                    ${megaGroup('Insumos', grupoInsumos, 'productos/')}
                    ${megaGroup('Accesorios', grupoAccesorios, 'productos/')}
                  </div>
                </div>
              </li>
              <li class="nav-dropdown">
                <a href="${p}index.html#servicios" class="nav-link${ac('servicios')}">Servicios ▾</a>
                <ul class="dropdown-menu">
                  ${dropdown(servicios, 'productos/')}
                </ul>
              </li>
              <li><a href="${p}blog/index.html" class="nav-link${ac('blog')}">Blog</a></li>
              <li class="nav-dropdown">
                <a href="${p}nosotros.html" class="nav-link${ac('nosotros')}">Nosotros ▾</a>
                <ul class="dropdown-menu">
                  <li><a href="${p}nosotros.html">Nosotros</a></li>
                  <li><a href="${p}sustentabilidad.html">Sustentabilidad</a></li>
                </ul>
              </li>
              <li><a href="${p}index.html#contacto" class="nav-link">Contacto</a></li>
            </ul>
            <div class="nav-social">
              <a href="tel:+541122656818" class="nav-phone-badge" aria-label="Llamar">
                <span class="nav-phone-dot"></span>
                11 2265-6818
              </a>
              <a href="https://wa.me/541122656818" target="_blank" class="social-link" aria-label="WhatsApp">${WA_SVG}</a>
              <a href="https://www.instagram.com/labeltech.ar/" target="_blank" class="social-link" aria-label="Instagram">${IG_SVG}</a>
              <a href="https://www.linkedin.com/company/labeltech-ar/" target="_blank" class="social-link" aria-label="LinkedIn">${LI_SVG}</a>
            </div>
          </div>
        </div>
      </nav>`;

    // Re-init mobile menu toggle (script.js lo busca por ID al cargar,
    // pero como este elemento se inserta después, lo inicializamos acá)
    this._initMobileMenu();

    // Navbar scroll effect
    this._initScroll();
  }

  _initMobileMenu() {
    const toggle = this.querySelector('#mobileMenuToggle');
    const menu   = this.querySelector('#navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    // Cerrar al hacer click en un link
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  _initScroll() {
    const nav = this.querySelector('.navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

// ── <site-footer> ─────────────────────────────────────────────
class SiteFooter extends HTMLElement {
  connectedCallback() {
    const p = getBase();
    const ip = `${p}industrias/`;
    const pp = `${p}productos/`;

    this.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <div class="footer-logo">
                <img src="${p}public/images/logolabelvertical_white.png" alt="Label Tech" class="footer-logo-img">
              </div>
              <p class="footer-description">Más de 10 años brindando soluciones de etiquetado de calidad para todas las industrias.</p>
            </div>
            <div class="footer-column">
              <h4 class="footer-title">Industrias</h4>
              <ul class="footer-list">
                <li><a href="${ip}transporte-logistica.html">Transporte y Logística</a></li>
                <li><a href="${ip}industria-textil.html">Textil</a></li>
                <li><a href="${ip}cuidado-personal-higiene.html">Cuidado Personal</a></li>
                <li><a href="${ip}industria-quimica.html">Química</a></li>
                <li><a href="${ip}industria-alimenticia.html">Alimenticia</a></li>
                <li><a href="${ip}industria-farmaceutica.html">Farmacéutica</a></li>
                <li><a href="${ip}industria-automotriz.html">Automotriz</a></li>
                <li><a href="${ip}industria-general.html">General</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h4 class="footer-title">Productos y Servicios</h4>
              <ul class="footer-list">
                <li><a href="${p}impresoras-de-etiquetas.html">Impresoras de Etiquetas</a></li>
                <li><a href="${pp}impresoras-zebra.html">Impresoras Zebra</a></li>
                <li><a href="${pp}impresoras-honeywell.html">Impresoras Honeywell</a></li>
                <li><a href="${pp}impresoras-tsc.html">Impresoras TSC</a></li>
                <li><a href="${p}etiquetas-adhesivas.html">Etiquetas Adhesivas</a></li>
                <li><a href="${pp}etiquetas-termicas.html">Etiquetas Térmicas</a></li>
                <li><a href="${pp}etiquetas-opp.html">Etiquetas OPP</a></li>
                <li><a href="${pp}etiquetas-ilustracion.html">Etiquetas Ilustración</a></li>
                <li><a href="${pp}etiquetas-void.html">Etiquetas VOID</a></li>
                <li><a href="${pp}poliamida-textil.html">Poliamida Textil</a></li>
                <li><a href="${p}ribbon-transferencia-termica.html">Ribbon Transferencia Térmica</a></li>
                <li><a href="${pp}ribbons.html">Ribbons</a></li>
                <li><a href="${pp}ribbon-por-modelo.html">Ribbon por Modelo</a></li>
                <li><a href="${pp}lectores-codigo-barras.html">Lectores de Código</a></li>
                <li><a href="${pp}rebobinadores.html">Rebobinadores</a></li>
                <li><a href="${pp}etiquetadoras-manuales.html">Etiquetadoras Manuales</a></li>
                <li><a href="${pp}hilos-plasticos.html">Hilos Plásticos</a></li>
                <li><a href="${pp}servicio-tecnico.html">Servicio Técnico</a></li>
                <li><a href="${pp}calculadora-etiquetas.html">Calculadora de Etiquetas</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h4 class="footer-title">Empresa</h4>
              <ul class="footer-list">
                <li><a href="${p}index.html">Inicio</a></li>
                <li><a href="${p}nosotros.html">Nosotros</a></li>
                <li><a href="${p}sustentabilidad.html">Sustentabilidad</a></li>
                <li><a href="${p}faq.html">FAQ</a></li>
                <li><a href="${p}blog/index.html">Blog</a></li>
                <li><a href="${p}privacidad.html">Privacidad</a></li>
              </ul>
              <h4 class="footer-title" style="margin-top:1.5rem">Contacto</h4>
              <ul class="footer-list">
                <li><a href="https://wa.me/541122656818">+54 11 2265-6818</a></li>
                <li><a href="mailto:ventas@labeltech.com.ar">ventas@labeltech.com.ar</a></li>
                <li style="color:var(--text-muted,#9ca3af);font-size:0.85rem;line-height:1.4;margin-top:0.5rem;">
                  Perdriel 1485 3°C<br>Barracas, CABA
                </li>
                <li style="color:var(--text-muted,#9ca3af);font-size:0.85rem;margin-top:0.25rem;">
                  Cobertura en todo el país
                </li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
              <p class="footer-copyright" style="margin:0;">© 2025 Label Tech. Todos los derechos reservados.</p>
              <div class="footer-badges" style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;">
                <span class="footer-badge"><svg width="16" height="12" viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:2px"><rect width="16" height="4" fill="#74ACDF"/><rect y="4" width="16" height="4" fill="#FFFFFF"/><rect y="8" width="16" height="4" fill="#74ACDF"/></svg>Hecho en Argentina</span>
                <span class="footer-badge">+10 años de experiencia</span>
                <a href="${p}productos/impresoras-zebra.html" style="text-decoration:none;display:inline-flex;align-items:center;transition:opacity .2s;margin-left:.25rem;" onmouseover="this.style.opacity='.75'" onmouseout="this.style.opacity='1'">
                  <img src="${p}public/images/black_and_white_reverse.png" alt="Zebra Registered Reseller" style="height:48px;width:auto;display:block;">
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>`;
  }
}

// ── Registro ──────────────────────────────────────────────────
customElements.define('site-navbar', SiteNavbar);
customElements.define('site-footer', SiteFooter);