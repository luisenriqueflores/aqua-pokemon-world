import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, REGISTRY_KEYS, STARTING_HEARTS } from '../constants'
import type { StageData } from '../levels/types'

interface GameOverData {
  stageData: StageData
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene')
  }

  create(data: GameOverData): void {
    this.scene.stop('UIScene')
    this.cameras.main.setBackgroundColor('#1a0505')

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'Game Over', { fontSize: '48px', color: '#ff5555' })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `${data.stageData.displayName} got the best of you.`, {
        fontSize: '18px',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    const retryText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'Press SPACE to Retry Stage', { fontSize: '20px', color: '#ffe066' })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, 'Press M for Main Menu', { fontSize: '16px', color: '#9fd8ff' })
      .setOrigin(0.5)

    this.tweens.add({ targets: retryText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 })

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.registry.set(REGISTRY_KEYS.hearts, STARTING_HEARTS)
      this.scene.start('LevelScene', data.stageData)
      this.scene.launch('UIScene')
      this.scene.bringToTop('UIScene')
    })

    this.input.keyboard?.once('keydown-M', () => {
      this.scene.start('MenuScene')
    })
  }
}
