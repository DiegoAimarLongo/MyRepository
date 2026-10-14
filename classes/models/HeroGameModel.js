export default class HeroGameModel {
  constructor({ eventBus, maxAmmo = 5 } = {}) {
    this.eventBus = eventBus;
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

    if (destroyedShips >= 20) {
      return `¡RÉCORD DE MISIÓN: Destruiste ${destroyedShips} meteoritos y solo erraste ${missedClicks} tiros! Dominaste el juego, ahora dominemos tu próximo desarrollo. ¡Enviame un mensaje!`;
    }

    if (totalShots < 5) {
      return `¡Destruiste solo ${destroyedShips} meteoritos! Veo que preferiste explorar la página antes que disparar. ¡Me parece perfecto! Ponete en contacto y hablemos de tu idea.`;
    }

    if (destroyedShips < 5) {
      return `¡Destruiste ${destroyedShips} meteoritos y erraste ${missedClicks} tiros! La defensa espacial no es lo tuyo, pero por suerte la programación sí es lo mío. ¡Hablemos por un proyecto!`;
    }

    const accuracy = destroyedShips / totalShots;
    if (accuracy >= 0.75) {
      return `¡Destruiste ${destroyedShips} meteoritos con solo ${missedClicks} disparos fallidos! Veo que tenés una puntería impecable. ¡Imaginá lo que podríamos lograr trabajando juntos en un proyecto!`;
    }

    return `¡Destruiste ${destroyedShips} meteoritos, pero dejaste ${missedClicks} disparos en el espacio! Se nota tu entusiasmo y rapidez. Hablemos para encauzar esa energía en tu próximo proyecto.`;
  }

  emitState() {
    this.eventBus?.emit('hero:state-changed', this.getSnapshot());
  }
}
