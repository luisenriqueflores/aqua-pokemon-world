import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, REGISTRY_KEYS, SOUND_KEYS } from '../constants'
import { getStageByIndex } from '../levels'
import { playSfx } from '../audio'

interface StageClearData {
  clearedStageIndex: number
}

export class StageClearScene extends Phaser.Scene {
  constructor() {
    super('StageClearScene')
  }

  create(data: StageClearData): void {
    this.cameras.main.setBackgroundColor('#04263d')
    playSfx(this, SOUND_KEYS.stageClear, { volume: 0.7 })

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `Stage ${data.clearedStageIndex + 1} Complete!`, {
        fontSize: '40px',
        color: '#ffe066',
      })
      .setOrigin(0.5)

    const nextIndex = data.clearedStageIndex + 1
    this.time.delayedCall(1500, () => {
      this.registry.set(REGISTRY_KEYS.stageIndex, nextIndex)
      this.scene.start('LevelScene', getStageByIndex(nextIndex))
    })
  }
}
