// Utility: Debounce function for performance optimization
const debounce = (func, wait = 10) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const setThemeMeta = mode => {
    if (themeMeta) {
      themeMeta.setAttribute('content', mode === 'dark' ? '#0a192f' : '#f5f5f5');
    }
  };

  // Initialize theme from localStorage
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      setThemeMeta('dark');
    } else {
      setThemeMeta('light');
    }
  } catch (err) {
    console.warn('localStorage not available:', err);
  }

  // Contact Form Honeypot Protection
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      const honey = form.querySelector('input[name="_honey"]')?.value;
      if (honey) {
        e.preventDefault();
        console.warn('Spam detected');
      }
    });
  }

  // Mobile Navigation
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.menu-toggle');
  const mobileNavLinks = document.querySelectorAll('.navbar a');

  // Close mobile menu when clicking nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar?.classList.contains('open')) {
        navbar.classList.remove('open');
        toggleBtn?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', e => {
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

  // Keyboard Accessibility for back-to-top button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();
      }
    });
  }
});

// Theme Toggle Function
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';

  try {
    localStorage.setItem('theme', mode);
  } catch (err) {
    console.warn('Could not save theme preference:', err);
  }

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', mode === 'dark' ? '#0a192f' : '#f5f5f5');
  }
}

// Mobile Menu Toggle Function
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

// Email Reveal Function (spam protection)
function revealEmail() {
  const email = document.getElementById('email');
  const btn = document.getElementById('reveal-email');

  if (email && btn) {
    email.style.display = 'block';
    btn.style.display = 'none';
  }
}

// Scroll to Top Function
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Intersection Observer: Highlight navigation based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar ul li a[href^="#"]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Update active nav link
          navLinks.forEach(link => link.classList.remove('active'));
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.navbar a[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
          // Reveal section with animation
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.6, rootMargin: '0px 0px -100px 0px' }
  );

  sections.forEach(section => observer.observe(section));
} else {
  // Fallback: Make all sections visible if IntersectionObserver is not supported
  sections.forEach(section => section.classList.add('visible'));
}

// Scroll Event Handler: Navbar style and back-to-top button visibility
const handleScroll = debounce(() => {
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.querySelector('.back-to-top');

  // Update navbar style on scroll
  if (navbar) {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Toggle back-to-top button visibility
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });
