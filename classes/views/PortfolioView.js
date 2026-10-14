export default class PortfolioView {
  constructor({ eventBus, selectors = {} } = {}) {
    this.eventBus = eventBus;
    this.selectors = {
      navItems: selectors.navItems || '.nav-item',
      xpBar: selectors.xpBar || '#xpBar',
      achievements: selectors.achievements || '#achv-container',
      soundVolume: selectors.soundVolume || '#soundVolume',
      soundVolumeValue: selectors.soundVolumeValue || '#soundVolumeValue',
      musicVolume: selectors.musicVolume || '#musicVolume',
      musicVolumeValue: selectors.musicVolumeValue || '#musicVolumeValue'
    };
    this.navItems = [...document.querySelectorAll(this.selectors.navItems)];
    this.xpBar = document.querySelector(this.selectors.xpBar);
    this.achievements = document.querySelector(this.selectors.achievements);
    this.soundVolume = document.querySelector(this.selectors.soundVolume);
    this.soundVolumeValue = document.querySelector(this.selectors.soundVolumeValue);
    this.musicVolume = document.querySelector(this.selectors.musicVolume);
    this.musicVolumeValue = document.querySelector(this.selectors.musicVolumeValue);
  }

  bindState() {
    this.eventBus.on('state:active-section-changed', (sectionId) => this.setActiveSection(sectionId));
    this.eventBus.on('state:scroll-progress-changed', (progress) => this.setScrollProgress(progress));
    this.eventBus.on('state:achievement-unlocked', (achievement) => this.renderAchievement(achievement));
    this.eventBus.on('state:sound-volume-changed', (volume) => this.setSoundVolume(volume));
    this.eventBus.on('state:music-volume-changed', (volume) => this.setMusicVolume(volume));
  }

  setActiveSection(sectionId) {
    document.body.dataset.activeSection = sectionId;
    this.navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`));
  }

  setScrollProgress(progress) {
    document.body.style.setProperty('--scroll-progress', `${progress}%`);
    if (this.xpBar) this.xpBar.style.width = `${progress}%`;
  }

  setSoundVolume(volume) {
    document.body.dataset.sound = volume > 0 ? 'on' : 'off';
    if (this.soundVolume) this.soundVolume.value = String(volume);
    if (this.soundVolumeValue) this.soundVolumeValue.textContent = `${volume}%`;
    this.soundVolume?.style.setProperty('--volume-percent', `${volume}%`);
  }

  setMusicVolume(volume) {
    if (this.musicVolume) this.musicVolume.value = String(volume);
    if (this.musicVolumeValue) this.musicVolumeValue.textContent = `${volume}%`;
    this.musicVolume?.style.setProperty('--volume-percent', `${volume}%`);
  }

  renderAchievement({ icon, label, title }) {
    if (!this.achievements) return;
    const toast = document.createElement('div');
    toast.className = 'achv-toast';
    toast.innerHTML = `
      <div class="achv-icon">${icon}</div>
      <div class="achv-text">
        <div class="achv-label">${label}</div>
        <div class="achv-title">${title}</div>
      </div>`;
    this.achievements.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
}
