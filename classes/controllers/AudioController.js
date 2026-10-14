export default class AudioController {
  constructor({
    audioManager,
    soundVolumeSelector = '#soundVolume',
    musicVolumeSelector = '#musicVolume'
  } = {}) {
    this.audioManager = audioManager;
    this.soundVolumeInput = document.querySelector(soundVolumeSelector);
    this.musicVolumeInput = document.querySelector(musicVolumeSelector);
    this.bindEvents();
    this.audioManager.setSoundVolume(this.soundVolumeInput?.value ?? this.audioManager.soundVolume);
    this.audioManager.setMusicVolume(this.musicVolumeInput?.value ?? this.audioManager.musicVolume);
    this.startAudio();
  }

  bindEvents() {
    this.soundVolumeInput?.addEventListener('input', () => {
      this.audioManager.setSoundVolume(this.soundVolumeInput.value);
    });

    this.musicVolumeInput?.addEventListener('input', () => {
      this.audioManager.setMusicVolume(this.musicVolumeInput.value);
    });
  }

  startAudio() {
    this.audioManager.resumeAudioContext();
    this.audioManager.playMusic();

    const unlockAudio = () => {
      this.audioManager.resumeAudioContext();
      if (this.audioManager.soundVolume > 0) this.audioManager.beep(660, 0.08);
      this.audioManager.playMusic();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    document.addEventListener('click', () => this.audioManager.beep(), true);
  }
}
