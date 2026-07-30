import Phaser from 'phaser'
import { ASSET_KEYS, GAME_HEIGHT, GAME_WIDTH, REGISTRY_KEYS, SOUND_KEYS } from '../constants'
import { playSfx } from '../audio'

export class WinScene extends Phaser.Scene {
  constructor() {
    super('WinScene')
  }

  create(): void {
    this.scene.stop('UIScene')
    this.cameras.main.setBackgroundColor('#04263d')
    playSfx(this, SOUND_KEYS.win, { volume: 0.75 })

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, ASSET_KEYS.goalGate).setScale(0.4).setAlpha(0.9)

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 'You Win!', { fontSize: '48px', color: '#ffe066' })
      .setOrigin(0.5)

    const coins = this.registry.get(REGISTRY_KEYS.coins) ?? 0
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, `Nike and Pikachu saved the reef!\nCoins collected: ${coins}`, {
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5)

    const restartText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 150, 'Press SPACE for Main Menu', { fontSize: '18px', color: '#9fd8ff' })
      .setOrigin(0.5)

    this.tweens.add({ targets: restartText, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 })

    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('MenuScene'))
    this.input.once('pointerdown', () => this.scene.start('MenuScene'))
  }
}
