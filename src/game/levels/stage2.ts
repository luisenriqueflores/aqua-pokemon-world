import { ASSET_KEYS } from '../constants'
import type { StageData } from './types'

const stage2: StageData = {
  key: 'stage2',
  displayName: 'Stage 2 — Coral Reef',
  levelWidth: 2800,
  levelHeight: 540,
  groundTilesetKey: ASSET_KEYS.coralSand,
  groundTopFrame: 0,
  groundFillFrame: 2,
  groundY: 420,
  ground: [
    { x: 0, width: 500 },
    { x: 640, width: 460 },
    { x: 1220, width: 500 },
    { x: 1840, width: 460 },
    { x: 2420, width: 380 },
  ],
  platforms: [
    { x: 570, y: 392, scale: 0.45 },
    { x: 1130, y: 388, scale: 0.5 },
    { x: 1750, y: 396, scale: 0.45 },
    { x: 2320, y: 390, scale: 0.4 },
  ],
  enemies: [
    { type: 'crab', x: 300, y: 330, patrolDistance: 100 },
    { type: 'jellyfish', x: 900, y: 280, patrolDistance: 160 },
    { type: 'crab', x: 1400, y: 330, patrolDistance: 120 },
    { type: 'jellyfish', x: 1950, y: 260, patrolDistance: 180 },
    { type: 'crab', x: 2500, y: 330, patrolDistance: 100 },
  ],
  coins: [
    { x: 260, y: 340 },
    { x: 700, y: 300 },
    { x: 1260, y: 250 },
    { x: 1780, y: 300 },
    { x: 2100, y: 350 },
    { x: 2600, y: 340 },
  ],
  playerStart: { x: 100, y: 260 },
  nextStageKey: 'stage3',
}

export default stage2
