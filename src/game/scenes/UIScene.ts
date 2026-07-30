import Phaser from 'phaser'
import { ASSET_KEYS, EVENTS, GAME_HEIGHT, GAME_WIDTH, REGISTRY_KEYS, SOUND_KEYS, STARTING_HEARTS } from '../constants'
import { playSfx } from '../audio'

export class UIScene extends Phaser.Scene {
  private heartIcons: Phaser.GameObjects.Sprite[] = []
  private healthFill!: Phaser.GameObjects.Rectangle
  private coinText!: Phaser.GameObjects.Text
  private waterFill!: Phaser.GameObjects.Rectangle
  private pokeballButton!: Phaser.GameObjects.Image
  private mobileButtons: Phaser.GameObjects.GameObject[] = []
  private bgmVolume = 0.35
  private bgmMuted = false
  private bgm?: Phaser.Sound.BaseSound
  private bgmStatusText!: Phaser.GameObjects.Text

  private setBgmMuteValue(muted: boolean): void {
    const soundWithSetMute = this.bgm as unknown as { setMute?: (value: boolean) => void }
    soundWithSetMute?.setMute?.(muted)
  }

  private setBgmVolumeValue(volume: number): void {
    const soundWithSetVolume = this.bgm as unknown as { setVolume?: (value: number) => void }
    soundWithSetVolume?.setVolume?.(volume)
  }

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

    this.createMobileControls()
    this.createBgmControls()
    this.setupBgm()

    this.game.events.on(EVENTS.heartChanged, this.onHeartsChanged, this)
    this.game.events.on(EVENTS.coinChanged, this.onCoinsChanged, this)
    this.game.events.on(EVENTS.pikachuRecruited, this.onPikachuRecruited, this)
    this.game.events.on(EVENTS.stageProgress, this.onStageProgress, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(EVENTS.heartChanged, this.onHeartsChanged, this)
      this.game.events.off(EVENTS.coinChanged, this.onCoinsChanged, this)
      this.game.events.off(EVENTS.pikachuRecruited, this.onPikachuRecruited, this)
      this.game.events.off(EVENTS.stageProgress, this.onStageProgress, this)
      this.mobileButtons.forEach((obj) => obj.destroy())
      this.mobileButtons = []
    })

    this.onHeartsChanged(this.registry.get(REGISTRY_KEYS.hearts) ?? STARTING_HEARTS)
    this.onCoinsChanged(this.registry.get(REGISTRY_KEYS.coins) ?? 0)
    if (this.registry.get(REGISTRY_KEYS.hasPikachu)) this.pokeballButton.setAlpha(1)
  }

  private requestPikachuAttack(): void {
    playSfx(this, SOUND_KEYS.uiClick, { volume: 0.35 })
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

  private createMobileControls(): void {
    this.input.addPointer(3)

    const createButton = (
      x: number,
      y: number,
      label: string,
      onDown: () => void,
      onUp: () => void,
      fillColor: number,
    ): void => {
      const bg = this.add.circle(x, y, 34, fillColor, 0.34).setScrollFactor(0).setDepth(100).setStrokeStyle(2, 0xffffff, 0.7)
      const text = this.add
        .text(x, y, label, { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(101)

      bg.setInteractive({ useHandCursor: true })
      bg.on('pointerdown', () => {
        bg.setAlpha(0.62)
        onDown()
      })
      bg.on('pointerup', () => {
        bg.setAlpha(0.34)
        onUp()
      })
      bg.on('pointerout', () => {
        bg.setAlpha(0.34)
        onUp()
      })

      this.mobileButtons.push(bg, text)
    }

    createButton(60, GAME_HEIGHT - 60, '←', () => this.game.events.emit(EVENTS.moveLeftDown), () => this.game.events.emit(EVENTS.moveLeftUp), 0x1e3a8a)
    createButton(140, GAME_HEIGHT - 60, '→', () => this.game.events.emit(EVENTS.moveRightDown), () => this.game.events.emit(EVENTS.moveRightUp), 0x1e3a8a)
    createButton(GAME_WIDTH - 150, GAME_HEIGHT - 60, '↑', () => this.game.events.emit(EVENTS.jumpDown), () => this.game.events.emit(EVENTS.jumpUp), 0x065f46)
  }

  private setupBgm(): void {
    const storedVolume = Number(this.registry.get(REGISTRY_KEYS.bgmVolume) ?? 0.35)
    const storedMuted = Boolean(this.registry.get(REGISTRY_KEYS.bgmMuted) ?? false)
    this.bgmVolume = Phaser.Math.Clamp(storedVolume, 0, 1)
    this.bgmMuted = storedMuted

    const existing = this.sound.get(SOUND_KEYS.bgm)
    if (existing) {
      this.bgm = existing
      this.setBgmVolumeValue(this.bgmVolume)
      this.setBgmMuteValue(this.bgmMuted)
      if (!this.bgm.isPlaying) {
        this.bgm.play({ loop: true, volume: this.bgmVolume })
      }
    } else {
      this.bgm = this.sound.add(SOUND_KEYS.bgm, { loop: true, volume: this.bgmVolume })
      this.setBgmMuteValue(this.bgmMuted)
      this.bgm.play()
    }

    this.updateBgmStatusText()
  }

  private createBgmControls(): void {
    const makeHudButton = (x: number, label: string, onClick: () => void): Phaser.GameObjects.Text => {
      const btn = this.add
        .text(x, 54, label, {
          fontSize: '16px',
          color: '#ffffff',
          backgroundColor: '#1b2a38',
          padding: { left: 6, right: 6, top: 3, bottom: 3 },
        })
        .setScrollFactor(0)
        .setDepth(102)
        .setInteractive({ useHandCursor: true })

      btn.on('pointerdown', () => {
        onClick()
      })
      return btn
    }

    makeHudButton(GAME_WIDTH - 210, '-', () => {
      this.setBgmVolume(this.bgmVolume - 0.1)
    })

    this.bgmStatusText = this.add
      .text(GAME_WIDTH - 184, 54, 'BGM 35%', {
        fontSize: '14px',
        color: '#cce8ff',
      })
      .setScrollFactor(0)
      .setDepth(102)

    makeHudButton(GAME_WIDTH - 110, '+', () => {
      this.setBgmVolume(this.bgmVolume + 0.1)
    })

    makeHudButton(GAME_WIDTH - 70, 'M', () => {
      this.bgmMuted = !this.bgmMuted
      this.registry.set(REGISTRY_KEYS.bgmMuted, this.bgmMuted)
      this.setBgmMuteValue(this.bgmMuted)
      this.updateBgmStatusText()
    })
  }

  private setBgmVolume(value: number): void {
    this.bgmVolume = Phaser.Math.Clamp(value, 0, 1)
    this.registry.set(REGISTRY_KEYS.bgmVolume, this.bgmVolume)
    this.setBgmVolumeValue(this.bgmVolume)
    this.updateBgmStatusText()
  }

  private updateBgmStatusText(): void {
    if (!this.bgmStatusText) return
    if (this.bgmMuted) {
      this.bgmStatusText.setText('BGM MUTE')
    } else {
      this.bgmStatusText.setText(`BGM ${Math.round(this.bgmVolume * 100)}%`)
    }
  }
}
