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

document.querySelectorAll('.flip-card').forEach((card) => {
  const toggleCard = () => {
    const isOpen = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', String(isOpen));
  };
  card.addEventListener('click', toggleCard);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCard();
    }
  });
});
