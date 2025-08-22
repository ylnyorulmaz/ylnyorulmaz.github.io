document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      const honey = form.querySelector('input[name="_honey"]').value;
      if (honey) {
        e.preventDefault();
      }
    });
  }
});

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', mode);
}

function toggleMenu() {
  document.querySelector('.navbar').classList.toggle('open');
}

function revealEmail() {
  const email = document.getElementById('email');
  const btn = document.getElementById('reveal-email');
  if (email && btn) {
    email.style.display = 'block';
    btn.style.display = 'none';
  }
}

// highlight navigation based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar ul li a');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.navbar a[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach(section => observer.observe(section));

const backToTopBtn = document.querySelector('.back-to-top');

// change navbar style on scroll and toggle back-to-top visibility
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
