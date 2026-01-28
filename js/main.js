/**
 * Srivartin Corporation - Main JavaScript
 * Handles navigation, animations, and interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ============ MOBILE NAVIGATION ============
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
    
    // Close nav when clicking on a link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
    
    // Close nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }
  
  // ============ HEADER SCROLL EFFECT ============
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // ============ SMOOTH SCROLLING ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // ============ SCROLL ANIMATIONS ============
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  document.querySelectorAll('.card, .product-card, .service-card, .feature-item, .value-card, .testimonial-card, .process-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Add visible animation
  const style = document.createElement('style');
  style.textContent = `
    .animate-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
  
  // ============ FAQ ACCORDION ============
  const details = document.querySelectorAll('details');
  
  details.forEach(detail => {
    detail.addEventListener('toggle', function() {
      // Close other details when one opens
      if (this.open) {
        details.forEach(d => {
          if (d !== this && d.open) {
            d.open = false;
          }
        });
      }
      
      // Update the plus/minus icon
      const summary = this.querySelector('summary span');
      if (summary) {
        summary.textContent = this.open ? '−' : '+';
      }
    });
  });
  
  // ============ FORM HANDLING ============
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // For demo purposes, show a success message
      // In production, this would be handled by form submission to backend
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"></circle>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;
      
      // Add spinning animation
      const spinStyle = document.createElement('style');
      spinStyle.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `;
      document.head.appendChild(spinStyle);
    });
  }
  
  // ============ PRODUCT CATEGORY NAVIGATION ============
  const productNavButtons = document.querySelectorAll('a[href^="#"][class*="btn"]');
  
  productNavButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      productNavButtons.forEach(b => b.classList.remove('btn-primary'));
      productNavButtons.forEach(b => b.classList.add('btn-secondary'));
      
      // Add active class to clicked button
      this.classList.remove('btn-secondary');
      this.classList.add('btn-primary');
    });
  });
  
  // ============ COUNTER ANIMATION ============
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    updateCounter();
  }
  
  // Animate counters when visible
  const counterElements = document.querySelectorAll('.hero-stat-number');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const text = entry.target.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          
          entry.target.textContent = '0' + suffix;
          
          let current = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          
          function update() {
            current += increment;
            if (current < target) {
              entry.target.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(update);
            } else {
              entry.target.textContent = target + suffix;
            }
          }
          
          update();
        }
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counterElements.forEach(el => counterObserver.observe(el));
  
  // ============ CERTIFICATION CAROUSEL PAUSE ON HOVER ============
  const certTrack = document.querySelector('.certifications-track');
  
  if (certTrack) {
    certTrack.addEventListener('mouseenter', function() {
      this.style.animationPlayState = 'paused';
    });
    
    certTrack.addEventListener('mouseleave', function() {
      this.style.animationPlayState = 'running';
    });
  }
  
  // ============ LAZY LOADING IMAGES ============
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const lazyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          lazyObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => lazyObserver.observe(img));
  }
  
  // ============ BACK TO TOP BUTTON ============
  // Create back to top button
  const backToTop = document.createElement('button');
  backToTop.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);
  
  // Add styles for back to top button
  const backToTopStyle = document.createElement('style');
  backToTopStyle.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 999;
      box-shadow: 0 4px 12px rgba(125, 78, 55, 0.3);
    }
    
    .back-to-top:hover {
      background: var(--color-primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(125, 78, 55, 0.4);
    }
    
    .back-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    @media (max-width: 768px) {
      .back-to-top {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
      }
    }
  `;
  document.head.appendChild(backToTopStyle);
  
  // Show/hide back to top button
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // ============ WHATSAPP FLOATING BUTTON ============
  const whatsappBtn = document.createElement('a');
  whatsappBtn.href = 'https://wa.me/918318143326';
  whatsappBtn.target = '_blank';
  whatsappBtn.className = 'whatsapp-float';
  whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  whatsappBtn.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  `;
  document.body.appendChild(whatsappBtn);
  
  // Add WhatsApp button styles
  const whatsappStyle = document.createElement('style');
  whatsappStyle.textContent = `
    .whatsapp-float {
      position: fixed;
      bottom: 90px;
      right: 30px;
      width: 55px;
      height: 55px;
      background: #25D366;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 998;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
      transition: all 0.3s ease;
    }
    
    .whatsapp-float:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5);
      color: white;
    }
    
    @media (max-width: 768px) {
      .whatsapp-float {
        bottom: 75px;
        right: 20px;
        width: 50px;
        height: 50px;
      }
    }
  `;
  document.head.appendChild(whatsappStyle);
  
  // ============ PRINT CURRENT YEAR IN FOOTER ============
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
  
  // ============ HANDLE EXTERNAL LINKS ============
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  console.log('Srivartin Corporation website loaded successfully.');
  
});
