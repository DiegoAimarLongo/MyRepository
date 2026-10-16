export default class HeroGameView {
  constructor({ eventBus, model } = {}) {
    this.eventBus = eventBus;
    this.ammoElement = document.querySelector('#heroAmmo');
    this.scoreElement = document.querySelector('#heroScore');
    this.destroyedStatsElement = document.querySelector('#contactDestroyed');
    this.shotsStatsElement = document.querySelector('#contactShots');
    this.missesStatsElement = document.querySelector('#contactMisses');
    this.messageStatsElement = document.querySelector('#contactMessage');
    this.messageTextElement = document.querySelector('#contactMessageText');
    this.statsPanelElement = this.messageStatsElement?.closest('.contact-stats');

    this.eventBus?.on('hero:state-changed', (state) => this.render(state));
    this.render(model?.getSnapshot());
    this.observePanelResize();
  }

  render(state) {
    if (!state) return;

    if (this.ammoElement) this.ammoElement.textContent = `AMMO ${state.ammo}/${state.maxAmmo}`;
    if (this.scoreElement) this.scoreElement.textContent = `METEORS DESTROYED ${state.destroyedShips}`;
    if (this.destroyedStatsElement) this.destroyedStatsElement.textContent = String(state.destroyedShips);
    if (this.shotsStatsElement) this.shotsStatsElement.textContent = String(state.totalShots);
    if (this.missesStatsElement) this.missesStatsElement.textContent = String(state.missedClicks);

    if (this.messageStatsElement) {
      if (this.messageTextElement) this.messageTextElement.textContent = state.performanceMessage;
      else this.messageStatsElement.textContent = state.performanceMessage;
      this.fitMessageToPanel();
    }
  }

  observePanelResize() {
    if (!this.statsPanelElement) return;

    if ('ResizeObserver' in window) {
      this.messageResizeObserver = new ResizeObserver(() => this.fitMessageToPanel());
      this.messageResizeObserver.observe(this.statsPanelElement);
    } else {
      window.addEventListener('resize', () => this.fitMessageToPanel());
    }
  }

  fitMessageToPanel() {
    if (!this.messageStatsElement?.clientWidth || !this.messageStatsElement.clientHeight) return;

    let minimum = 4;
    let maximum = 30;
    let bestFit = minimum;

    while (maximum - minimum > 0.1) {
      const fontSize = (minimum + maximum) / 2;
      const textElement = this.messageTextElement || this.messageStatsElement;
      textElement.style.fontSize = `${fontSize}px`;

      if (
        textElement.scrollHeight <= this.messageStatsElement.clientHeight &&
        textElement.scrollWidth <= this.messageStatsElement.clientWidth
      ) {
        bestFit = fontSize;
        minimum = fontSize;
      } else {
        maximum = fontSize;
      }
    }

    const textElement = this.messageTextElement || this.messageStatsElement;
    textElement.style.fontSize = `${Math.max(4, bestFit * 0.9)}px`;
  }
}
