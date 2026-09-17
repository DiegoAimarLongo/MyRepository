import AudioManager from '../AudioManager.js';
import InteractiveCursor from '../InteractiveCursor.js';
import { NavigationManager, ExperienceBar, AchievementManager, SkillReveal } from '../SectionSystem.js';
import { TypewriterEffect, ParticlesHero, HeroInteraction, ShipsHero } from '../HeroSystem.js';
import CarouselSystem from '../CarouselSystem.js';
import PortfolioModel from './PortfolioModel.js';
import PortfolioView from './PortfolioView.js';

export default class PortfolioController {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.model = new PortfolioModel({ eventBus });
    this.view = new PortfolioView({ eventBus });
    this.view.bindState();
    this.audio = new AudioManager({ eventBus });
    this.bindEvents();
    this.initializeSystems();
    this.model.setSoundEnabled(this.audio.soundOn);
    this.model.setActiveSection('inicio');
  }

  bindEvents() {
    this.eventBus.on('section:active', (sectionId) => this.model.setActiveSection(sectionId));
    this.eventBus.on('scroll:progress', (progress) => this.model.setScrollProgress(progress));
    this.eventBus.on('achievement:detected', (achievement) => this.model.unlockAchievement(achievement));
    this.eventBus.on('audio:changed', (isEnabled) => this.model.setSoundEnabled(isEnabled));
  }

  initializeSystems() {
    const beep = this.audio.beep.bind(this.audio);
    new InteractiveCursor();
    new NavigationManager({ beep, eventBus: this.eventBus });
    new ExperienceBar({ eventBus: this.eventBus });
    new AchievementManager({ beep, eventBus: this.eventBus });
    new TypewriterEffect();
    new ParticlesHero();
    new ShipsHero();
    new ParticlesHero({ canvasSelector: '#skillsParticles', heroSelector: '#habilidades', particleCount: 260 });
    new ParticlesHero({ canvasSelector: '#contactParticles', heroSelector: '#contacto', particleCount: 180 });
    new HeroInteraction();
    new SkillReveal();
    new CarouselSystem({ containerSelector: '.projects-grid', cardsPerView: 3 });
    this.bindScrollToTop();
  }

  bindScrollToTop() {
    const button = document.getElementById('scrollToTop');
    if (!button) return;
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => button.classList.toggle('visible', window.scrollY > 300));
  }
}
