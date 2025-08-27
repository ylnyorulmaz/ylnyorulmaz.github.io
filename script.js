document.addEventListener('DOMContentLoaded', () => {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const setThemeMeta = mode => {
    if (themeMeta) {
      themeMeta.setAttribute('content', mode === 'dark' ? '#0a192f' : '#f5f5f5');
    }
  };

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    setThemeMeta('dark');
  } else {
    setThemeMeta('light');
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

  const mobileNavLinks = document.querySelectorAll('.navbar a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navbar = document.querySelector('.navbar');
      const toggleBtn = document.querySelector('.menu-toggle');
      if (navbar && navbar.classList.contains('open')) {
        navbar.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  document.addEventListener('click', e => {
    const navbar = document.querySelector('.navbar');
    const toggleBtn = document.querySelector('.menu-toggle');
    if (
      navbar &&
      toggleBtn &&
      navbar.classList.contains('open') &&
      !navbar.contains(e.target)
    ) {
      navbar.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', mode);
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', mode === 'dark' ? '#0a192f' : '#f5f5f5');
  }
}

function toggleMenu() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.menu-toggle');
  if (navbar) {
    navbar.classList.toggle('open');
  }
  if (toggleBtn) {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
  }
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
const navLinks = document.querySelectorAll('.navbar ul li a[href^="#"]');

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
        entry.target.classList.add('visible');
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
