export class TypewriterEffect {
  constructor({ elementSelector = '#heroTypeTitle', text = 'Game Development | Backend Developer' } = {}) {
    // Intent: prepara el elemento del hero y el texto base para desplegar un efecto de escritura.
    this.element = document.querySelector(elementSelector);
    this.text = text;
    this.init();
  }

  // Intent: escribe el texto carácter a carácter para dar vida al título principal del portfolio.
  init() {
    if (!this.element) return;

    let index = 0;
    const typeChar = () => {
      if (index <= this.text.length) {
        this.element.textContent = this.text.slice(0, index);
        index += 1;
        setTimeout(typeChar, 45);
      }
    };

    typeChar();
  }
}

export class HeroInteraction {
  constructor({ heroSelector = '.hero', cardSelector = '.project-card, .skill-card' } = {}) {
    this.hero = document.querySelector(heroSelector);
    this.cards = [...document.querySelectorAll(cardSelector)];
    this.isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
    this.pointer = { x: 0.5, y: 0.5 };
    this.targetRotation = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.init();
  }

  init() {
    if (this.isTouch || !this.hero) return;

    this.hero.addEventListener('mousemove', (event) => this.handleMove(event));
    this.hero.addEventListener('mouseleave', () => this.reset());

    this.cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => this.handleCardMove(event, card));
      card.addEventListener('mouseleave', () => this.resetCard(card));
    });

    this.animate();
  }

  handleMove(event) {
    const rect = this.hero.getBoundingClientRect();
    this.pointer.x = (event.clientX - rect.left) / rect.width;
    this.pointer.y = (event.clientY - rect.top) / rect.height;
    this.targetRotation.x = (0.5 - this.pointer.y) * 5;
    this.targetRotation.y = (this.pointer.x - 0.5) * 7;
    this.hero.style.setProperty('--mouse-x', `${this.pointer.x * 100}%`);
    this.hero.style.setProperty('--mouse-y', `${this.pointer.y * 100}%`);
    this.hero.classList.add('is-aiming');
  }

  handleCardMove(event, card) {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--card-tilt-x', `${y * -7}deg`);
    card.style.setProperty('--card-tilt-y', `${x * 9}deg`);
    card.style.setProperty('--card-glow-x', `${(x + 0.5) * 100}%`);
    card.style.setProperty('--card-glow-y', `${(y + 0.5) * 100}%`);
    card.classList.add('is-targeted');
  }

  reset() {
    this.targetRotation.x = 0;
    this.targetRotation.y = 0;
    this.hero.classList.remove('is-aiming');
  }

  resetCard(card) {
    card.classList.remove('is-targeted');
    card.style.removeProperty('--card-tilt-x');
    card.style.removeProperty('--card-tilt-y');
  }

  animate() {
    this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.08;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.08;
    this.hero.style.setProperty('--hero-tilt-x', `${this.rotation.x}deg`);
    this.hero.style.setProperty('--hero-tilt-y', `${this.rotation.y}deg`);
    requestAnimationFrame(() => this.animate());
  }
}

export class ParticlesHero {
  constructor({ canvasSelector = '#particles', heroSelector = '.hero', particleCount = 300 } = {}) {
    // Intent: guarda la referencia del canvas y del hero
    // para generar partículas interactivas en la sección principal.
    this.canvas = document.querySelector(canvasSelector);
    this.hero = document.querySelector(heroSelector);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.particleCount = particleCount;
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.init();
  }

