import type { EnemyType } from '../constants'

export interface Vec2 {
  x: number
  y: number
}

export interface GroundSegment {
  x: number
  width: number
}

export interface PlatformDef {
  x: number
  y: number
  scale: number
}

export interface EnemySpawn {
  type: EnemyType
  x: number
  y: number
  patrolDistance: number
}

export interface CoinSpawn {
  x: number
  y: number
}

export interface BossConfig {
  x: number
  y: number
}

export interface StageData {
  key: string
  displayName: string
  levelWidth: number
  levelHeight: number
  groundTilesetKey: string
  groundTopFrame: number
  groundFillFrame: number
  groundY: number
  ground: GroundSegment[]
  platforms: PlatformDef[]
  enemies: EnemySpawn[]
  coins: CoinSpawn[]
  playerStart: Vec2
  pokeball?: Vec2
  boss?: BossConfig
  bossBlockerX?: number
  goal?: Vec2
  nextStageKey?: string
  isFinalStage?: boolean
}
