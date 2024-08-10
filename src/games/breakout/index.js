

import Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import PreloadScene from './scenes/PreloadScene';

const WIDTH = 540;
const HEIGHT = 750;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
}

const Scenes = [PreloadScene,GameScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.WEBGL,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
  },
  scene: initScenes()
}

new Phaser.Game(config);
