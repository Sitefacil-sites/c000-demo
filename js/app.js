// ===== CONFIG RÁPIDA (mude aqui por cliente) =====
const CONFIG = {
  whatsapp: "5585999999999", // troque pelo número do cliente (com DDI+DDD)
  whatsappMsg: "Olá! Vim pelo site e quero mais informações.",
  phoneCall: "+5585999999999",
  mapUrl: "https://maps.google.com/?q=Fortaleza%20CE",

  // Produtos demo (depois a gente puxa de JSON/planilha se você quiser)
  products: [
    { name: "iPhone 13", meta: "128GB • Preto", price: 2799, available: true },
    { name: "iPhone 12", meta: "64GB • Branco", price: null, available: true },
    { name: "iPhone 11", meta: "128GB • Preto", price: 1899, available: false },
  ],
};

// ===== Helpers =====
function buildWhatsUrl() {
  const msg = encodeURIComponent(CONFIG.whatsappMsg);
  return `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
}

function moneyBRL(v) {
  // formato simples em pt-BR
  const n = Number(v);
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function setLinks() {
  const wa = buildWhatsUrl();
  const ids = ["btnTopWhats","btnMenuWhats","btnHeroWhats","btnBottomWhats","fabWhats"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = wa;
  });

  const callIds = ["btnHeroCall","btnBottomCall"];
  callIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = `tel:${CONFIG.phoneCall}`;
  });

  const mapIds = ["btnHeroMap","btnBottomMap"];
  mapIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.mapUrl;
  });
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  CONFIG.products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const priceHtml = (p.price === null || p.price === undefined)
      ? `<div class="prod__price prod__price--consulta">Sob consulta</div>`
      : `<div class="prod__price">${moneyBRL(p.price)}</div>`;

    const status = p.available ? "Disponível" : "Indisponível";
    const statusStyle = p.available
      ? "opacity:1;"
      : "opacity:.55;";

    card.innerHTML = `
      <h3 class="prod__name">${p.name}</h3>
      <div class="prod__meta">${p.meta} • <span style="${statusStyle}">${status}</span></div>
      ${priceHtml}
      <div class="row">
        <a class="btn btn--wa" href="${buildWhatsUrl()}&text=${encodeURIComponent(`Olá! Tenho interesse em: ${p.name} (${p.meta}).`)}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn btn--soft" href="#contato">Detalhes</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== Drawer menu =====
function setupDrawer() {
  const btnMenu = document.getElementById("btnMenu");
  const btnClose = document.getElementById("btnClose");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  const open = () => {
    drawer.classList.add("is-open");
    overlay.hidden = false;
    btnMenu?.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    drawer.classList.remove("is-open");
    overlay.hidden = true;
    btnMenu?.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  btnMenu?.addEventListener("click", open);
  btnClose?.addEventListener("click", close);
  overlay?.addEventListener("click", close);

  // fechar ao clicar em link
  drawer.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      close();
      // scroll suave
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Esc fecha
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

// init
setLinks();
renderProducts();
setupDrawer();
