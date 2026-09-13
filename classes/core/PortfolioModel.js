export default class PortfolioModel {
  constructor({ eventBus } = {}) {
    this.eventBus = eventBus;
    this.state = {
      activeSection: null,
      scrollProgress: 0,
      soundEnabled: true,
      unlockedAchievements: new Set(),
      konamiActive: false
    };
  }

  setActiveSection(sectionId) {
    if (!sectionId || this.state.activeSection === sectionId) return;
    this.state.activeSection = sectionId;
    this.eventBus.emit('state:active-section-changed', sectionId);
  }

  setScrollProgress(progress) {
    const normalizedProgress = Math.max(0, Math.min(100, progress));
    this.state.scrollProgress = normalizedProgress;
    this.eventBus.emit('state:scroll-progress-changed', normalizedProgress);
  }

  setSoundEnabled(enabled) {
    this.state.soundEnabled = Boolean(enabled);
    this.eventBus.emit('state:sound-changed', this.state.soundEnabled);
  }

  unlockAchievement(achievement) {
    if (!achievement || this.state.unlockedAchievements.has(achievement.id)) return false;
    this.state.unlockedAchievements.add(achievement.id);
    this.eventBus.emit('state:achievement-unlocked', achievement);
    return true;
  }

  setKonamiActive(active) {
    this.state.konamiActive = Boolean(active);
    this.eventBus.emit('state:konami-changed', this.state.konamiActive);
  }
}
