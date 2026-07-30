import Phaser from 'phaser'
import { ASSET_KEYS, GAME_HEIGHT, GAME_WIDTH } from '../constants'
import { resetGameState } from '../state/GameState'
import { getStageByIndex } from '../levels'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create(): void {
    const bg = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, ASSET_KEYS.bgMid).setOrigin(0, 0)
    bg.setAlpha(0.6)

    this.add
      .text(GAME_WIDTH / 2, 140, 'Aqua Pokémon World', {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(
        GAME_WIDTH / 2,
        220,
        'Help Nike explore the reef, team up with Pikachu,\nbeat the enemies, and defeat the villain!',
        { fontSize: '18px', color: '#dbeeff', align: 'center' },
      )
      .setOrigin(0.5)

    this.add
      .text(
        GAME_WIDTH / 2,
        320,
        'Arrows / WASD: Move & Jump\nPokéball button (or E): Pikachu attack (once recruited)',
        { fontSize: '16px', color: '#9fd8ff', align: 'center' },
      )
      .setOrigin(0.5)

    const startText = this.add
      .text(GAME_WIDTH / 2, 420, 'Press SPACE or Click to Start', {
        fontSize: '22px',
        color: '#ffe066',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1,
    })

    const beginGame = () => {
      resetGameState(this.registry)
      this.scene.start('LevelScene', getStageByIndex(0))
      this.scene.launch('UIScene')
      this.scene.bringToTop('UIScene')
    }

    this.input.keyboard?.once('keydown-SPACE', beginGame)
    this.input.once('pointerdown', beginGame)
  }
}
