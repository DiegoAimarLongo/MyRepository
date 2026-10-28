import AudioController from './AudioController.js';
import AudioManager from '../services/AudioManager.js';
import InteractiveCursor from './InteractiveCursorController.js';
import { NavigationManager, ExperienceBar, AchievementManager, SkillReveal } from './SectionControllers.js';
import { TypewriterEffect, ParticlesHero, HeroInteraction, ShipsHero } from './HeroController.js';
import CarouselSystem from './CarouselController.js';
import PortfolioModel from '../models/PortfolioModel.js';
import PortfolioView from '../views/PortfolioView.js';
import LocalizationManager from '../services/LocalizationManager.js';

export default class PortfolioController {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.localization = new LocalizationManager({ eventBus });
    this.model = new PortfolioModel({ eventBus });
    this.view = new PortfolioView({ eventBus, localization: this.localization });
    this.view.bindState();
    this.bindEvents();
    this.audio = new AudioManager({ eventBus });
    this.audioController = new AudioController({ audioManager: this.audio });
    this.initializeSystems();
    this.model.setActiveSection('inicio');
  }

  bindEvents() {
    this.eventBus.on('section:active', (sectionId) => this.model.setActiveSection(sectionId));
    this.eventBus.on('scroll:progress', (progress) => this.model.setScrollProgress(progress));
    this.eventBus.on('achievement:detected', (achievement) => this.model.unlockAchievement(achievement));
    this.eventBus.on('audio:volume-changed', (volume) => this.model.setSoundVolume(volume));
    this.eventBus.on('audio:music-volume-changed', (volume) => this.model.setMusicVolume(volume));
  }

  initializeSystems() {
    const beep = this.audio.beep.bind(this.audio);
    this.bindLogoEffect();
    new InteractiveCursor();
    new NavigationManager({ beep, eventBus: this.eventBus });
    new ExperienceBar({ eventBus: this.eventBus });
    new AchievementManager({ beep, eventBus: this.eventBus, localization: this.localization });
    new TypewriterEffect({ localization: this.localization });
    new ParticlesHero();
    new ShipsHero({
      eventBus: this.eventBus,
      localization: this.localization,
      playExplosion: this.audio.playMeteorExplosion.bind(this.audio)
    });
    new ParticlesHero({ canvasSelector: '#skillsParticles', heroSelector: '#habilidades', particleCount: 260 });
    new ParticlesHero({ canvasSelector: '#contactParticles', heroSelector: '#contacto', particleCount: 180 });
    new HeroInteraction();
    new SkillReveal();
    new CarouselSystem({
      containerSelector: '.projects-grid',
      cardsPerView: 3,
      localization: this.localization
    });
    this.bindScrollToTop();
  }

  bindLogoEffect() {
    const logo = document.querySelector('.logo-icon');
    const aboutSection = document.querySelector('#sobre-mi');
    if (!logo || !aboutSection) return;

    const aboutObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      logo.classList.add('is-pixel');
      aboutObserver.disconnect();
    }, { threshold: 0.35 });

    aboutObserver.observe(aboutSection);
  }

  bindScrollToTop() {
    const button = document.getElementById('scrollToTop');
    if (!button) return;
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    let scrollFrame = 0;
    window.addEventListener('scroll', () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        button.classList.toggle('visible', window.scrollY > 300);
      });
    }, { passive: true });
  }
}
