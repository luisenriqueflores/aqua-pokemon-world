import { ASSET_KEYS } from '../constants'
import type { StageData } from './types'

const stage1: StageData = {
  key: 'stage1',
  displayName: 'Stage 1 — Grassy Shore',
  levelWidth: 2400,
  levelHeight: 540,
  groundTilesetKey: ASSET_KEYS.grassStone,
  groundTopFrame: 0,
  groundFillFrame: 2,
  groundY: 420,
  ground: [
    { x: 0, width: 700 },
    { x: 820, width: 600 },
    { x: 1540, width: 860 },
  ],
  platforms: [
    { x: 750, y: 390, scale: 0.5 },
    { x: 1470, y: 395, scale: 0.45 },
  ],
  enemies: [
    { type: 'slime', x: 420, y: 330, patrolDistance: 100 },
    { type: 'slime', x: 1050, y: 330, patrolDistance: 120 },
    { type: 'slime', x: 1750, y: 330, patrolDistance: 140 },
  ],
  coins: [
    { x: 300, y: 350 },
    { x: 760, y: 300 },
    { x: 1100, y: 350 },
    { x: 1480, y: 320 },
    { x: 2000, y: 350 },
  ],
  playerStart: { x: 100, y: 260 },
  pokeball: { x: 2250, y: 380 },
  nextStageKey: 'stage2',
}

export default stage1
