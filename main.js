import EventBus from './classes/core/EventBus.js';
import PortfolioController from './classes/core/PortfolioController.js';

// Intent: espera a que el DOM esté listo para bootear la app con todas sus funcionalidades activas.
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioController({ eventBus: new EventBus() });
});
