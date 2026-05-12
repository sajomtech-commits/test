function formatPrice(price, transaction) {
  const formatted = price.toLocaleString('fr-FR');
  return transaction === 'location' ? `${formatted} €/mois` : `${formatted} €`;
}

function createCard(property) {
  const details = [];
  if (property.surface) details.push(`${property.surface} m²`);
  if (property.rooms) details.push(`${property.rooms} pièces`);
  if (property.bedrooms != null && property.bedrooms > 0) details.push(`${property.bedrooms} ch.`);

  return `
    <div class="card">
      <div class="card-img">${property.emoji}</div>
      <div class="card-body">
        <div class="card-type">${property.type}</div>
        <div class="card-title">${property.title}</div>
        <div class="card-location">📍 ${property.location}</div>
        <div class="card-price">${formatPrice(property.price, property.transaction)}</div>
        <div class="card-details">${details.join(' · ')}</div>
        <span class="badge ${property.transaction === 'location' ? 'location' : ''}">
          ${property.transaction === 'location' ? 'À louer' : 'À vendre'}
        </span>
      </div>
    </div>
  `;
}

const featuredContainer = document.getElementById('featuredListings');
if (featuredContainer) {
  const featured = properties.filter(p => p.featured);
  featuredContainer.innerHTML = featured.map(createCard).join('');
}

const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('typeSelect').value;
    const transaction = document.getElementById('transactionSelect').value;
    const params = new URLSearchParams({ q: query, type, transaction });
    window.location.href = `pages/annonces.html?${params}`;
  });
}

const listingsPage = document.getElementById('listingsPage');
if (listingsPage) {
  const params = new URLSearchParams(window.location.search);
  const filterType = document.getElementById('filterType');
  const filterTransaction = document.getElementById('filterTransaction');
  const filterMaxPrice = document.getElementById('filterMaxPrice');
  const filterSearch = document.getElementById('filterSearch');

  if (params.get('type')) filterType.value = params.get('type');
  if (params.get('transaction')) filterTransaction.value = params.get('transaction');
  if (params.get('q')) filterSearch.value = params.get('q');

  function applyFilters() {
    const type = filterType.value;
    const transaction = filterTransaction.value;
    const maxPrice = parseInt(filterMaxPrice.value) || Infinity;
    const search = filterSearch.value.toLowerCase();

    const results = properties.filter(p => {
      return (
        (!type || p.type === type) &&
        (!transaction || p.transaction === transaction) &&
        p.price <= maxPrice &&
        (!search || p.location.toLowerCase().includes(search) || p.title.toLowerCase().includes(search))
      );
    });

    document.getElementById('resultsCount').textContent = `${results.length} bien(s) trouvé(s)`;
    listingsPage.innerHTML = results.length
      ? results.map(createCard).join('')
      : '<p style="color:#666">Aucun bien ne correspond à votre recherche.</p>';
  }

  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  applyFilters();
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('successMsg').style.display = 'block';
    contactForm.reset();
    setTimeout(() => {
      document.getElementById('successMsg').style.display = 'none';
    }, 4000);
  });
}