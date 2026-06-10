/* ============================================================
   NetMania Tecnologia e Serviços — script.js
   ============================================================ */

// ===== Preloader =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hide');
  }, 700);
});

// ===== Header scroll + voltar ao topo =====
const header = document.getElementById('header');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  backTop.classList.toggle('show', y > 600);
  highlightNav();
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Menu mobile =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    nav.classList.remove('open');
  });
});

// ===== Link ativo conforme a seção visível =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
  const pos = window.scrollY + 140;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id));
    }
  });
}

// ===== Animações de entrada (scroll reveal) =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

// ===== Contadores animados =====
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ===== Partículas do hero =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createParticles() {
  const count = Math.min(70, Math.floor(canvas.width / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + .6,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    o: Math.random() * .5 + .15
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(92, 193, 240, ${p.o})`;
    ctx.fill();
  });

  // linhas entre partículas próximas
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(54, 169, 225, ${(1 - dist / 130) * .18})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();
window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

// ===== Velocímetro do hero: alterna entre os planos =====
const ringValue = document.getElementById('ringValue');
const speeds = [200, 400, 700];
let speedIdx = 2;

setInterval(() => {
  speedIdx = (speedIdx + 1) % speeds.length;
  ringValue.style.opacity = 0;
  setTimeout(() => {
    ringValue.textContent = speeds[speedIdx];
    ringValue.style.opacity = 1;
  }, 280);
}, 3200);
ringValue.style.transition = 'opacity .28s ease';

// ===== Slider de depoimentos =====
const track = document.getElementById('testiTrack');
const cards = track.children.length;
const dotsWrap = document.getElementById('testiDots');
let current = 0;
let autoplay;

for (let i = 0; i < cards; i++) {
  const dot = document.createElement('button');
  dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
}

function goTo(idx) {
  current = (idx + cards) % cards;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  restartAutoplay();
}

document.getElementById('testiPrev').addEventListener('click', () => goTo(current - 1));
document.getElementById('testiNext').addEventListener('click', () => goTo(current + 1));

function restartAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(() => goTo(current + 1), 6000);
}
restartAutoplay();

// swipe no celular
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) goTo(diff < 0 ? current + 1 : current - 1);
}, { passive: true });

// ===== Balão do WhatsApp =====
const waBalloon = document.getElementById('waBalloon');
const waBalloonClose = document.getElementById('waBalloonClose');
let balloonDismissed = false;

setTimeout(() => {
  if (!balloonDismissed) waBalloon.classList.add('show');
}, 3500);

waBalloonClose.addEventListener('click', () => {
  balloonDismissed = true;
  waBalloon.classList.remove('show');
});

// reaparece de tempos em tempos se não foi fechado
setInterval(() => {
  if (!balloonDismissed && !waBalloon.classList.contains('show')) {
    waBalloon.classList.add('show');
  }
}, 25000);

// ===== Ano do rodapé =====
document.getElementById('year').textContent = new Date().getFullYear();
