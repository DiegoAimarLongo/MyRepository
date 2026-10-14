export default class PortfolioModel {
  constructor({ eventBus } = {}) {
    this.eventBus = eventBus;
    this.state = {
      activeSection: null,
      scrollProgress: 0,
      soundVolume: 100,
      musicVolume: 70,
      unlockedAchievements: new Set()
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

  setSoundVolume(volume) {
    this.state.soundVolume = Math.max(0, Math.min(100, Number(volume)));
    this.eventBus.emit('state:sound-volume-changed', this.state.soundVolume);
  }

  setMusicVolume(volume) {
    this.state.musicVolume = Math.max(0, Math.min(100, Number(volume)));
    this.eventBus.emit('state:music-volume-changed', this.state.musicVolume);
  }

  unlockAchievement(achievement) {
    if (!achievement || this.state.unlockedAchievements.has(achievement.id)) return false;
    this.state.unlockedAchievements.add(achievement.id);
    this.eventBus.emit('state:achievement-unlocked', achievement);
    return true;
  }

}
