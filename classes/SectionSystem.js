export class NavigationManager {
  constructor({ beep } = {}) {
    // Intent: guarda la referencia al efecto de sonido y registra la navegación activa de la página.
    this.beep = beep || (() => {});
    this.navItems = [...document.querySelectorAll('.nav-item')];
    this.sections = [...document.querySelectorAll('section[id]')];
    this.init();
  }

  // Intent: observa las secciones visibles e ilumina el item del menú correspondiente con scroll suave.
  init() {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        this.navItems.forEach((navItem) => navItem.classList.remove('active'));
        const activeItem = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (activeItem) activeItem.classList.add('active');
      });
    }, { threshold: 0.3 });

    this.sections.forEach((section) => navObserver.observe(section));

    this.navItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        this.beep(500, 0.05);

        const target = document.querySelector(item.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('.btn-primary, .btn-outline, .project-link').forEach((element) => {
      element.addEventListener('click', () => this.beep(720, 0.05, 'square', 0.04));
    });
  }
}

export class ExperienceBar {
  constructor({ barSelector = '#xpBar' } = {}) {
    // Intent: guarda la referencia de la barra de progreso y la activa al cargar la página.
    this.bar = document.querySelector(barSelector);
    this.init();
  }

  // Intent: calcula cuánto se avanzó en el documento y actualiza el ancho de la barra de XP.
  update() {
    if (!this.bar) return;

    const root = document.documentElement;
    const scrolled = root.scrollTop;
    const max = root.scrollHeight - root.clientHeight;
    const percent = max > 0 ? (scrolled / max) * 100 : 0;
    this.bar.style.width = percent + '%';
  }

  // Intent: escucha el scroll y sincroniza la barra en cada movimiento para dar feedback de recorrido.
  init() {
    document.addEventListener('scroll', () => this.update());
    this.update();
  }
}

export class AchievementManager {
  constructor({ containerSelector = '#achv-container', beep } = {}) {
    // Intent: prepara el contenedor de toasts y el sistema de logros para secciones visibles.
    this.container = document.querySelector(containerSelector);
    this.beep = beep || (() => {});
    this.achvData = {
      'sobre-mi': { icon: '◉', label: 'Logro desbloqueado', title: 'Conociste al desarrollador' },
      proyectos: { icon: '⬡', label: 'Logro desbloqueado', title: 'Explorador de proyectos' },
      habilidades: { icon: '⚔', label: 'Logro desbloqueado', title: 'Stack Tecnológico revisado' },
      formacion: { icon: '🎓', label: 'Logro desbloqueado', title: 'Ruta académica completada' },
      contacto: { icon: '✉', label: 'Logro desbloqueado', title: '¡Listo para conectar!' }
    };
    this.unlocked = new Set();
    this.init();
  }

  // Intent: crea una notificación visual de logro con tono de audio para reforzar el feedback del usuario.
  showAchievement({ icon, label, title }) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = 'achv-toast';
    toast.innerHTML = `
      <div class="achv-icon">${icon}</div>
      <div class="achv-text">
        <div class="achv-label">${label}</div>
        <div class="achv-title">${title}</div>
      </div>`;

    this.container.appendChild(toast);
    this.beep(880, 0.05, 'square', 0.05);
    setTimeout(() => this.beep(1046, 0.08, 'square', 0.05), 90);
    setTimeout(() => toast.remove(), 4000);
  }

  // Intent: vigila las secciones y dispara un logro solo la primera vez que cada bloque entra en pantalla.
  init() {
    if (!this.container) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && this.achvData[id] && !this.unlocked.has(id)) {
          this.unlocked.add(id);
          this.showAchievement(this.achvData[id]);
        }
      });
    }, { threshold: 0.4 });

    Object.keys(this.achvData).forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
  }
}

export class SkillReveal {
  constructor({ skillSelector = '.skill-card' } = {}) {
    // Intent: obtiene todas las tarjetas de habilidades para animarlas cuando entren en la vista.
    this.cards = [...document.querySelectorAll(skillSelector)];
    this.init();
  }

  // Intent: usa un observer para activar la clase de revelado solo cuando cada skill aparece en pantalla.
  init() {
    if (!this.cards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    this.cards.forEach((card) => observer.observe(card));
  }
}
