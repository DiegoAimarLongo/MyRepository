export default class PortfolioView {
  constructor({ eventBus, selectors = {} } = {}) {
    this.eventBus = eventBus;
    this.selectors = {
      navItems: selectors.navItems || '.nav-item',
      sections: selectors.sections || 'section[id]',
      xpBar: selectors.xpBar || '#xpBar',
      achievements: selectors.achievements || '#achv-container',
      soundToggle: selectors.soundToggle || '#soundToggle'
    };
    this.navItems = [...document.querySelectorAll(this.selectors.navItems)];
    this.xpBar = document.querySelector(this.selectors.xpBar);
    this.achievements = document.querySelector(this.selectors.achievements);
    this.soundToggle = document.querySelector(this.selectors.soundToggle);
  }

  bindState() {
    this.eventBus.on('state:active-section-changed', (sectionId) => this.setActiveSection(sectionId));
    this.eventBus.on('state:scroll-progress-changed', (progress) => this.setScrollProgress(progress));
    this.eventBus.on('state:achievement-unlocked', (achievement) => this.renderAchievement(achievement));
    this.eventBus.on('state:sound-changed', (isEnabled) => this.setSoundEnabled(isEnabled));
  }

  setActiveSection(sectionId) {
    document.body.dataset.activeSection = sectionId;
    this.navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`));
  }

  setScrollProgress(progress) {
    document.body.style.setProperty('--scroll-progress', `${progress}%`);
    if (this.xpBar) this.xpBar.style.width = `${progress}%`;
  }

  setSoundEnabled(isEnabled) {
    document.body.dataset.sound = isEnabled ? 'on' : 'off';
    if (!this.soundToggle) return;
    this.soundToggle.textContent = isEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
    this.soundToggle.setAttribute('aria-pressed', String(isEnabled));
    this.soundToggle.classList.toggle('is-on', isEnabled);
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
