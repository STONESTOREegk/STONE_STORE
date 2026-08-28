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
          document.body.style.overflow = '';
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
      // Lock/unlock body scroll to prevent background scrolling
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      const isClickInsideNav = nav.contains(e.target);
      const isClickOnToggle = menuToggle.contains(e.target);
      if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
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

  // Trust Info Popover — reusable component
  (function() {
    var triggers = document.querySelectorAll('[data-trust-trigger]');
    var popover = document.querySelector('[data-trust-popover]');
    var backdrop = document.querySelector('[data-trust-backdrop]');

    if (!popover || !backdrop) return;

    var activeTrigger = null;
    var resizeHandler = null;

    function isMobile() {
      return window.innerWidth <= 600;
    }

    function positionPopover() {
      if (!activeTrigger || isMobile()) return;

      var rect = activeTrigger.getBoundingClientRect();
      var popoverWidth = 320;
      var popoverHeight = popover.offsetHeight;

      var top = rect.bottom + 12;
      var left = rect.left + (rect.width / 2) - (popoverWidth / 2);

      var vw = window.innerWidth;
      var vh = window.innerHeight;

      // Keep within viewport horizontally
      var minX = 16;
      var maxX = vw - popoverWidth - 16;
      if (left < minX) left = minX;
      if (left > maxX) left = maxX;

      // If popover would overflow bottom, open above trigger
      if (top + popoverHeight > vh - 16) {
        top = rect.top - popoverHeight - 12;
      }
      if (top < 16) top = 16;

      popover.style.top = Math.round(top) + 'px';
      popover.style.left = Math.round(left) + 'px';
    }

    function open(button) {
      // Close mobile nav if open
      var nav = document.getElementById('nav');
      var menuToggle = document.getElementById('menuToggle');
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
      }

      activeTrigger = button;
      popover.classList.add('active');
      popover.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('active');

      if (isMobile()) {
        document.body.style.overflow = 'hidden';
        popover.style.top = '';
        popover.style.left = '';
      } else {
        positionPopover();
      }

      document.addEventListener('keydown', onKeydown);
      document.addEventListener('click', onOutsideClick);

      // Reposition on resize
      if (!resizeHandler) {
        resizeHandler = function() {
          if (popover.classList.contains('active')) {
            if (isMobile()) {
              document.body.style.overflow = 'hidden';
              popover.style.top = '';
              popover.style.left = '';
            } else {
              if (!nav || !nav.classList.contains('active')) {
                document.body.style.overflow = '';
              }
              positionPopover();
            }
          }
        };
        window.addEventListener('resize', resizeHandler);
      }
    }

    function close() {
      popover.classList.remove('active');
      popover.setAttribute('aria-hidden', 'true');
      if (activeTrigger) {
        activeTrigger.setAttribute('aria-expanded', 'false');
      }
      backdrop.classList.remove('active');

      // Only unlock body scroll if mobile menu isn't also open
      var nav = document.getElementById('nav');
      if (!nav || !nav.classList.contains('active')) {
        document.body.style.overflow = '';
      }

      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onOutsideClick);

      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
      }

      if (activeTrigger) {
        activeTrigger.focus();
      }
      activeTrigger = null;
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        close();
      }
    }

    function onOutsideClick(e) {
      if (!popover.contains(e.target) && !backdrop.contains(e.target) && e.target !== activeTrigger) {
        close();
      }
    }

    triggers.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (popover.classList.contains('active')) {
          close();
        } else {
          open(this);
        }
      });
    });

    var closeBtn = popover.querySelector('.trust-info-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }
  })();
});

// Close menu on resize if screen gets larger
window.addEventListener('resize', function() {
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');
  if (window.innerWidth > 600) {
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
});