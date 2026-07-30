import Phaser from 'phaser'
import { ASSET_KEYS, ASSET_PATHS, FRAME_SIZES, GAME_HEIGHT, GAME_WIDTH, SOUND_PATHS } from '../constants'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload(): void {
    const barWidth = 400
    const barHeight = 28
    const barX = GAME_WIDTH / 2 - barWidth / 2
    const barY = GAME_HEIGHT / 2 - barHeight / 2

    this.add
      .text(GAME_WIDTH / 2, barY - 40, 'Aqua Pokémon World', { fontSize: '28px', color: '#ffffff' })
      .setOrigin(0.5)

    const outline = this.add.graphics()
    outline.lineStyle(2, 0xffffff, 1)
    outline.strokeRect(barX, barY, barWidth, barHeight)

    const fill = this.add.graphics()

    this.load.on('progress', (value: number) => {
      fill.clear()
      fill.fillStyle(0x4fd1ff, 1)
      fill.fillRect(barX + 2, barY + 2, (barWidth - 4) * value, barHeight - 4)
    })

    // Static images
    this.load.image(ASSET_KEYS.boss, ASSET_PATHS[ASSET_KEYS.boss])
    this.load.image(ASSET_KEYS.bgFar, ASSET_PATHS[ASSET_KEYS.bgFar])
    this.load.image(ASSET_KEYS.bgMid, ASSET_PATHS[ASSET_KEYS.bgMid])
    this.load.image(ASSET_KEYS.bgNear, ASSET_PATHS[ASSET_KEYS.bgNear])
    this.load.image(ASSET_KEYS.platformFloating, ASSET_PATHS[ASSET_KEYS.platformFloating])
    this.load.image(ASSET_KEYS.coin, ASSET_PATHS[ASSET_KEYS.coin])
    this.load.image(ASSET_KEYS.goalGate, ASSET_PATHS[ASSET_KEYS.goalGate])
    this.load.image(ASSET_KEYS.pokeballButton, ASSET_PATHS[ASSET_KEYS.pokeballButton])
    this.load.image(ASSET_KEYS.waterMeter, ASSET_PATHS[ASSET_KEYS.waterMeter])

    // Spritesheets
    this.load.spritesheet(ASSET_KEYS.nikeIdle, ASSET_PATHS[ASSET_KEYS.nikeIdle], FRAME_SIZES.nike)
    this.load.spritesheet(ASSET_KEYS.nikeRun, ASSET_PATHS[ASSET_KEYS.nikeRun], FRAME_SIZES.nike)
    this.load.spritesheet(ASSET_KEYS.pikachuWalk, ASSET_PATHS[ASSET_KEYS.pikachuWalk], FRAME_SIZES.pikachu)
    this.load.spritesheet(ASSET_KEYS.pikachuAttack, ASSET_PATHS[ASSET_KEYS.pikachuAttack], FRAME_SIZES.pikachu)
    this.load.spritesheet(ASSET_KEYS.slime, ASSET_PATHS[ASSET_KEYS.slime], FRAME_SIZES.slime)
    this.load.spritesheet(ASSET_KEYS.crab, ASSET_PATHS[ASSET_KEYS.crab], FRAME_SIZES.crab)
    this.load.spritesheet(ASSET_KEYS.jellyfish, ASSET_PATHS[ASSET_KEYS.jellyfish], FRAME_SIZES.jellyfish)
    this.load.spritesheet(ASSET_KEYS.grassStone, ASSET_PATHS[ASSET_KEYS.grassStone], FRAME_SIZES.grassStone)
    this.load.spritesheet(ASSET_KEYS.coralSand, ASSET_PATHS[ASSET_KEYS.coralSand], FRAME_SIZES.coralSand)
    this.load.spritesheet(ASSET_KEYS.hearts, ASSET_PATHS[ASSET_KEYS.hearts], { frameWidth: 100, frameHeight: 106 })

    for (const [key, path] of Object.entries(SOUND_PATHS)) {
      this.load.audio(key, path)
    }
  }

  create(): void {
    this.scene.start('MenuScene')
  }
}
