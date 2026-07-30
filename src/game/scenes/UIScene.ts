import Phaser from 'phaser'
import { ASSET_KEYS, EVENTS, GAME_HEIGHT, GAME_WIDTH, REGISTRY_KEYS, STARTING_HEARTS } from '../constants'

export class UIScene extends Phaser.Scene {
  private heartIcons: Phaser.GameObjects.Sprite[] = []
  private healthFill!: Phaser.GameObjects.Rectangle
  private coinText!: Phaser.GameObjects.Text
  private waterFill!: Phaser.GameObjects.Rectangle
  private pokeballButton!: Phaser.GameObjects.Image

  constructor() {
    super('UIScene')
  }

  create(): void {
    // Hearts (top-left)
    this.heartIcons = []
    for (let i = 0; i < STARTING_HEARTS; i++) {
      const heart = this.add
        .sprite(24 + i * 40, 28, ASSET_KEYS.hearts, 0)
        .setScrollFactor(0)
        .setScale(0.4)
        .setDepth(100)
      this.heartIcons.push(heart)
    }

    this.add.rectangle(24, 52, 124, 12, 0x1a2a35, 0.9).setOrigin(0, 0.5).setScrollFactor(0).setDepth(99)
    this.healthFill = this.add.rectangle(26, 52, 120, 8, 0xf05252).setOrigin(0, 0.5).setScrollFactor(0).setDepth(100)

    // Coin counter (top-right)
    this.add.image(GAME_WIDTH - 110, 28, ASSET_KEYS.coin).setScale(0.22).setScrollFactor(0).setDepth(100)
    this.coinText = this.add
      .text(GAME_WIDTH - 90, 16, '0', { fontSize: '22px', color: '#ffffff' })
      .setScrollFactor(0)
      .setDepth(100)

    // Water meter (top-center)
    const meterX = GAME_WIDTH / 2 - 80
    const meterY = 12
    this.add.image(meterX, meterY, ASSET_KEYS.waterMeter).setOrigin(0, 0).setScale(0.5).setScrollFactor(0).setDepth(100)
    this.waterFill = this.add
      .rectangle(meterX + 46, meterY + 30, 0, 16, 0x4fd1ff)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(101)

    // Pikachu attack button (bottom-right)
    this.pokeballButton = this.add
      .image(GAME_WIDTH - 60, GAME_HEIGHT - 60, ASSET_KEYS.pokeballButton)
      .setScale(0.3)
      .setScrollFactor(0)
      .setDepth(100)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true })

    this.pokeballButton.on('pointerdown', () => this.requestPikachuAttack())
    this.input.keyboard?.on('keydown-E', () => this.requestPikachuAttack())

    this.game.events.on(EVENTS.heartChanged, this.onHeartsChanged, this)
    this.game.events.on(EVENTS.coinChanged, this.onCoinsChanged, this)
    this.game.events.on(EVENTS.pikachuRecruited, this.onPikachuRecruited, this)
    this.game.events.on(EVENTS.stageProgress, this.onStageProgress, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(EVENTS.heartChanged, this.onHeartsChanged, this)
      this.game.events.off(EVENTS.coinChanged, this.onCoinsChanged, this)
      this.game.events.off(EVENTS.pikachuRecruited, this.onPikachuRecruited, this)
      this.game.events.off(EVENTS.stageProgress, this.onStageProgress, this)
    })

    this.onHeartsChanged(this.registry.get(REGISTRY_KEYS.hearts) ?? STARTING_HEARTS)
    this.onCoinsChanged(this.registry.get(REGISTRY_KEYS.coins) ?? 0)
    if (this.registry.get(REGISTRY_KEYS.hasPikachu)) this.pokeballButton.setAlpha(1)
  }

  private requestPikachuAttack(): void {
    this.game.events.emit(EVENTS.pikachuAttackRequest)
  }

  private onHeartsChanged = (hearts: number): void => {
    this.heartIcons.forEach((heart, i) => heart.setAlpha(i < hearts ? 1 : 0.2))
    this.healthFill.width = 120 * Phaser.Math.Clamp(hearts / STARTING_HEARTS, 0, 1)
  }

  private onCoinsChanged = (coins: number): void => {
    this.coinText.setText(String(coins))
  }

  private onPikachuRecruited = (): void => {
    this.tweens.add({ targets: this.pokeballButton, alpha: 1, duration: 400 })
  }

  private onStageProgress = (fraction: number): void => {
    this.waterFill.width = 120 * Phaser.Math.Clamp(fraction, 0, 1)
  }
}
