import { ASSET_KEYS } from '../constants'
import type { StageData } from './types'

const stage3: StageData = {
  key: 'stage3',
  displayName: 'Stage 3 — Villain\u2019s Arena',
  levelWidth: 1900,
  levelHeight: 540,
  groundTilesetKey: ASSET_KEYS.coralSand,
  groundTopFrame: 0,
  groundFillFrame: 2,
  groundY: 420,
  ground: [{ x: 0, width: 1900 }],
  platforms: [
    { x: 500, y: 392, scale: 0.45 },
    { x: 950, y: 388, scale: 0.5 },
  ],
  enemies: [
    { type: 'jellyfish', x: 650, y: 280, patrolDistance: 140 },
    { type: 'crab', x: 1000, y: 330, patrolDistance: 100 },
  ],
  coins: [
    { x: 300, y: 350 },
    { x: 550, y: 280 },
    { x: 1000, y: 260 },
  ],
  playerStart: { x: 100, y: 260 },
  boss: { x: 1450, y: 420 },
  bossBlockerX: 1560,
  goal: { x: 1780, y: 420 },
  isFinalStage: true,
}

export default stage3
