export default class InteractiveCursor {
  constructor({ cursorSelector = '#pxCursor', ringSelector = '#pxRing' } = {}) {
    // Intent: inicializa el cursor retro y prepara sus coordenadas para seguir el puntero con suavizado.
    this.cursor = document.querySelector(cursorSelector);
    this.ring = document.querySelector(ringSelector);
    this.isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
    this.mx = 0;
    this.my = 0;
    this.rx = 0;
    this.ry = 0;
    this.init();
  }

  // Intent: enlaza eventos del mouse para mover el cursor, animar el anillo y reaccionar a hover/click.
  init() {
    if (this.isTouch || !this.cursor || !this.ring) return;

    document.addEventListener('mousemove', (event) => {
      this.mx = event.clientX;
      this.my = event.clientY;
      this.cursor.style.left = this.mx + 'px';
      this.cursor.style.top = this.my + 'px';
    });

    const animate = () => {
      this.rx += (this.mx - this.rx) * 0.18;
      this.ry += (this.my - this.ry) * 0.18;
      this.ring.style.left = this.rx + 'px';
      this.ring.style.top = this.ry + 'px';
      requestAnimationFrame(animate);
    };

    animate();

    document.addEventListener('mousedown', () => this.cursor.classList.add('click'));
    document.addEventListener('mouseup', () => this.cursor.classList.remove('click'));

    document.querySelectorAll('a, button, .project-card, .skill-card, .contact-item').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        this.ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
      });

      element.addEventListener('mouseleave', () => {
        this.ring.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });
  }
}
