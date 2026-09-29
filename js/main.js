const btn = document.getElementById('menuBtn');
const nav = document.getElementById('navLinks');
const servicesDropdown = document.querySelector('.nav-dropdown');
const servicesToggle = document.querySelector('.nav-dropdown-toggle');
btn.addEventListener('click', () => {
  nav.classList.toggle('open');
  btn.textContent = nav.classList.contains('open') ? '×' : '☰';
  btn.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  if (!nav.classList.contains('open')) {
    servicesDropdown?.classList.remove('submenu-open');
    servicesToggle?.setAttribute('aria-expanded', 'false');
  }
});
document.querySelectorAll('#navLinks a').forEach((a) => a.addEventListener('click', () => {
  if (a === servicesToggle && window.matchMedia('(max-width: 980px)').matches) return;
  nav.classList.remove('open');
  btn.textContent = '☰';
  btn.setAttribute('aria-expanded', 'false');
  servicesDropdown?.classList.remove('submenu-open');
  servicesToggle?.setAttribute('aria-expanded', 'false');
}));

servicesToggle?.setAttribute('aria-expanded', 'false');
servicesToggle?.addEventListener('click', (event) => {
  if (!window.matchMedia('(max-width: 980px)').matches) return;
  event.preventDefault();
  const isOpen = servicesDropdown.classList.toggle('submenu-open');
  servicesToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

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
setCurrentService(0);
updateServiceArrows();
startServiceAutoplay();
window.addEventListener('load', updateServiceArrows);
window.addEventListener('resize', updateServiceArrows);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopServiceAutoplay();
  else startServiceAutoplay();
});

const consultantCards = [...document.querySelectorAll('.consultants-list .consultant-profile')];
const consultantHighlights = [
  ['Gesti\u00f3n integrada', 'Auditor\u00edas', '+25 a\u00f1os de experiencia'],
  ['Auditor\u00edas', 'Sistemas de Gesti\u00f3n', '+12 a\u00f1os de experiencia'],
  ['Operaciones mineras', 'Seguridad y Medio Ambiente'],
  ['Auditorías MTPE', 'Sistemas Integrados de Gestión']
];
const consultantBios = [
  'Auditor Mintra acreditado. Auditor Interno en Sistemas de Gestión de Seguridad y Salud Ocupacional, OHSAS 18001, y Auditor Interno en Sistemas de Gestión Ambiental, ISO 14001. Auditor ISTEC y entrenador certificado en el ISEM. Cuenta con formación en Programas STOP de Dupont y amplio conocimiento de los Sistemas de Gestión de Seguridad DNV, NOSA, ISTEC, SIGER PERÚ y DUPONT. Tiene especialización en evaluación y corrección de impactos ambientales en minería, capacitación en EMSHA Beckley, West Virginia-USA, y formación en la Universidad Politécnica de Madrid. También cuenta con formación en rescate en minería subterránea y estudios de especialización en la Universidad Nacional Agraria La Molina sobre implementación y auditoría de Sistemas Integrados de Gestión ISO 9001, ISO 14001, OHSAS 18001, ISO 26000 e ISO 31000. Profesional proactivo, responsable, ético, creativo y orientado a la mejora continua.',
  'Profesional con más de 12 años de experiencia implementando y manteniendo diversos Sistemas de Gestión. Especialista en auditorías internas y externas de calidad, seguridad, salud, medio ambiente y antisoborno. Además, cuenta con autorización del Ministerio de Trabajo para realizar auditorías a los Sistemas de Gestión de Seguridad y Salud en el Trabajo — Auditorías Mintra.',
  'Ingeniero de Minas con experiencia en operaciones mineras, planificación minera a corto plazo y gestión de Seguridad, Salud y Medio Ambiente. Domina programas informáticos aplicados al sector minero. Profesional dinámico, proactivo, con facilidad de palabra y liderazgo, orientado a la mejora continua, el trabajo en equipo, la solución de problemas y el cumplimiento de las metas organizacionales.',
  'Auditor acreditado por el MTPE para auditorías de Seguridad y Salud en el Trabajo. R.D. N.° 040-2024-MTPE/1/20.3. Auditor de Sistemas de Gestión bajo las normas ISO 9001:2015, ISO 14001:2026, ISO 45001:2018 e ISO 39001:2013. Profesional con sólida experiencia en Seguridad y Salud en el Trabajo, Sistemas Integrados de Gestión y SSOMA, orientado a fortalecer el cumplimiento normativo, generar valor y contribuir a la mejora continua de las organizaciones.'
];
const profileModal = document.createElement('div');
profileModal.className = 'profile-modal';
profileModal.hidden = true;
profileModal.innerHTML = '<div class="profile-modal-backdrop" data-modal-close></div><div class="profile-modal-dialog" role="dialog" aria-modal="true" aria-label="Perfil completo del consultor"><button class="profile-modal-close" type="button" data-modal-close aria-label="Cerrar perfil">&times;</button><div id="profileModalContent"></div></div>';
document.body.appendChild(profileModal);
const profileModalContent = profileModal.querySelector('#profileModalContent');

function closeProfileModal() {
  profileModal.hidden = true;
  document.body.classList.remove('modal-open');
  profileModalContent.replaceChildren();
}

function openConsultantProfile(card, index) {
  const clone = card.cloneNode(true);
  clone.querySelector('.profile-open')?.remove();
  clone.querySelector('.consultant-details')?.remove();
  const details = document.createElement('div');
  details.className = 'consultant-details consultant-details-single';
  details.innerHTML = `<div class="consultant-bio"><h3>Perfil profesional</h3><p>${consultantBios[index] || ''}</p></div>`;
  clone.appendChild(details);
  profileModalContent.replaceChildren(clone);
  profileModal.hidden = false;
  document.body.classList.add('modal-open');
  profileModal.querySelector('.profile-modal-close').focus();
}

consultantCards.forEach((card, index) => {
  const title = card.querySelector('.consultant-title');
  if (!title) return;
  const highlights = title.querySelector('.consultant-highlights');
  const linkedin = card.querySelector('.linkedin-link');
  if (linkedin && highlights) title.insertBefore(linkedin, highlights);
  const button = title.querySelector('.profile-open');
  button?.addEventListener('click', () => openConsultantProfile(card, index));
});

const consultantCarousel = document.querySelector('.consultants-list');
const consultantPrevious = document.querySelector('.consultant-carousel-prev');
const consultantNext = document.querySelector('.consultant-carousel-next');

function updateConsultantArrows() {
  if (!consultantCarousel || !consultantPrevious || !consultantNext) return;
  const maxScroll = consultantCarousel.scrollWidth - consultantCarousel.clientWidth;
  const canScroll = maxScroll > 4;
  consultantPrevious.disabled = !canScroll;
  consultantNext.disabled = !canScroll;
}

function moveConsultants(direction) {
  if (!consultantCarousel || !consultantCards.length) return;
  const gap = parseFloat(getComputedStyle(consultantCarousel).gap) || 0;
  const distance = consultantCards[0].getBoundingClientRect().width + gap;
  const maxScroll = consultantCarousel.scrollWidth - consultantCarousel.clientWidth;
  if (maxScroll <= 4) return;
  const atStart = consultantCarousel.scrollLeft <= 4;
  const atEnd = consultantCarousel.scrollLeft >= maxScroll - 4;
  if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
    consultantCarousel.scrollTo({ left: direction > 0 ? 0 : maxScroll, behavior: 'smooth' });
    return;
  }
  consultantCarousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
}

consultantPrevious?.addEventListener('click', () => moveConsultants(-1));
consultantNext?.addEventListener('click', () => moveConsultants(1));
consultantCarousel?.addEventListener('scroll', updateConsultantArrows, { passive: true });
let consultantAutoplay;
function stopConsultantAutoplay() { clearInterval(consultantAutoplay); }
function startConsultantAutoplay() {
  stopConsultantAutoplay();
  if (!consultantCarousel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  consultantAutoplay = setInterval(() => moveConsultants(1), 5000);
}
consultantCarousel?.addEventListener('mouseenter', stopConsultantAutoplay);
consultantCarousel?.addEventListener('mouseleave', startConsultantAutoplay);
consultantCarousel?.addEventListener('pointerdown', stopConsultantAutoplay);
consultantCarousel?.addEventListener('pointerup', startConsultantAutoplay);
window.addEventListener('resize', updateConsultantArrows);
window.addEventListener('load', updateConsultantArrows);
updateConsultantArrows();
startConsultantAutoplay();

profileModal.addEventListener('click', (event) => {
  if (event.target.matches('[data-modal-close]')) closeProfileModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !profileModal.hidden) closeProfileModal();
});

document.querySelectorAll('#socios .partner-category').forEach((category) => {
  const grid = category.querySelector('.partners');
  const cards = grid ? [...grid.querySelectorAll('.partner')] : [];
  if (!grid || cards.length < 1) return;
  const createArrow = (direction, icon, label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `service-arrow partner-carousel-arrow partner-carousel-arrow-${direction}`;
    button.setAttribute('aria-label', label);
    button.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${icon}</span>`;
    category.appendChild(button);
    return button;
  };
  const previous = createArrow('prev', 'chevron_left', 'Ver socios anteriores');
  const next = createArrow('next', 'chevron_right', 'Ver más socios');
  let index = 0;
  let timer;
  const canScroll = () => grid.scrollWidth > grid.clientWidth + 4;
  const updateControls = () => {
    const enabled = canScroll();
    previous.disabled = !enabled;
    next.disabled = !enabled;
  };
  const move = (direction) => {
    index = (index + direction + cards.length) % cards.length;
    grid.scrollTo({ left: cards[index].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
  };
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (canScroll() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => move(1), 4800);
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  category.addEventListener('mouseenter', stop);
  category.addEventListener('mouseleave', start);
  grid.addEventListener('pointerdown', stop);
  grid.addEventListener('pointerup', start);
  grid.addEventListener('touchend', start, { passive: true });
  window.addEventListener('resize', () => { updateControls(); start(); });
  updateControls();
  start();
});

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
