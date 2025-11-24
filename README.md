# Yalın Yorulmaz - Portfolio Website

Personal portfolio website showcasing my work as a PMP-certified Project Manager and Full Stack Developer.

**Live Site:** [https://ylnyorulmaz.github.io](https://ylnyorulmaz.github.io)

## Features

- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop
- **Dark/Light Theme**: Toggle between dark and light modes with persistent user preference
- **SEO Optimized**: Comprehensive meta tags, Open Graph, Twitter Cards, and Schema.org structured data
- **Accessibility**: WCAG compliant with ARIA labels, keyboard navigation, and reduced-motion support
- **Performance**: Lazy loading images, debounced scroll handlers, and optimized resource hints
- **Security**: Content Security Policy headers, SRI integrity checks, and honeypot spam protection
- **Modern JavaScript**: ES6+ features with fallbacks for older browsers
- **Smooth Animations**: Intersection Observer for scroll-triggered animations
- **Contact Form**: Integrated with Formspree for easy communication

## Technologies

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Font Awesome**: Icon library
- **Google Fonts**: Poppins font family
- **Formspree**: Contact form backend

## Project Structure

```
ylnyorulmaz.github.io/
├── index.html              # Main portfolio page
├── 404.html                # Custom 404 error page
├── style.css               # Stylesheet
├── script.js               # JavaScript functionality
├── favicon.svg             # Site favicon
├── yalinyorulmaz.jpeg      # Profile photo
├── Yalin_Yorulmaz_CV.pdf   # Downloadable CV
├── images/
│   └── preview.svg         # Open Graph preview image
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site map
└── README.md               # This file
```

## Local Development

This is a static website that requires no build process or dependencies.

1. Clone the repository:
   ```bash
   git clone https://github.com/ylnyorulmaz/ylnyorulmaz.github.io.git
   cd ylnyorulmaz.github.io
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js http-server
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000` in your browser

## Deployment

The site is automatically deployed via GitHub Pages when changes are pushed to the main branch.

## Performance Optimizations

- Resource hints (preconnect, dns-prefetch) for faster CDN loading
- Lazy loading for images
- Debounced scroll event handlers
- Passive event listeners
- Optimized animations with `will-change` properties
- Reduced-motion support for accessibility

## SEO Features

- Semantic HTML5 structure
- Meta descriptions and keywords
- Open Graph tags for social sharing
- Twitter Card support
- Schema.org structured data
- XML sitemap
- robots.txt configuration
- Canonical URLs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact

- **Email**: [yorulmaz@sabanciuniv.edu](mailto:yorulmaz@sabanciuniv.edu)
- **LinkedIn**: [yalin-yorulmaz](https://www.linkedin.com/in/yalin-yorulmaz)
- **GitHub**: [ylnyorulmaz](https://github.com/ylnyorulmaz)
- **Upwork**: [Profile](https://www.upwork.com/freelancers/~01489bcf3e7d90570b)

## License

© 2025 Yalın Yorulmaz. All rights reserved.