import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, PHYSICS } from './constants'
import { BootScene } from './scenes/BootScene'
import { MenuScene } from './scenes/MenuScene'
import { UIScene } from './scenes/UIScene'
import { LevelScene } from './scenes/LevelScene'
import { StageClearScene } from './scenes/StageClearScene'
import { GameOverScene } from './scenes/GameOverScene'
import { WinScene } from './scenes/WinScene'

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#062b3d',
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: PHYSICS.gravityY },
        debug: false,
      },
    },
    scene: [BootScene, MenuScene, UIScene, LevelScene, StageClearScene, GameOverScene, WinScene],
  }
}