  // Intent: crea una partícula con color, velocidad y posición
  // aleatoria para simular polvo pixelado.
  createParticle() {
    const colors = ['#7b5cf0', '#00d4ff', '#00ff88'];
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + Math.random() * 40,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.6 + 0.2,
      drift: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.3
    };
  }

  // Intent: ajusta el tamaño real del canvas para que las partículas sigan el alto y ancho del hero.
  resize() {
    if (!this.canvas || !this.hero) return;
    this.canvas.width = this.hero.offsetWidth;
    this.canvas.height = this.hero.offsetHeight;
  }

  // Intent: dibuja cada frame las partículas con efecto de repulsión respecto al cursor para dar sensación de movimiento.
  animate() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      const dx = particle.x - this.mouseX;
      const dy = particle.y - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 90) {
        const force = (90 - distance) / 90;
        particle.x += (dx / distance) * force * 2;
        particle.y += (dy / distance) * force * 2;
      }

      particle.y -= particle.speed;
      particle.x += particle.drift;

      if (particle.y < -10) Object.assign(particle, this.createParticle(), { y: this.canvas.height + 10 });
      if (particle.x < -10) particle.x = this.canvas.width + 10;
      if (particle.x > this.canvas.width + 10) particle.x = -10;

      this.ctx.beginPath();
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillRect(particle.x, particle.y, particle.r * 2, particle.r * 2);
      this.ctx.globalAlpha = 1;
    });

    requestAnimationFrame(() => this.animate());
  }

  // Intent: prepara el canvas, reacciona al mouse y sincroniza un bucle de animación constante para el fondo del hero.
  init() {
    if (!this.canvas || !this.hero || !this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.hero.addEventListener('mousemove', (event) => {
      const rect = this.hero.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    });

    this.hero.addEventListener('mouseleave', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
    });

    for (let i = 0; i < this.particleCount; i += 1) {
      const particle = this.createParticle();
      particle.y = Math.random() * this.canvas.height;
      this.particles.push(particle);
    }

    this.animate();
  }
}

export class ShipsHero {
  constructor({
    containerSelector = '#heroShips',
    heroSelector = '.hero',
    shipCount = 7,
    playExplosion = () => {}
  } = {}) {
    this.container = document.querySelector(containerSelector);
    this.hero = document.querySelector(heroSelector);
    this.playExplosion = playExplosion;
    this.ammoElement = document.querySelector('#heroAmmo');
    this.reloadElement = document.querySelector('#heroReload');
    this.scoreElement = document.querySelector('#heroScore');
    this.destroyedStatsElement = document.querySelector('#contactDestroyed');
    this.shotsStatsElement = document.querySelector('#contactShots');
    this.missesStatsElement = document.querySelector('#contactMisses');
    this.messageStatsElement = document.querySelector('#contactMessage');
    this.messageTextElement = document.querySelector('#contactMessageText');
    this.statsPanelElement = this.messageStatsElement?.closest('.contact-stats');
    this.shipCount = shipCount;
    this.maxAmmo = 5;
    this.ammo = this.maxAmmo;
    this.destroyedShips = 0;
    this.totalShots = 0;
    this.missedClicks = 0;
    this.isReloading = false;
    this.shipId = 0;
    this.activeShips = new Map();
    this.respawnTimers = new Set();
    this.lastFrameTime = 0;
    this.init();
    this.fitMessageToPanel();

    if (this.statsPanelElement) {
      if ('ResizeObserver' in window) {
        this.messageResizeObserver = new ResizeObserver(() => this.fitMessageToPanel());
        this.messageResizeObserver.observe(this.statsPanelElement);
      } else {
        window.addEventListener('resize', () => this.fitMessageToPanel());
      }
    }
  }

  init() {
    if (!this.container) return;

    this.hero?.addEventListener('click', (event) => {
      if (event.target.closest('.hero-ship, .hero-btns a, button')) return;
      if (this.consumeAmmo()) {
        this.missedClicks += 1;
        this.updateStats();
      }
    });

    for (let index = 0; index < this.shipCount; index += 1) {
      this.spawnShip();
    }

    this.animate();
  }

  getTrajectory() {
    let start;
    let target;
    let attempts = 0;

    do {
      const side = Math.floor(Math.random() * 4);
      const edgePosition = 5 + Math.random() * 90;
      start = [
        { x: -7, y: edgePosition },
        { x: 107, y: edgePosition },
        { x: edgePosition, y: -7 },
        { x: edgePosition, y: 107 }
      ][side];
      target = {
        x: 38 + Math.random() * 24,
        y: 38 + Math.random() * 24
      };
      attempts += 1;
    } while (this.crossesButtons(start, target) && attempts < 30);

    const length = Math.hypot(target.x - start.x, target.y - start.y);
    const speed = 0.0035 + Math.random() * 0.0018;

    return {
      x: start.x,
      y: start.y,
      vx: ((target.x - start.x) / length) * speed,
      vy: ((target.y - start.y) / length) * speed,
      angle: Math.atan2(target.y - start.y, target.x - start.x) * (180 / Math.PI) + 90
    };
  }

