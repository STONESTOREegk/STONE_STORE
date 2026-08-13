/* STONE STORE — Minimal JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu after clicking
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
        }
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      nav.classList.toggle('active');
      this.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      const isClickInsideNav = nav.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);
      if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }

  // Animation on scroll (fade-in)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe elements for fade-in
  const fadeElements = document.querySelectorAll('.about-grid, .features, .reviews-content, .brands-grid, .brands-footer, .steps, .contact-grid, .hero-content');
  fadeElements.forEach(el => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    }
  });
});

// Close menu on resize if screen gets larger
window.addEventListener('resize', function() {
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');
  if (window.innerWidth > 600) {
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
  }
});