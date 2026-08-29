class KonamiSystem {
  constructor({ beep, achievementFactory, overlaySelector = '#konami-overlay', closeSelector = '#konamiClose' } = {}) {
    // Intent: prepara la secuencia, la capa modal y la fábrica de logros para activar el easter egg de forma centralizada.
    this.beep = beep || (() => {});
    this.achievementFactory = achievementFactory || (() => {});
    this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.position = 0;
    this.overlay = document.querySelector(overlaySelector);
    this.closeButton = document.querySelector(closeSelector);
    this.init();
  }

  // Intent: escucha el teclado y detecta la secuencia Konami para activar la sorpresa del sitio.
  init() {
    document.addEventListener('keydown', (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === this.sequence[this.position]) {
        this.position += 1;

        if (this.position === this.sequence.length) {
          this.position = 0;
          this.activate();
        }
      } else {
        this.position = key === this.sequence[0] ? 1 : 0;
      }

      if (event.key === 'Escape' && this.overlay) {
        this.overlay.classList.remove('show');
      }
    });

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        if (this.overlay) this.overlay.classList.remove('show');
      });
    }
  }

  // Intent: muestra el overlay secreto y lanza una secuencia musical junto con el logro del usuario.
  activate() {
    if (!this.overlay) return;

    this.overlay.classList.add('show');
    [523, 659, 784, 1046].forEach((frequency, index) => {
      setTimeout(() => this.beep(frequency, 0.12, 'square', 0.06), index * 120);
    });

    this.achievementFactory({
      icon: '🎮',
      label: 'Logro secreto',
      title: 'Jugador Nº2 detectado'
    });
  }
}
