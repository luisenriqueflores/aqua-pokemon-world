import Phaser from 'phaser'
import { ASSET_KEYS, ENEMY_CONFIGS, EVENTS, GAME_HEIGHT, GAME_WIDTH, GROUND_TOP_HEIGHT, PHYSICS, REGISTRY_KEYS } from '../constants'
import { Player } from '../entities/Player'
import { Pikachu } from '../entities/Pikachu'
import { Enemy } from '../entities/Enemy'
import { Boss } from '../entities/Boss'
import type { StageData } from '../levels/types'

interface ParallaxLayer {
  sprite: Phaser.GameObjects.TileSprite
  factor: number
}

export class LevelScene extends Phaser.Scene {
  private stageData!: StageData
  private player!: Player
  private pikachu!: Pikachu
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: Record<'left' | 'right' | 'jump', Phaser.Input.Keyboard.Key>
  private enemiesGroup!: Phaser.Physics.Arcade.Group
  private boss?: Boss
  private bgLayers: ParallaxLayer[] = []
  private transitioning = false

  constructor() {
    super('LevelScene')
  }

  init(data: StageData): void {
    this.stageData = data
    this.transitioning = false
    this.boss = undefined
    this.bgLayers = []
  }

  create(): void {
    const data = this.stageData
    this.physics.world.setBounds(0, 0, data.levelWidth, data.levelHeight)
    this.cameras.main.setBounds(0, 0, data.levelWidth, data.levelHeight)
    this.cameras.main.setBackgroundColor('#062b3d')

    this.createParallax()
    const groundGroup = this.createGround()
    const platformGroup = this.createPlatforms()

    this.player = new Player(this, data.playerStart.x, data.playerStart.y)
    this.pikachu = new Pikachu(this, data.playerStart.x - 40, data.playerStart.y)

    this.physics.add.collider(this.player, groundGroup)
    this.physics.add.collider(this.player, platformGroup)

    if (this.registry.get(REGISTRY_KEYS.hasPikachu)) {
      this.pikachu.recruit(data.playerStart.x - 40, data.playerStart.y)
    }

    this.createCoins()
    this.createPokeball()
    this.createEnemies(groundGroup, platformGroup)
    this.createBossAndGoal()
    this.createStageEndTrigger()

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      jump: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    }

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setDeadzone(120, 200)

