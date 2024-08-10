

import Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import PreloadScene from './scenes/PreloadScene';
import { GAME_CONFIG } from './constant';

const SHARED_CONFIG = {
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
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
