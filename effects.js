/* ============================================
   劇団FAX — エフェクトましまし JS
   ============================================ */

(function () {
  'use strict';

  // ── Intersection Observer: scroll animations ──
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          // Don't unobserve so re-entry works if needed
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function initScrollAnimations() {
    document.querySelectorAll('[data-animate], [data-stagger], .fancy-heading').forEach((el) => {
      animObserver.observe(el);
    });
  }

  // ── Parallax on hero images ──
  function initParallax() {
    const els = document.querySelectorAll('.parallax-img');
    if (!els.length) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          els.forEach((el) => {
            const speed = parseFloat(el.dataset.speed || 0.3);
            const rect = el.parentElement.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              el.style.transform = `translateY(${scrollY * speed}px) scale(1.1)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── 3D Tilt cards ──
  function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Animated number counters ──
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            const target = parseInt(el.dataset.count, 10);
            const duration = 1500;
            const start = performance.now();
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              el.textContent = Math.round(eased * target);
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  // ── Smooth header shadow on scroll ──
  function initHeaderShadow() {
    const header = document.querySelector('header.sticky');
    if (!header) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
        header.style.borderColor = 'transparent';
      } else {
        header.style.boxShadow = '';
        header.style.borderColor = '';
      }
    }, { passive: true });
  }

  // ── Magnetic hover on CTA buttons ──
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ── Typewriter effect ──
  function initTypewriter() {
    document.querySelectorAll('[data-typewriter]').forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      el.style.borderRight = '2px solid currentColor';
      let i = 0;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const type = () => {
              if (i < text.length) {
                el.textContent += text[i];
                i++;
                setTimeout(type, 50 + Math.random() * 40);
              } else {
                setTimeout(() => { el.style.borderRight = 'none'; }, 800);
              }
            };
            type();
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    });
  }

  // ── Ripple click effect ──
  function initRipple() {
    document.querySelectorAll('.ripple-btn').forEach((btn) => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = `
          position:absolute; width:${size}px; height:${size}px;
          left:${e.clientX - rect.left - size / 2}px;
          top:${e.clientY - rect.top - size / 2}px;
          background:rgba(255,255,255,0.4); border-radius:50%;
          transform:scale(0); animation:ripple-anim 0.6s ease forwards;
          pointer-events:none;
        `;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
    // Add ripple keyframes
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = '@keyframes ripple-anim{to{transform:scale(1);opacity:0;}}';
      document.head.appendChild(style);
    }
  }

  // ── Mouse trail sparkle on hero (desktop only) ──
  function initSparkleTrail() {
    const hero = document.querySelector('[data-sparkle]');
    if (!hero || window.innerWidth < 768) return;
    hero.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.7) return; // throttle
      const sparkle = document.createElement('div');
      const size = Math.random() * 6 + 3;
      const colors = ['#0ea5e9', '#f97316', '#8b5cf6', '#fbbf24'];
      sparkle.style.cssText = `
        position:fixed; width:${size}px; height:${size}px;
        left:${e.clientX}px; top:${e.clientY}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:50%; pointer-events:none; z-index:9999;
        animation:sparkle-fade 0.8s ease forwards;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    });
    if (!document.getElementById('sparkle-style')) {
      const style = document.createElement('style');
      style.id = 'sparkle-style';
      style.textContent = `@keyframes sparkle-fade {
        0% { opacity:1; transform:scale(1) translateY(0); }
        100% { opacity:0; transform:scale(0) translateY(-30px); }
      }`;
      document.head.appendChild(style);
    }
  }

  // ── Initialize everything ──
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallax();
    initTiltCards();
    initCounters();
    initHeaderShadow();
    initMagneticButtons();
    initTypewriter();
    initRipple();
    initSparkleTrail();
  });
})();