  crossesButtons(start, target) {
    const buttons = this.hero?.querySelector('.hero-btns');
    if (!buttons || !this.hero) return false;

    const heroRect = this.hero.getBoundingClientRect();
    const buttonsRect = buttons.getBoundingClientRect();
    const paddingX = 52 / heroRect.width * 100;
    const paddingY = 28 / heroRect.height * 100;
    const forbidden = {
      left: ((buttonsRect.left - heroRect.left) / heroRect.width) * 100 - paddingX,
      right: ((buttonsRect.right - heroRect.left) / heroRect.width) * 100 + paddingX,
      top: ((buttonsRect.top - heroRect.top) / heroRect.height) * 100 - paddingY,
      bottom: ((buttonsRect.bottom - heroRect.top) / heroRect.height) * 100 + paddingY
    };

    for (let progress = 0; progress <= 1; progress += 0.02) {
      const x = start.x + (target.x - start.x) * progress;
      const y = start.y + (target.y - start.y) * progress;
      if (x >= forbidden.left && x <= forbidden.right && y >= forbidden.top && y <= forbidden.bottom) {
        return true;
      }
    }

    return false;
  }

  isOutside(ship) {
    return ship.x < -9 || ship.x > 109 || ship.y < -9 || ship.y > 109;
  }

  animate(timestamp = performance.now()) {
    const delta = this.lastFrameTime ? Math.min(timestamp - this.lastFrameTime, 32) : 16;
    this.lastFrameTime = timestamp;

    this.activeShips.forEach((ship, element) => {
      if (element.classList.contains('is-destroying')) return;

      ship.x += ship.vx * delta;
      ship.y += ship.vy * delta;
      element.style.left = `${ship.x}%`;
      element.style.top = `${ship.y}%`;

      if (this.isOutside(ship)) {
        this.activeShips.delete(element);
        element.remove();
        this.spawnShip();
      }
    });

    window.requestAnimationFrame((nextTimestamp) => this.animate(nextTimestamp));
  }

  spawnShip() {
    const ship = document.createElement('button');
    const trajectory = this.getTrajectory();
    const shipId = this.shipId;
    this.shipId += 1;

    ship.type = 'button';
    ship.className = 'hero-ship';
    ship.dataset.shipId = String(shipId);
    ship.setAttribute('aria-label', 'Destroy meteor');
    ship.style.left = `${trajectory.x}%`;
    ship.style.top = `${trajectory.y}%`;
    ship.style.animationDelay = `${-Math.random() * 3.2}s`;
    ship.style.setProperty('--ship-angle', `${trajectory.angle}deg`);
    ship.addEventListener('click', (event) => {
      event.stopPropagation();
      this.destroyShip(ship);
    });
    this.activeShips.set(ship, trajectory);
    this.container.appendChild(ship);
  }

  updateAmmo() {
    if (this.ammoElement) this.ammoElement.textContent = `AMMO ${this.ammo}/${this.maxAmmo}`;
  }

  updateStats() {
    if (this.destroyedStatsElement) this.destroyedStatsElement.textContent = String(this.destroyedShips);
    if (this.shotsStatsElement) this.shotsStatsElement.textContent = String(this.totalShots);
    if (this.missesStatsElement) this.missesStatsElement.textContent = String(this.missedClicks);
    if (this.messageStatsElement) {
      const message = this.getPerformanceMessage();
      if (this.messageTextElement) this.messageTextElement.textContent = message;
      else this.messageStatsElement.textContent = message;
      this.fitMessageToPanel();
    }
  }

