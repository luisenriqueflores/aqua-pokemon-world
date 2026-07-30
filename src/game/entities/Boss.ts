import Phaser from 'phaser'
import { ASSET_KEYS, BOSS, SOUND_KEYS } from '../constants'
import { playSfx } from '../audio'

export class Boss extends Phaser.Physics.Arcade.Sprite {
  hp = BOSS.maxHp
  private defeated = false
  private lastContactAt = 0
  private readonly onDefeated: () => void

  constructor(scene: Phaser.Scene, x: number, y: number, onDefeated: () => void) {
    super(scene, x, y, ASSET_KEYS.boss)
    this.onDefeated = onDefeated

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setImmovable(true)
    this.setOrigin(0.5, 1)
    this.setScale(0.55)
    this.setDepth(8)

    scene.tweens.add({
      targets: this,
      scaleY: 0.96,
      scaleX: 1.03,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  canBeHitAgain(): boolean {
    return this.scene.time.now - this.lastContactAt > BOSS.contactDamageCooldownMs
  }

  markContact(): void {
    this.lastContactAt = this.scene.time.now
  }

  takeHit(): void {
    if (this.defeated) return
    this.hp -= 1
    playSfx(this.scene, SOUND_KEYS.bossHit, { volume: 0.65 })
    this.setTint(0xffffff)
    this.scene.cameras.main.shake(150, 0.01)
    this.scene.time.delayedCall(120, () => this.clearTint())

    if (this.hp <= 0) {
      this.defeated = true
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setEnable(false)
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scale: 0.2,
        duration: 500,
        onComplete: () => {
          this.onDefeated()
          this.destroy()
        },
      })
    }
  }

  get isDefeated(): boolean {
    return this.defeated
  }
}
