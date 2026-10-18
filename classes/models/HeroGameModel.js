export default class HeroGameModel {
  constructor({ eventBus, localization, maxAmmo = 5 } = {}) {
    this.eventBus = eventBus;
    this.localization = localization;
    this.eventBus?.on('language:changed', () => this.emitState());
    this.state = {
      ammo: maxAmmo,
      maxAmmo,
      destroyedShips: 0,
      totalShots: 0,
      missedClicks: 0,
      isReloading: false
    };
  }

  consumeAmmo() {
    if (this.state.isReloading || this.state.ammo <= 0) return false;

    this.state.ammo -= 1;
    this.state.totalShots += 1;
    this.emitState();
    return true;
  }

  recordMiss() {
    this.state.missedClicks += 1;
    this.emitState();
  }

  recordDestroyedShip() {
    this.state.destroyedShips += 1;
    this.emitState();
  }

  startReload() {
    this.state.isReloading = true;
    this.emitState();
  }

  completeReload() {
    this.state.ammo = this.state.maxAmmo;
    this.state.isReloading = false;
    this.emitState();
  }

  getSnapshot() {
    return {
      ...this.state,
      performanceMessage: this.getPerformanceMessage()
    };
  }

  get isReloading() {
    return this.state.isReloading;
  }

  get hasAmmo() {
    return this.state.ammo > 0;
  }

  getPerformanceMessage() {
    const { destroyedShips, totalShots, missedClicks } = this.state;
    const translate = this.localization?.translate.bind(this.localization);

    if (destroyedShips >= 20) {
      return translate
        ? translate('game.message.record', { destroyed: destroyedShips, missed: missedClicks })
        : `MISSION RECORD: You destroyed ${destroyedShips} meteors and missed only ${missedClicks} shots! You've mastered the game; now let's master your next project. Send me a message!`;
    }

    if (totalShots < 5) {
      return translate
        ? translate('game.message.explore', { destroyed: destroyedShips })
        : `You've destroyed ${destroyedShips} meteors! I see you preferred exploring the page before shooting. That's totally fine! Get in touch and let's talk about your idea.`;
    }

    if (destroyedShips < 5) {
      return translate
        ? translate('game.message.low', { destroyed: destroyedShips, missed: missedClicks })
        : `You destroyed ${destroyedShips} meteors and missed ${missedClicks} shots! Space defense may not be your thing, but luckily, programming is mine. Let's talk about a project!`;
    }

    const accuracy = destroyedShips / totalShots;
    if (accuracy >= 0.75) {
      return translate
        ? translate('game.message.accurate', { destroyed: destroyedShips, missed: missedClicks })
        : `You destroyed ${destroyedShips} meteors with only ${missedClicks} missed shots! Your aim is impeccable. Imagine what we could achieve together on a project!`;
    }

    return translate
      ? translate('game.message.average', { destroyed: destroyedShips, missed: missedClicks })
      : `You destroyed ${destroyedShips} meteors, but sent ${missedClicks} shots into space! Your enthusiasm and quick reflexes are clear. Let's channel that energy into your next project.`;
  }

  emitState() {
    this.eventBus?.emit('hero:state-changed', this.getSnapshot());
  }
}
