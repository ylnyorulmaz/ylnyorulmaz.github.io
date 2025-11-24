// ===========================
// UTILITY FUNCTIONS
// ===========================

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

const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===========================
// CUSTOM CURSOR EFFECT
// ===========================

function initCustomCursor() {
  // Only on desktop devices
  if (window.innerWidth <= 768) return;

  const cursorDot = document.createElement('div');
  const cursorOutline = document.createElement('div');

  cursorDot.className = 'cursor-dot';
  cursorOutline.className = 'cursor-outline';

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Smooth follow effect for outline
  function animateCursorOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.left = outlineX - 20 + 'px';
    cursorOutline.style.top = outlineY - 20 + 'px';

    requestAnimationFrame(animateCursorOutline);
  }
  animateCursorOutline();

  // Interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .job, .badge');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'scale(2)';
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorOutline.style.borderColor = 'var(--color-accent)';
    });

    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'scale(1)';
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorOutline.style.borderColor = 'var(--color-primary)';
    });
  });
}

// ===========================
// 3D CARD TILT EFFECT
// ===========================

function init3DCardTilt() {
  const cards = document.querySelectorAll('.project-card, .job');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-12px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
}

// ===========================
// MAGNETIC BUTTON EFFECT
// ===========================

function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) translateY(-4px) scale(1.05)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

// ===========================
// PARALLAX SCROLL EFFECT
// ===========================

function initParallax() {
  const parallaxElements = document.querySelectorAll('.hero, .profile-photo');

  window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(el => {
      const speed = el.classList.contains('profile-photo') ? 0.3 : 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, 10));
}

// ===========================
// ANIMATED COUNTER
// ===========================

function animateNumbers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.textContent;
        const match = text.match(/\d+/);

        if (match) {
          const number = parseInt(match[0]);
          animateValue(element, 0, number, 2000, text);
          observer.unobserve(element);
        }
      }
    });
  });

  document.querySelectorAll('.job p, .about p').forEach(el => {
    if (el.textContent.match(/\d+/)) {
      observer.observe(el);
    }
  });
}

function animateValue(element, start, end, duration, template) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = template.replace(/\d+/, Math.floor(current));
  }, 16);
}

// ===========================
// THEME MANAGEMENT
// ===========================

const themeMeta = document.querySelector('meta[name="theme-color"]');

function setThemeMeta(mode) {
  if (themeMeta) {
    themeMeta.setAttribute('content', mode === 'dark' ? '#ffffff' : '#0a0e27');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';

  try {
    localStorage.setItem('theme', mode);
  } catch (err) {
    console.warn('Could not save theme preference:', err);
  }

  setThemeMeta(mode);
}

// ===========================
// MOBILE NAVIGATION
// ===========================

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

// ===========================
// EMAIL REVEAL
// ===========================

function revealEmail() {
  const email = document.getElementById('email');
  const btn = document.getElementById('reveal-email');

  if (email && btn) {
    email.style.display = 'block';
    btn.style.display = 'none';
  }
}

// ===========================
// SCROLL TO TOP
// ===========================

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===========================
// INTERSECTION OBSERVER
// ===========================

function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar ul li a[href^="#"]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
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
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback: Make all sections visible
    sections.forEach(section => section.classList.add('visible'));
  }
}

// ===========================
// SCROLL EVENT HANDLERS
// ===========================

const handleScroll = throttle(() => {
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.querySelector('.back-to-top');

  // Update navbar style on scroll
  if (navbar) {
    if (window.scrollY > 50) {
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
}, 100);

// ===========================
// SMOOTH SCROLL FOR ANCHORS
// ===========================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navbar = document.querySelector('.navbar');
        if (navbar && navbar.classList.contains('open')) {
          navbar.classList.remove('open');
        }
      }
    });
  });
}

// ===========================
// TEXT REVEAL ANIMATION
// ===========================

function initTextReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('h2, h3, p').forEach(el => {
    observer.observe(el);
  });
}

// ===========================
// BADGE INTERACTIONS
// ===========================

function initBadgeInteractions() {
  const badges = document.querySelectorAll('.badge');

  badges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });
  });
}

// ===========================
// FORM ENHANCEMENTS
// ===========================

function initFormEnhancements() {
  const form = document.getElementById('contact-form');

  if (form) {
    // Honeypot protection
    form.addEventListener('submit', (e) => {
      const honey = form.querySelector('input[name="_honey"]')?.value;
      if (honey) {
        e.preventDefault();
        console.warn('Spam detected');
        return false;
      }
    });

    // Input animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement?.classList.add('focused');
      });

      input.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement?.classList.remove('focused');
        }
      });
    });
  }
}

// ===========================
// MOBILE MENU CLOSE ON OUTSIDE CLICK
// ===========================

function initMobileMenuClose() {
  document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    const toggleBtn = document.querySelector('.menu-toggle');

    if (
      navbar &&
      toggleBtn &&
      navbar.classList.contains('open') &&
      !navbar.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      navbar.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===========================
// KEYBOARD ACCESSIBILITY
// ===========================

function initKeyboardAccessibility() {
  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();
      }
    });
  }

  // Close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const navbar = document.querySelector('.navbar');
      const toggleBtn = document.querySelector('.menu-toggle');

      if (navbar && navbar.classList.contains('open')) {
        navbar.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });
}

// ===========================
// PERFORMANCE MONITORING
// ===========================

function initPerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) {
            console.warn('Long task detected:', entry.duration);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // PerformanceObserver not fully supported
    }
  }
}

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
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

  // Initialize all features
  initScrollAnimations();
  initSmoothScroll();
  initFormEnhancements();
  initMobileMenuClose();
  initKeyboardAccessibility();
  initBadgeInteractions();

  // Initialize advanced effects only on desktop
  if (window.innerWidth > 768) {
    initCustomCursor();
    init3DCardTilt();
    initMagneticButtons();
    initParallax();
  }

  // Attach scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Performance monitoring in development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    initPerformanceMonitoring();
  }

  // Announce page load to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = 'Page loaded successfully';
  document.body.appendChild(announcement);

  setTimeout(() => {
    announcement.remove();
  }, 1000);
});

// ===========================
// RESIZE HANDLER
// ===========================

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Reinitialize effects on resize
    if (window.innerWidth > 768) {
      if (!document.querySelector('.cursor-dot')) {
        initCustomCursor();
        init3DCardTilt();
        initMagneticButtons();
      }
    } else {
      // Remove cursor elements on mobile
      document.querySelectorAll('.cursor-dot, .cursor-outline').forEach(el => el.remove());
    }
  }, 250);
});

// ===========================
// PAGE VISIBILITY
// ===========================

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when page is visible
    document.body.style.animationPlayState = 'running';
  }
});

// ===========================
// EXPORT FUNCTIONS FOR INLINE USE
// ===========================

window.toggleTheme = toggleTheme;
window.toggleMenu = toggleMenu;
window.revealEmail = revealEmail;
window.scrollToTop = scrollToTop;
