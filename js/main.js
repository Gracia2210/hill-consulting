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
