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

export class ParticlesHero {
  constructor({ canvasSelector = '#particles', heroSelector = '.hero' } = {}) {
    // Intent: guarda la referencia del canvas y del hero
    // para generar partículas interactivas en la sección principal.
    this.canvas = document.querySelector(canvasSelector);
    this.hero = document.querySelector(heroSelector);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
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

    const count = 750;
    for (let i = 0; i < count; i += 1) {
      const particle = this.createParticle();
      particle.y = Math.random() * this.canvas.height;
      this.particles.push(particle);
    }

    this.animate();
  }
}

