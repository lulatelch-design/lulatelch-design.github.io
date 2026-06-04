const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $('#menuToggle');
const menu = $('#menu');
menuToggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

$$('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('gmb-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
if (savedTheme === 'dark') themeToggle.textContent = '☀️';

themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('gmb-theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// Resaltar enlace activo durante el desplazamiento
const sections = $$('section[id], header[id]');
const navLinks = $$('.nav-menu a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(section => observer.observe(section));

// Contadores
const counters = $$('[data-count]');
let counted = false;
const counterObserver = new IntersectionObserver(entries => {
  if (counted) return;
  if (entries.some(entry => entry.isIntersecting)) {
    counted = true;
    counters.forEach(counter => {
      const target = Number(counter.dataset.count);
      const duration = 900;
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        counter.textContent = Math.round(target * progress).toLocaleString('es-PE');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
});
const stats = $('.stats');
if (stats) counterObserver.observe(stats);

// Pestañas de propuesta educativa
$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    $$('.tab').forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', String(t === tab));
    });
    $$('.tab-panel').forEach(panel => {
      const active = panel.id === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  });
});

// Filtro de proyectos
$$('.filter').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    $$('.filter').forEach(btn => btn.classList.toggle('active', btn === button));
    $$('.project-card').forEach(card => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !visible);
    });
  });
});

// Modal del mensaje
$$('[data-open-modal]').forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.openModal);
    modal?.showModal();
  });
});
$$('[data-close-modal]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
});

// Galería
const imageModal = $('#imageModal');
const modalImage = $('#modalImage');
$$('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    modalImage.src = item.dataset.img;
    const alt = item.querySelector('img')?.alt || 'Imagen de la galería';
    modalImage.alt = alt;
    imageModal.showModal();
  });
});

// Testimonios
const testimonials = [
  { text: '“Ser barrosino es aprender con respeto, esfuerzo y compromiso”.', author: 'Estudiante' },
  { text: '“La familia y la escuela unidas fortalecen los aprendizajes y los valores”.', author: 'Madre de familia' },
  { text: '“Educamos con vocación, innovación y responsabilidad social”.', author: 'Docente' }
];
let testimonialIndex = 0;
function renderTestimonial() {
  $('#testimonialText').textContent = testimonials[testimonialIndex].text;
  $('#testimonialAuthor').textContent = testimonials[testimonialIndex].author;
}
$('#prevTestimonial')?.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
  renderTestimonial();
});
$('#nextTestimonial')?.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  renderTestimonial();
});
setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  renderTestimonial();
}, 7000);

// Formulario de contacto demostrativo
const form = $('#contactForm');
const status = $('#formStatus');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#nombre').value.trim();
  const email = $('#correo').value.trim();
  const message = $('#mensajeForm').value.trim();
  if (!name || !email || !message) {
    status.textContent = 'Por favor, complete todos los campos.';
    status.className = 'form-status error';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = 'Ingrese un correo válido.';
    status.className = 'form-status error';
    return;
  }
  status.textContent = 'Consulta registrada en esta demostración. Para envío real, conecte el formulario a un correo o servicio web.';
  status.className = 'form-status success';
  form.reset();
});

// Botón volver arriba
const toTop = $('#toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Año del pie de página
$('#year').textContent = new Date().getFullYear();
