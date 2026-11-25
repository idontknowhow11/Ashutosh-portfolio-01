    // ========== INIT ==========
    lucide.createIcons();
    document.getElementById('year').textContent = new Date().getFullYear();

    // ========== LOADER ==========
    const loader = document.getElementById('loader');
    const loaderLogo = document.getElementById('loaderLogo');
    const loaderProgress = document.getElementById('loaderProgress');

    gsap.to(loaderLogo, { opacity: 1, duration: 0.6, delay: 0.2 });
    gsap.to(loaderProgress, {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        setTimeout(() => {
          loader.classList.add('done');
          // Start reveal animations after loader
          initReveal();
        }, 300);
      }
    });

    // ========== THEME ==========
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      lucide.createIcons();
      try { localStorage.setItem('as_theme', theme); } catch(e) {}
    }

    try {
      const saved = localStorage.getItem('as_theme');
      if (saved === 'light' || saved === 'dark') applyTheme(saved);
    } catch(e) {}

    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });

    // ========== CUSTOM CURSOR ==========
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .magnetic, [data-tilt]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    // ========== MAGNETIC BUTTONS ==========
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });

    // ========== 3D TILT CARDS ==========
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 18;
        const rotateY = (centerX - x) / 18;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });

    // ========== MOBILE MENU ==========
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      if (menuOpen) {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100');
        menuToggle.querySelector('i').setAttribute('data-lucide', 'x');
      } else {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100');
        menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100');
        menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      });
    });

    // ========== SCROLL SPY & BACK TO TOP ==========
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const backTop = document.getElementById('backTop');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      backTop.classList.toggle('visible', scrollY > 400);

      let current = 'home';
      sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 150) current = sec.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    });

    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ========== GSAP REVEALS ==========
    function initReveal() {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.03
        });
      });

      // Progress bars
      gsap.utils.toArray('.progress-bar').forEach(bar => {
        gsap.to(bar, {
          width: bar.dataset.width,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%'
          }
        });
      });

      // Counters
      document.querySelectorAll('.stat-number').forEach(stat => {
        const target = +stat.dataset.count;
        ScrollTrigger.create({
          trigger: stat,
          start: 'top 90%',
          onEnter: () => {
            gsap.to({ val: 0 }, {
              val: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: function() {
                stat.textContent = Math.round(this.targets()[0].val);
              }
            });
          },
          once: true
        });
      });
    }

    // ========== PROJECT MODAL ==========
    const projects = {
      portfolio: {
        title: 'Personal Portfolio Website',
        desc: 'Built from scratch using semantic HTML5, responsive CSS Grid/Flexbox with custom theme variables, and vanilla JavaScript for dark/light mode, skill & project filtering, typing animation, and contact form validation. Fully responsive and accessible.',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive', 'Theme Switch']
      },
      task: {
        title: 'Interactive Study Task Tracker',
        desc: 'Demonstrates DOM manipulation, event delegation, state updates, and persistent browser storage. Students can create tasks, mark them complete, filter by status, and have their data survive page reloads.',
        tags: ['JavaScript', 'DOM API', 'LocalStorage', 'CSS Flexbox']
      },
      landing: {
        title: 'Responsive Product Landing Page',
        desc: 'Focused on mobile-first media queries, accessible typography, and fluid grid layouts that adapt smoothly across mobile, tablet, and desktop viewports. Includes navigation, feature grid, and pricing table.',
        tags: ['HTML5', 'CSS Grid', 'Media Queries', 'Accessibility']
      }
    };

    const modal = document.getElementById('projectModal');
    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = projects[btn.dataset.project];
        document.getElementById('modalTitle').textContent = p.title;
        document.getElementById('modalDesc').textContent = p.desc;
        document.getElementById('modalTags').innerHTML = p.tags.map(t =>
          `<span class="px-2.5 py-1 text-xs rounded-md bg-[var(--border)]">${t}</span>`
        ).join('');
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
      });
    });

    function closeModal() {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100');
    }
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('modalBackdrop').addEventListener('click', closeModal);

    // ========== TOAST ==========
    let toastTimer;
    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        t.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      }, 2800);
    }

    // ========== COPY EMAIL ==========
    document.getElementById('copyEmail').addEventListener('click', () => {
      const text = document.getElementById('emailValue').textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showToast('Email copied to clipboard'));
      } else {
        showToast('Copy failed — select manually');
      }
    });

    // ========== CONTACT FORM ==========
    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const nameErr = document.getElementById('nameError');
      const emailErr = document.getElementById('emailError');
      const msgErr = document.getElementById('messageError');

      nameErr.textContent = emailErr.textContent = msgErr.textContent = '';
      let valid = true;

      if (name.value.trim().length < 2) {
        nameErr.textContent = 'Please enter at least 2 characters.';
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        emailErr.textContent = 'Please enter a valid email.';
        valid = false;
      }
      if (message.value.trim().length < 10) {
        msgErr.textContent = 'Message should be at least 10 characters.';
        valid = false;
      }

      if (!valid) return;
      showToast(`Thanks, ${name.value.trim()}! Message recorded.`);
      e.target.reset();
    });
