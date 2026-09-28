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

const servicesPrev = document.getElementById('servicesPrev');
const servicesNext = document.getElementById('servicesNext');
const serviceDots = document.getElementById('serviceDots');
let activeServiceIndex = 0;
let serviceAutoplay;

serviceCards.forEach((card, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'service-dot';
  dot.setAttribute('aria-label', `Ver servicio ${index + 1}`);
  dot.addEventListener('click', () => goToService(index));
  serviceDots?.appendChild(dot);
});

function setCurrentService(index) {
  activeServiceIndex = Math.max(0, Math.min(index, serviceCards.length - 1));
  serviceCards.forEach((card, cardIndex) => card.classList.toggle('is-current', cardIndex === activeServiceIndex));
  serviceDots?.querySelectorAll('.service-dot').forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === activeServiceIndex);
    dot.setAttribute('aria-current', dotIndex === activeServiceIndex ? 'true' : 'false');
  });
}

function goToService(index) {
  if (!servicesGrid || !serviceCards.length) return;
  const normalizedIndex = (index + serviceCards.length) % serviceCards.length;
  servicesGrid.scrollTo({ left: serviceCards[normalizedIndex].offsetLeft - serviceCards[0].offsetLeft, behavior: 'smooth' });
  setCurrentService(normalizedIndex);
}

function updateServiceArrows() {
  if (!servicesGrid || !servicesPrev || !servicesNext) return;
  servicesPrev.disabled = false;
  servicesNext.disabled = false;
}

function scrollServices(direction) {
  goToService(activeServiceIndex + direction);
}

servicesPrev?.addEventListener('click', () => scrollServices(-1));
servicesNext?.addEventListener('click', () => scrollServices(1));
servicesGrid?.addEventListener('scroll', () => {
  updateServiceArrows();
  const gridLeft = servicesGrid.getBoundingClientRect().left;
  const closest = serviceCards.reduce((best, card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().left - gridLeft);
    return distance < best.distance ? { index, distance } : best;
  }, { index: 0, distance: Infinity });
  setCurrentService(closest.index);
}, { passive: true });

function startServiceAutoplay() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  clearInterval(serviceAutoplay);
  serviceAutoplay = setInterval(() => goToService(activeServiceIndex + 1), 4500);
}

function stopServiceAutoplay() { clearInterval(serviceAutoplay); }

servicesGrid?.addEventListener('mouseenter', stopServiceAutoplay);
servicesGrid?.addEventListener('mouseleave', startServiceAutoplay);
servicesGrid?.addEventListener('pointerdown', stopServiceAutoplay);
servicesGrid?.addEventListener('pointerup', startServiceAutoplay);
servicesGrid?.addEventListener('focusin', stopServiceAutoplay);
servicesGrid?.addEventListener('focusout', startServiceAutoplay);
window.addEventListener('load', () => { setCurrentService(0); updateServiceArrows(); startServiceAutoplay(); });
window.addEventListener('resize', updateServiceArrows);

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
