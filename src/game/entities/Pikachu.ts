import Phaser from 'phaser'
import { ASSET_KEYS, PIKACHU } from '../constants'
import type { Player } from './Player'
import type { Enemy } from './Enemy'
import type { Boss } from './Boss'

function ensureAnims(scene: Phaser.Scene): void {
  if (scene.anims.exists('pikachu-walk')) return

  scene.anims.create({
    key: 'pikachu-walk',
    frames: scene.anims.generateFrameNumbers(ASSET_KEYS.pikachuWalk, { start: 0, end: 2 }),
    frameRate: 8,
    repeat: -1,
  })

  scene.anims.create({
    key: 'pikachu-attack',
    frames: scene.anims.generateFrameNumbers(ASSET_KEYS.pikachuAttack, { start: 0, end: 2 }),
    frameRate: 12,
    repeat: 0,
  })
}

export class Pikachu extends Phaser.Physics.Arcade.Sprite {
  recruited = false
  private attackReadyAt = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.pikachuWalk, 0)
    ensureAnims(scene)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setScale(0.5)
    this.setSize(70, 80)
    this.setOffset(15, 15)
    this.setDepth(9)
    this.setVisible(false)
    this.setActive(false)
    ;(this.body as Phaser.Physics.Arcade.Body).setEnable(false)
  }

  recruit(x: number, y: number): void {
    this.recruited = true
    this.setPosition(x, y)
    this.setVisible(true)
    this.setActive(true)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setEnable(true)
    body.setAllowGravity(false)
    this.play('pikachu-walk')
  }

  update(player: Player): void {
    if (!this.recruited) return

    const facing = player.facing
    const targetX = player.x - player.facing * PIKACHU.followOffsetX
    const targetY = player.y - 16
    const newX = Phaser.Math.Linear(this.x, targetX, PIKACHU.followLerp)
    const newY = Phaser.Math.Linear(this.y, targetY, PIKACHU.followLerp)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX((newX - this.x) * 10)
    body.setVelocityY((newY - this.y) * 10)
    this.setFlipX(facing < 0)

    if (Math.abs(body.velocity.x) > 5 || Math.abs(body.velocity.y) > 5) {
      this.play('pikachu-walk', true)
    } else {
      this.anims.stop()
      this.setFrame(0)
    }
  }

  canAttack(): boolean {
    return this.recruited && this.scene.time.now >= this.attackReadyAt
  }

  playAttack(targets: (Enemy | Boss)[]): void {
    if (!this.canAttack()) return

    this.attackReadyAt = this.scene.time.now + PIKACHU.attackCooldownMs
    this.play('pikachu-attack')
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (this.recruited) this.play('pikachu-walk')
    })

    const liveTargets = targets.filter((target) => target.active)
    const nearest = liveTargets
      .map((target) => ({ target, distance: Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) }))
      .sort((a, b) => a.distance - b.distance)[0]

    const facing = this.flipX ? -1 : 1
    const boltStartX = this.x + facing * 22
    const boltStartY = this.y - 6

    let boltEndX = boltStartX + facing * PIKACHU.projectileDistance
    let boltEndY = boltStartY

    if (nearest && nearest.distance <= PIKACHU.attackRange) {
      boltEndX = nearest.target.x
      boltEndY = nearest.target.y - 20
    }

    const bolt = this.scene.add
      .rectangle(boltStartX, boltStartY, 54, 16, 0xfff07a)
      .setDepth(12)
      .setRotation(Phaser.Math.Angle.Between(boltStartX, boltStartY, boltEndX, boltEndY))
      .setStrokeStyle(4, 0xffffff, 0.95)

    const boltGlow = this.scene.add
      .rectangle(boltStartX, boltStartY, 74, 26, 0xffd21f, 0.4)
      .setDepth(11)
      .setRotation(bolt.rotation)

    const sparkA = this.scene.add.circle(boltStartX, boltStartY, 5, 0xffffff, 0.85).setDepth(13)
    const sparkB = this.scene.add.circle(boltStartX, boltStartY, 4, 0xfff59d, 0.75).setDepth(13)

    const chooseImpactTarget = (): Enemy | Boss | undefined => {
      const boltPath = new Phaser.Geom.Line(boltStartX, boltStartY, boltEndX, boltEndY)
      const hitRadius = 76

      return targets
        .filter((target) => target.active)
        .filter((target) => (target.x - boltStartX) * facing >= -8)
        .map((target) => {
          const hitCircle = new Phaser.Geom.Circle(target.x, target.y - 20, hitRadius)
          const intersects = Phaser.Geom.Intersects.LineToCircle(boltPath, hitCircle)
          const forwardDistance = Math.max(0, (target.x - boltStartX) * facing)
          return { target, intersects, forwardDistance }
        })
        .filter((entry) => entry.intersects)
        .sort((a, b) => a.forwardDistance - b.forwardDistance)[0]?.target
    }

    this.scene.tweens.add({
      targets: [bolt, boltGlow, sparkA, sparkB],
      x: boltEndX,
      y: boltEndY,
      duration: 180,
      ease: 'Sine.easeOut',
      onComplete: () => {
        bolt.destroy()
        boltGlow.destroy()
        sparkA.destroy()
        sparkB.destroy()

        const hitTarget = chooseImpactTarget()
        if (hitTarget) {
          hitTarget.takeHit()
        }
      },
    })
  }
}