  fitMessageToPanel() {
    if (!this.messageStatsElement?.clientWidth || !this.messageStatsElement.clientHeight) return;

    let minimum = 4;
    let maximum = 30;
    let bestFit = minimum;

    while (maximum - minimum > 0.1) {
      const fontSize = (minimum + maximum) / 2;
      if (this.messageTextElement) this.messageTextElement.style.fontSize = `${fontSize}px`;
      else this.messageStatsElement.style.fontSize = `${fontSize}px`;
      const textElement = this.messageTextElement || this.messageStatsElement;

      if (
        textElement.scrollHeight <= this.messageStatsElement.clientHeight &&
        textElement.scrollWidth <= this.messageStatsElement.clientWidth
      ) {
        bestFit = fontSize;
        minimum = fontSize;
      } else {
        maximum = fontSize;
      }
    }

    if (this.messageTextElement) this.messageTextElement.style.fontSize = `${bestFit}px`;
    else this.messageStatsElement.style.fontSize = `${bestFit}px`;
  }

  getPerformanceMessage() {
    if (this.destroyedShips >= 20) {
      return `¡RÉCORD DE MISIÓN: Destruiste ${this.destroyedShips} meteoritos y solo erraste ${this.missedClicks} tiros! Dominaste el juego, ahora dominemos tu próximo desarrollo. ¡Enviame un mensaje!`;
    }

    if (this.totalShots < 5) {
      return `¡Destruiste solo ${this.destroyedShips} meteoritos! Veo que preferiste explorar la página antes que disparar. ¡Me parece perfecto! Ponete en contacto y hablemos de tu idea.`;
    }

    if (this.destroyedShips < 5) {
      return `¡Destruiste ${this.destroyedShips} meteoritos y erraste ${this.missedClicks} tiros! La defensa espacial no es lo tuyo, pero por suerte la programación sí es lo mío. ¡Hablemos por un proyecto!`;
    }

    const accuracy = this.destroyedShips / this.totalShots;
    if (accuracy >= 0.75) {
      return `¡Destruiste ${this.destroyedShips} meteoritos con solo ${this.missedClicks} disparos fallidos! Veo que tenés una puntería impecable. ¡Imaginá lo que podríamos lograr trabajando juntos en un proyecto!`;
    }

    return `¡Destruiste ${this.destroyedShips} meteoritos, pero dejaste ${this.missedClicks} disparos en el espacio! Se nota tu entusiasmo y rapidez. Hablemos para encauzar esa energía en tu próximo proyecto.`;
  }

  reload() {
    this.isReloading = true;
    this.hero?.classList.add('is-reloading');

    window.setTimeout(() => {
      this.ammo = this.maxAmmo;
      this.isReloading = false;
      this.updateAmmo();
      this.hero?.classList.remove('is-reloading');
    }, 4000);
  }

  scheduleRespawn(ship, delay = 1650) {
    const timer = window.setTimeout(() => {
      this.respawnTimers.delete(timer);
      ship.remove();
      this.spawnShip();
    }, delay);
    this.respawnTimers.add(timer);
  }

  consumeAmmo() {
    if (this.isReloading || this.ammo <= 0) return false;

    this.ammo -= 1;
    this.totalShots += 1;
    this.updateAmmo();
    if (this.ammo === 0) this.reload();
    return true;
  }

  destroyShip(ship) {
    if (ship.classList.contains('is-destroying') || this.isReloading || this.ammo <= 0) return;

    this.consumeAmmo();
    this.destroyedShips += 1;
    this.playExplosion();
    if (this.scoreElement) this.scoreElement.textContent = `METEORS DESTROYED ${this.destroyedShips}`;
    this.updateStats();
    this.activeShips.delete(ship);
    ship.style.animationDelay = '0s';
    const explosionVariants = ['burst', 'twirl', 'shockwave', 'shatter'];
    ship.dataset.explosion = explosionVariants[Math.floor(Math.random() * explosionVariants.length)];
    ship.classList.add('is-destroying');
    ship.setAttribute('aria-label', 'Meteor destroyed');
    ship.innerHTML = '<span class="ship-explosion" aria-hidden="true">' +
      Array.from({ length: 8 }, () => '<i></i>').join('') +
      '</span>';
    this.scheduleRespawn(ship);
  }
}
