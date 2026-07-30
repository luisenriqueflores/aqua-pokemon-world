import Phaser from 'phaser'
import { ASSET_KEYS, PHYSICS, REGISTRY_KEYS } from '../constants'

function ensureAnims(scene: Phaser.Scene): void {
  if (scene.anims.exists('nike-idle')) return

  scene.anims.create({
    key: 'nike-idle',
    frames: scene.anims.generateFrameNumbers(ASSET_KEYS.nikeIdle, { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1,
  })

  scene.anims.create({
    key: 'nike-run',
    frames: scene.anims.generateFrameNumbers(ASSET_KEYS.nikeRun, { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  })
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  facing: 1 | -1 = 1
  private invulnerable = false
  private invulnerableUntil = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.nikeIdle, 0)
    ensureAnims(scene)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setSize(90, 220)
    this.setOffset(42, 40)
    this.setCollideWorldBounds(false)
    this.setDepth(10)
    this.play('nike-idle')
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasd: Record<'left' | 'right' | 'jump', Phaser.Input.Keyboard.Key>): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    const time = this.scene.time.now

    if (this.invulnerable && time > this.invulnerableUntil) {
      this.invulnerable = false
      this.clearAlpha()
      this.setAlpha(1)
    }

    const movingLeft = cursors.left.isDown || wasd.left.isDown
    const movingRight = cursors.right.isDown || wasd.right.isDown
    const wantsJump = cursors.up.isDown || wasd.jump.isDown

    if (movingLeft) {
      body.setVelocityX(-PHYSICS.playerSpeed)
      this.facing = -1
      this.setFlipX(true)
    } else if (movingRight) {
      body.setVelocityX(PHYSICS.playerSpeed)
      this.facing = 1
      this.setFlipX(false)
    } else {
      body.setVelocityX(0)
    }

    const onGround = body.blocked.down || body.touching.down
    if (wantsJump && onGround) {
      body.setVelocityY(PHYSICS.playerJumpVelocity)
    }

    if (!onGround) {
      // airborne: keep current anim frame progression via run/idle, no dedicated jump art available
    } else if (movingLeft || movingRight) {
      this.play('nike-run', true)
    } else {
      this.play('nike-idle', true)
    }
  }

  isStomping(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body
    return body.velocity.y > 40
  }

  takeDamage(registry: Phaser.Data.DataManager, game: Phaser.Game, knockbackDir: number): void {
    if (this.invulnerable) return

    const hearts = Math.max(0, (registry.get(REGISTRY_KEYS.hearts) ?? 0) - 1)
    registry.set(REGISTRY_KEYS.hearts, hearts)
    game.events.emit('heart-changed', hearts)

    this.invulnerable = true
    this.invulnerableUntil = this.scene.time.now + PHYSICS.playerInvulnerabilityMs
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocity(knockbackDir * PHYSICS.knockbackVelocity, -220)

    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 5,
    })
  }
}
