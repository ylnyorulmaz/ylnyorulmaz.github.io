function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function toggleMenu() {
  document.querySelector('.navbar').classList.toggle('open');
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

// change navbar style on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
