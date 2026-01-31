function waLink(phone, text){
  const base = `https://wa.me/${phone}`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

async function loadJSON(path){
  const res = await fetch(path, { cache: "no-store" });
  if(!res.ok) throw new Error(`Falha ao carregar ${path}`);
  return res.json();
}

function setText(id, value){
  const el = document.getElementById(id);
  if(el && value !== undefined && value !== null) el.textContent = value;
}

function show(id, visible){
  const el = document.getElementById(id);
  if(el) el.hidden = !visible;
}

function formatPrice(p){
  // p já vem como string ("3.500"). Mantém simples.
  return `R$ ${p}`;
}

async function init(){
  const config = await loadJSON("data/config.json");

  // Visual
  document.body.classList.remove("clean","impacto");
  document.body.classList.add(config.visual || "clean");

  // Textos
  setText("business-name", config.businessName);
  setText("headline", config.headline);
  setText("badge", config.badge || "Site Fácil");
  setText("footer-text", config.footerText || "© Site Fácil");

  // Catálogo header
  if(config.catalog){
    setText("catalog-title", config.catalog.title);
    setText("catalog-desc", config.catalog.desc);
  }

  // Links globais
  const msgDefault = config.defaultMessage || "Olá! Quero mais informações.";
  const waDefault = waLink(config.whatsapp, msgDefault);

  const btnWA = document.getElementById("btn-whatsapp");
  const fab = document.getElementById("whatsapp-fab");
  const btnPhone = document.getElementById("btn-phone");
  const btnMap = document.getElementById("btn-map");

  if(btnWA) btnWA.href = waDefault;
  if(fab) fab.href = waDefault;
  if(btnPhone) btnPhone.href = `tel:${config.phone || config.whatsapp}`;
  if(btnMap) btnMap.href = config.mapLink || "https://www.google.com/maps";

  // Meta abaixo dos botões
  const meta = document.getElementById("hero-meta");
  if(meta){
    meta.textContent = "Resposta rápida • Página leve • Foco em WhatsApp";
  }

  // Mostrar seções pelo modelo
  const model = (config.model || "catalogo").toLowerCase();
  show("section-catalogo", model === "catalogo");
  show("section-servico", model === "servico");
  show("section-local", model === "local");

  // Local info (se usar modelo local)
  if(model === "local" && config.local){
    const box = document.getElementById("local-info");
    if(box){
      box.innerHTML = `
        <div><strong>Endereço:</strong> ${config.local.address || ""}</div>
        <div><strong>Horário:</strong> ${config.local.hours || ""}</div>
        <div><strong>Obs:</strong> ${config.local.note || ""}</div>
      `;
    }
  }

  // Render catálogo
  if(model === "catalogo"){
    const products = await loadJSON("data/produtos.json");
    renderCatalog(products, config);
  }
}

function renderCatalog(products, config){
  const grid = document.getElementById("products");
  if(!grid) return;

  grid.innerHTML = "";

  products.forEach(p => {
    const nome = p.nome || "Item";
    const desc = p.descricao || "";
    const status = p.status || "";
    const preco = (p.preco || "").trim();

    const priceHtml = preco
      ? `<p class="price">${formatPrice(preco)}</p>`
      : `<p class="price price--consulta">Sob consulta</p>`;

    const text = `Olá! Tenho interesse no ${nome}${desc ? " ("+desc+")" : ""}.`;
    const link = waLink(config.whatsapp, text);

    const card = document.createElement("div");
    card.className = "card";
    card.style.gridColumn = "span 12";

    // responsivo via CSS: já definido pra 6/4 em telas maiores
    card.innerHTML = `
      <div class="product__top">
        <div>
          <h3 class="product__name">${nome}</h3>
          ${desc ? `<p class="product__desc">${desc}</p>` : `<div style="height:10px"></div>`}
        </div>
        ${status ? `<span class="tag">${status}</span>` : ``}
      </div>

      ${priceHtml}

      <div class="row">
        <a class="btnSmall btnSmall--wa" href="${link}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btnSmall" href="tel:${config.phone || config.whatsapp}">Ligar</a>
        <a class="btnSmall" href="${config.mapLink || "https://www.google.com/maps"}" target="_blank" rel="noopener">Mapa</a>
      </div>
    `;

    grid.appendChild(card);
  });
}

init().catch(err => {
  console.error(err);
  const el = document.getElementById("headline");
  if(el) el.textContent = "Erro ao carregar dados. Confira a pasta /data e os caminhos.";
});
