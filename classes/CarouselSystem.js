export default class CarouselSystem {
  constructor({ containerSelector = '.projects-grid', cardsPerView = 3 } = {}) {
    // Intent: maneja el comportamiento de carrusel para las tarjetas de proyectos,
    // permitiendo navegación fluida entre proyectos.
    this.container = document.querySelector(containerSelector);
    this.cardsPerView = cardsPerView;
    this.currentIndex = 0;
    this.cards = [];
    this.isTransitioning = false;
    this.init();
  }

  init() {
    // Intent: inicializa el carrusel detectando las tarjetas y creando
    // los controles de navegación.
    if (!this.container) return;

    this.cards = Array.from(this.container.querySelectorAll('.project-card'));
    if (this.cards.length === 0) return;

    // Convertir grid a estructura de carrusel
    this.container.classList.add('carousel-mode');

    // Crear wrapper para las tarjetas
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    
    const track = document.createElement('div');
    track.className = 'carousel-track';
    
    this.cards.forEach(card => {
      track.appendChild(card);
    });
    
    wrapper.appendChild(track);
    this.container.innerHTML = '';
    this.container.appendChild(wrapper);

    this.track = track;
    this.wrapper = wrapper;

    // Crear controles
    this.createControls();
    this.updateCarousel();

    // Event listeners
    window.addEventListener('resize', () => this.updateCarousel());
  }

  createControls() {
    // Intent: genera los botones prev/next.
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'carousel-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-prev';
    prevBtn.innerHTML = '◀';
    prevBtn.addEventListener('click', () => this.prev());

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-next';
    nextBtn.innerHTML = '▶';
    nextBtn.addEventListener('click', () => this.next());

    controlsContainer.appendChild(prevBtn);
    controlsContainer.appendChild(nextBtn);

    this.wrapper.parentElement.appendChild(controlsContainer);
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
  }

  updateCarousel() {
    // Intent: actualiza la posición del carrusel y desactiva botones
    // cuando está en los extremos, manteniendo todo dentro de la pantalla.
    if (!this.track || !this.wrapper) return;

    // Calcular el ancho disponible del contenedor
    const wrapperWidth = this.wrapper.offsetWidth;
    
    // Calcular el ancho de cada tarjeta
    const cardWidth = this.cards[0]?.offsetWidth || 280;
    const gap = 24; // 1.5rem en pixels
    const singleCardWidth = cardWidth + gap;

    // Calcular el desplazamiento
    const offset = -this.currentIndex * singleCardWidth;

    this.track.style.transform = `translateX(${offset}px)`;
    this.updateButtonStates();
  }

  updateButtonStates() {
    // Intent: deshabilita los botones prev/next cuando se alcanza
    // el inicio o fin del carrusel.
    const maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
    
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }
  }

  next() {
    // Intent: avanza al siguiente conjunto de tarjetas.
    const maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prev() {
    // Intent: retrocede al conjunto anterior de tarjetas.
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

}
