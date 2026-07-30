import Phaser from 'phaser'
import { ENEMY_CONFIGS, type EnemyType } from '../constants'

function ensureAnim(scene: Phaser.Scene, type: EnemyType): void {
  const config = ENEMY_CONFIGS[type]
  if (scene.anims.exists(config.animKey)) return

  scene.anims.create({
    key: config.animKey,
    frames: config.walkFrames.map((frame) => ({ key: config.textureKey, frame })),
    frameRate: config.frameRate,
    repeat: -1,
  })
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  readonly contactDamage = 1
  readonly enemyType: EnemyType
  private direction: 1 | -1 = 1
  private readonly spawnX: number
  private readonly spawnY: number
  private readonly patrolDistance: number
  private readonly speed: number
  private readonly allowGravity: boolean
  private dead = false

  constructor(scene: Phaser.Scene, x: number, y: number, type: EnemyType, patrolDistance: number) {
    const config = ENEMY_CONFIGS[type]
    super(scene, x, y, config.textureKey, config.walkFrames[0])
    ensureAnim(scene, type)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.enemyType = type
    this.spawnX = x
    this.spawnY = y
    this.patrolDistance = patrolDistance
    this.speed = config.speed
    this.allowGravity = config.allowGravity
    this.setDepth(8)

    const body = this.body as Phaser.Physics.Arcade.Body
    if (type === 'slime') {
      body.setSize(132, 92)
      body.setOffset(30, 56)
    } else if (type === 'crab') {
      body.setSize(116, 86)
      body.setOffset(12, 68)
    } else {
      body.setSize(116, 108)
      body.setOffset(34, 46)
    }
    body.setAllowGravity(config.allowGravity)
    if (!config.allowGravity) {
      body.setImmovable(true)
      body.pushable = false
      body.setVelocityY(0)
    }
    body.setVelocityX(this.speed)
    this.play(config.animKey)
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
    if (this.dead) return

    if (this.x >= this.spawnX + this.patrolDistance) {
      this.direction = -1
    } else if (this.x <= this.spawnX - this.patrolDistance) {
      this.direction = 1
    }

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(this.speed * this.direction)

    if (!this.allowGravity) {
      body.setVelocityY(0)
      this.y = this.spawnY + Math.sin(time * 0.004 + this.spawnX * 0.01) * 6
      body.y = this.y - body.halfHeight
    }

    this.setFlipX(this.direction < 0)
  }

  takeHit(): void {
    if (this.dead) return
    this.dead = true

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setEnable(false)

    this.scene.tweens.add({
      targets: this,
      scale: 0,
      alpha: 0,
      angle: 90,
      duration: 250,
      onComplete: () => this.destroy(),
    })
  }

  get isDead(): boolean {
    return this.dead
  }
}
