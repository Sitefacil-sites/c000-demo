async function loadSite() {
  const config = await fetch('data/config.json').then(r => r.json());

  document.body.classList.add(config.visual);
  document.getElementById('business-name').innerText = config.businessName;
  document.getElementById('headline').innerText = config.headline;

  const waLink = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.defaultMessage)}`;

  document.getElementById('btn-whatsapp').href = waLink;
  document.getElementById('whatsapp-float').href = waLink;
  document.getElementById('btn-phone').href = `tel:${config.phone}`;
  document.getElementById('btn-map').href = config.mapLink;

  if (config.model === "catalogo") {
    loadCatalog();
  }
}

async function loadCatalog() {
  const products = await fetch('data/produtos.json').then(r => r.json());
  const content = document.getElementById('content');

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const price = p.preco
      ? `R$ ${p.preco}`
      : `<span class="price consulta">Sob consulta</span>`;

    card.innerHTML = `
      <h3>${p.nome}</h3>
      <p>${p.descricao || ''}</p>
      <div class="price">${price}</div>
      <a href="https://wa.me/?text=${encodeURIComponent('Tenho interesse no ' + p.nome)}" target="_blank">
        Falar no WhatsApp
      </a>
    `;

    content.appendChild(card);
  });
}

loadSite();
