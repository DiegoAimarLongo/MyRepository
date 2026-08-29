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
  }
}

// Intent: espera a que el DOM esté listo para bootear la app con todas sus funcionalidades activas.
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