    this.game.events.on(EVENTS.pikachuAttackRequest, this.onPikachuAttackRequest, this)
    this.game.events.on(EVENTS.heartChanged, this.onHeartChanged, this)
    if (this.scene.isActive('UIScene')) {
      this.scene.bringToTop('UIScene')
    }
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(EVENTS.pikachuAttackRequest, this.onPikachuAttackRequest, this)
      this.game.events.off(EVENTS.heartChanged, this.onHeartChanged, this)
    })
  }

  update(): void {
    for (const layer of this.bgLayers) {
      layer.sprite.tilePositionX = this.cameras.main.scrollX * layer.factor
    }
    this.player.update(this.cursors, this.wasd)
    this.pikachu.update(this.player)
  }

  private createParallax(): void {
    const far = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, ASSET_KEYS.bgFar).setOrigin(0, 0).setScrollFactor(0).setDepth(-3)
    const mid = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, ASSET_KEYS.bgMid).setOrigin(0, 0).setScrollFactor(0).setDepth(-2)
    const near = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, ASSET_KEYS.bgNear).setOrigin(0, 0).setScrollFactor(0).setDepth(-1)
    this.bgLayers = [
      { sprite: far, factor: 0.2 },
      { sprite: mid, factor: 0.5 },
      { sprite: near, factor: 0.8 },
    ]
  }

  private createGround(): Phaser.Physics.Arcade.StaticGroup {
    const data = this.stageData
    const group = this.physics.add.staticGroup()

    for (const seg of data.ground) {
      this.add
        .tileSprite(seg.x, data.groundY, seg.width, GROUND_TOP_HEIGHT, data.groundTilesetKey, data.groundTopFrame)
        .setOrigin(0, 0)
        .setDepth(1)

      const fillHeight = data.levelHeight - data.groundY - GROUND_TOP_HEIGHT
      if (fillHeight > 0) {
        this.add
          .tileSprite(seg.x, data.groundY + GROUND_TOP_HEIGHT, seg.width, fillHeight, data.groundTilesetKey, data.groundFillFrame)
          .setOrigin(0, 0)
          .setDepth(1)
      }

      const collider = this.add.rectangle(seg.x, data.groundY, seg.width, data.levelHeight - data.groundY, 0xffffff, 0).setOrigin(0, 0)
      this.physics.add.existing(collider, true)
      group.add(collider)
    }

    return group
  }

  private createPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    const group = this.physics.add.staticGroup()
    for (const p of this.stageData.platforms) {
      const platform = this.physics.add.staticImage(p.x, p.y, ASSET_KEYS.platformFloating).setScale(p.scale)
      platform.refreshBody()
      group.add(platform)
    }
    return group
  }

  private createCoins(): void {
    const data = this.stageData
    this.registry.set(REGISTRY_KEYS.stageCoinsTotal, data.coins.length)
    this.registry.set(REGISTRY_KEYS.stageCoinsCollected, 0)
    this.game.events.emit(EVENTS.stageProgress, 0)

    const coinsGroup = this.physics.add.group({ allowGravity: false })
    for (const c of data.coins) {
      const coin = coinsGroup.create(c.x, c.y, ASSET_KEYS.coin) as Phaser.Physics.Arcade.Sprite
      coin.setScale(0.22)
      ;(coin.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
      this.tweens.add({ targets: coin, y: c.y - 10, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }

    this.physics.add.overlap(this.player, coinsGroup, (_player, coinObj) => {
      coinObj.destroy()
      const coins = (this.registry.get(REGISTRY_KEYS.coins) ?? 0) + 1
      const collected = (this.registry.get(REGISTRY_KEYS.stageCoinsCollected) ?? 0) + 1
      const total = this.registry.get(REGISTRY_KEYS.stageCoinsTotal) ?? 1
      this.registry.set(REGISTRY_KEYS.coins, coins)
      this.registry.set(REGISTRY_KEYS.stageCoinsCollected, collected)
      this.game.events.emit(EVENTS.coinChanged, coins)
      this.game.events.emit(EVENTS.stageProgress, collected / total)
    })
  }

  private createPokeball(): void {
    const data = this.stageData
    if (!data.pokeball || this.registry.get(REGISTRY_KEYS.hasPikachu)) return

    const pokeball = this.physics.add.staticImage(data.pokeball.x, data.pokeball.y, ASSET_KEYS.pokeballButton).setScale(0.3)
    this.tweens.add({ targets: pokeball, y: data.pokeball.y - 12, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })

    this.physics.add.overlap(this.player, pokeball, () => {
      pokeball.destroy()
      this.registry.set(REGISTRY_KEYS.hasPikachu, true)
      this.pikachu.recruit(this.player.x - 40, this.player.y)
      this.game.events.emit(EVENTS.pikachuRecruited)
    })
  }

  private createEnemies(groundGroup: Phaser.Physics.Arcade.StaticGroup, platformGroup: Phaser.Physics.Arcade.StaticGroup): void {
    this.enemiesGroup = this.physics.add.group()

    for (const spawn of this.stageData.enemies) {
      const enemy = new Enemy(this, spawn.x, spawn.y, spawn.type, spawn.patrolDistance)
      this.enemiesGroup.add(enemy)
      if (ENEMY_CONFIGS[spawn.type].allowGravity) {
        this.physics.add.collider(enemy, groundGroup)
        this.physics.add.collider(enemy, platformGroup)
      }
    }

    this.physics.add.collider(this.player, this.enemiesGroup, (playerObj, enemyObj) => {
      const enemy = enemyObj as Enemy
      if (enemy.isDead) return
      const playerBody = (playerObj as Player).body as Phaser.Physics.Arcade.Body
      const enemyBody = enemy.body as Phaser.Physics.Arcade.Body
      const fromTopContact = playerBody.touching.down && enemyBody.touching.up
      const fallingNearTop = (playerBody.velocity.y > 0 || playerBody.deltaY() > 0) && playerBody.bottom <= enemyBody.top + 18
      const landedOnTop = fromTopContact || fallingNearTop

      if (landedOnTop) {
        enemy.takeHit()
        playerBody.setVelocityY(PHYSICS.stompBounceVelocity)
      } else {
        const dir = (playerObj as Player).x < enemy.x ? -1 : 1
        this.player.takeDamage(this.registry, this.game, dir)
      }
    })
  }

  private createBossAndGoal(): void {
    const data = this.stageData
    let blocker: Phaser.GameObjects.Rectangle | undefined

    if (data.boss) {
      this.boss = new Boss(this, data.boss.x, data.boss.y, () => {
        blocker?.destroy()
      })

      this.physics.add.collider(this.player, this.boss, () => {
        if (!this.boss || this.boss.isDefeated) return
        const dir = this.player.x < this.boss.x ? -1 : 1
        this.player.takeDamage(this.registry, this.game, dir)
      })
    }

    if (data.bossBlockerX !== undefined) {
      blocker = this.add.rectangle(data.bossBlockerX, 0, 24, data.levelHeight, 0xffffff, 0).setOrigin(0, 0)
      this.physics.add.existing(blocker, true)
      this.physics.add.collider(this.player, blocker)
    }

    if (data.goal) {
      const goal = this.physics.add.staticImage(data.goal.x, data.goal.y, ASSET_KEYS.goalGate).setScale(0.45).setOrigin(0.5, 1)
      goal.refreshBody()
      this.physics.add.overlap(this.player, goal, () => {
        if (this.transitioning) return
        this.transitioning = true
        this.scene.start('WinScene')
      })
    }
  }


  private createStageEndTrigger(): void {
    const data = this.stageData
    if (data.isFinalStage || !data.nextStageKey) return

    const zone = this.add.zone(data.levelWidth - 40, 0, 40, data.levelHeight).setOrigin(0, 0)
    this.physics.add.existing(zone, true)

    this.physics.add.overlap(this.player, zone, () => {
      if (this.transitioning) return
      this.transitioning = true
      const stageIndex = this.registry.get(REGISTRY_KEYS.stageIndex) ?? 0
      this.scene.start('StageClearScene', { clearedStageIndex: stageIndex })
    })
  }

  private onPikachuAttackRequest = (): void => {
    if (!this.pikachu.recruited) return
    const targets: (Enemy | Boss)[] = [...(this.enemiesGroup.getChildren() as Enemy[])]
    if (this.boss) targets.push(this.boss)
    this.pikachu.playAttack(targets)
  }

  private onHeartChanged = (hearts: number): void => {
    if (hearts <= 0 && !this.transitioning) {
      this.transitioning = true
      this.scene.start('GameOverScene', { stageData: this.stageData })
    }
  }
}
