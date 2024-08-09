import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: "phaser-example",
  scene: [PreloadScene, GameScene],
  physics: {
    default: "arcade",
  },
};

export default config;
