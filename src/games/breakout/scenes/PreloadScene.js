import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.atlas(
      "assets",
      "assets/games/breakout/breakout.png",
      "assets/games/breakout/breakout.json"
    );
    this.load.image('background', 'assets/games/breakout/background.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}

export default PreloadScene;
