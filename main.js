import AudioManager from './classes/AudioManager.js';
import InteractiveCursor from './classes/InteractiveCursor.js';
import { NavigationManager, ExperienceBar, AchievementManager, SkillReveal } from './classes/SectionSystem.js';
import { TypewriterEffect, ParticlesHero, ProjectCardTilt } from './classes/HeroSystem.js';
import KonamiSystem from './classes/KonamiSystem.js';
import CarouselSystem from './classes/CarouselSystem.js';

class ScrollToTopButton {
  constructor() {
    this.button = document.getElementById('scrollToTop');
    this.threshold = 300;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  handleScroll() {
    if (window.scrollY > this.threshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

class PortfolioApp {
  constructor() {
    // Intent: inicializa la aplicación completa ensamblando todos los módulos del portfolio y sus dependencias.
    this.audio = new AudioManager();
    this.cursor = new InteractiveCursor();
    this.navigation = new NavigationManager({ beep: this.audio.beep.bind(this.audio) });
    this.experienceBar = new ExperienceBar();
    this.achievements = new AchievementManager({ beep: this.audio.beep.bind(this.audio) });
    this.typewriter = new TypewriterEffect();
    this.heroParticles = new ParticlesHero();
    this.projectTilt = new ProjectCardTilt();
    this.skillReveal = new SkillReveal();
    this.konami = new KonamiSystem({
      beep: this.audio.beep.bind(this.audio),
      achievementFactory: (payload) => this.achievements.showAchievement(payload)
    });
    this.carousel = new CarouselSystem({ containerSelector: '.projects-grid', cardsPerView: 3 });
    this.scrollToTop = new ScrollToTopButton();
  }
}

// Intent: espera a que el DOM esté listo para bootear la app con todas sus funcionalidades activas.
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
