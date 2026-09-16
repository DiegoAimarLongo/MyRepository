import EventBus from './classes/core/EventBus.js';
import PortfolioController from './classes/core/PortfolioController.js';

// Intent: espera a que el DOM esté listo para bootear la app con todas sus funcionalidades activas.
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioController({ eventBus: new EventBus() });

  const logo = document.querySelector('.logo-icon');
  const aboutSection = document.querySelector('#sobre-mi');

  if (logo && aboutSection) {
    const aboutObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        logo.classList.add('is-pixel');
        aboutObserver.disconnect();
      }
    }, { threshold: 0.35 });

    aboutObserver.observe(aboutSection);
  }
});
