const btn = document.getElementById('menuBtn');
const nav = document.getElementById('navLinks');
btn.addEventListener('click', () => {
  nav.classList.toggle('open');
  btn.textContent = nav.classList.contains('open') ? '×' : '☰';
});
document.querySelectorAll('#navLinks a').forEach((a) => a.addEventListener('click', () => {
  nav.classList.remove('open');
  btn.textContent = '☰';
}));

const servicesGrid = document.querySelector('.services-grid');
const serviceCards = servicesGrid ? [...servicesGrid.querySelectorAll('.catalog-card')] : [];

function arrangeServiceCards() {
  if (!servicesGrid) return;
  if (window.innerWidth <= 700) {
    serviceCards.forEach((card) => { card.style.gridRowEnd = 'auto'; });
    return;
  }

  const styles = getComputedStyle(servicesGrid);
  const rowHeight = parseFloat(styles.gridAutoRows);
  const rowGap = parseFloat(styles.rowGap);
  serviceCards.forEach((card) => {
    card.style.gridRowEnd = 'auto';
    const cardHeight = card.getBoundingClientRect().height;
    const span = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap));
    card.style.gridRowEnd = `span ${span}`;
  });
}

window.addEventListener('load', arrangeServiceCards);
window.addEventListener('resize', arrangeServiceCards);

// Mantiene visible en la navegación la sección que está recorriendo el usuario.
const mainNavLinks = [...document.querySelectorAll('#navLinks > li > a')];
const observedSections = [...document.querySelectorAll('main > section[id]')];

function setActiveNav(sectionId) {
  mainNavLinks.forEach((link) => {
    const isCurrent = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('is-active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

if ('IntersectionObserver' in window && observedSections.length) {
  const visibleSections = new Map();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
      else visibleSections.delete(entry.target.id);
    });

    const current = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0];
    if (current) setActiveNav(current[0]);
  }, { rootMargin: '-22% 0px -55% 0px', threshold: [0, .15, .35, .6] });

  observedSections.forEach((section) => sectionObserver.observe(section));
} else {
  setActiveNav('inicio');
}

mainNavLinks.forEach((link) => link.addEventListener('click', () => {
  const target = link.getAttribute('href');
  if (target && target.startsWith('#')) setActiveNav(target.slice(1));
}));
