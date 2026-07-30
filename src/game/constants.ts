// Central registry of asset keys, file paths and tunable gameplay constants.

const BASE = '/assets'

export const ASSET_KEYS = {
  nikeIdle: 'nike-idle',
  nikeRun: 'nike-run',
  pikachuWalk: 'pikachu-walk',
  pikachuAttack: 'pikachu-attack',
  slime: 'enemy-slime',
  crab: 'enemy-crab',
  jellyfish: 'enemy-jellyfish',
  boss: 'boss-villain',
  grassStone: 'tileset-grass-stone',
  coralSand: 'tileset-coral-sand',
  platformFloating: 'platform-floating',
  bgFar: 'bg-far',
  bgMid: 'bg-mid',
  bgNear: 'bg-near',
  coin: 'item-coin',
  goalGate: 'goal-gate',
  pokeballButton: 'pokeball-button',
  hearts: 'ui-hearts',
  waterMeter: 'ui-water-meter',
} as const

export const ASSET_PATHS: Record<string, string> = {
  [ASSET_KEYS.nikeIdle]: `${BASE}/characters/nike_idle_sheet.png`,
  [ASSET_KEYS.nikeRun]: `${BASE}/characters/nike_run_sheet.png`,
  [ASSET_KEYS.pikachuWalk]: `${BASE}/characters/pikachu_mega_zard_walk.png`,
  [ASSET_KEYS.pikachuAttack]: `${BASE}/characters/pikachu_mega_zard_attack.png`,
  [ASSET_KEYS.slime]: `${BASE}/enemies/enemy_slime_sheet.png`,
  [ASSET_KEYS.crab]: `${BASE}/enemies/enemy_crab_sheet.png`,
  [ASSET_KEYS.jellyfish]: `${BASE}/enemies/enemy_jellyfish_sheet.png`,
  [ASSET_KEYS.boss]: `${BASE}/enemies/boss_villain_idle.png`,
  [ASSET_KEYS.grassStone]: `${BASE}/environment/tileset_grass_stone.png`,
  [ASSET_KEYS.coralSand]: `${BASE}/environment/tileset_coral_sand.png`,
  [ASSET_KEYS.platformFloating]: `${BASE}/environment/platform_floating.png`,
  [ASSET_KEYS.bgFar]: `${BASE}/environment/bg_parallax_far_lapras.png`,
  [ASSET_KEYS.bgMid]: `${BASE}/environment/bg_parallax_mid_islands.png`,
  [ASSET_KEYS.bgNear]: `${BASE}/environment/bg_parallax_near_coral.png`,
  [ASSET_KEYS.coin]: `${BASE}/ui/item_aqua_coin.png`,
  [ASSET_KEYS.goalGate]: `${BASE}/ui/goal_coral_gate.png`,
  [ASSET_KEYS.pokeballButton]: `${BASE}/ui/ui_pokeball_button.png`,
  [ASSET_KEYS.hearts]: `${BASE}/ui/ui_health_hearts.png`,
  [ASSET_KEYS.waterMeter]: `${BASE}/ui/ui_water_meter.png`,
}

// Frame sizes measured from the real PNG dimensions (see repo memory).
// Some sheets aren't perfectly divisible by the visual frame count; the
// leftover pixels (a few px) are simply not included in the last frame.
export const FRAME_SIZES = {
  nike: { frameWidth: 174, frameHeight: 266 }, // 698x266, 4 frames
  pikachu: { frameWidth: 200, frameHeight: 200 }, // 600x200, 3 frames
  slime: { frameWidth: 192, frameHeight: 148 }, // 576x148, 3 frames (use 0-1)
  crab: { frameWidth: 142, frameHeight: 160 }, // 568x160, 4 frames (use 0-1)
  jellyfish: { frameWidth: 184, frameHeight: 166 }, // 552x166, 3 frames (use all)
  grassStone: { frameWidth: 170, frameHeight: 153 }, // 340x306, 2x2 grid
  coralSand: { frameWidth: 169, frameHeight: 147 }, // 338x294, 2x2 grid
} as const

// Tileset frame indices: top row = grass/coral, bottom row = stone/sand.
export const TILE_FRAMES = {
  grassTop: 0,
  stoneFill: 2,
  coralTop: 0,
  sandFill: 2,
} as const

export const REGISTRY_KEYS = {
  hearts: 'hearts',
  coins: 'coins',
  hasPikachu: 'hasPikachu',
  stageIndex: 'stageIndex',
  stageCoinsTotal: 'stageCoinsTotal',
  stageCoinsCollected: 'stageCoinsCollected',
} as const

export const EVENTS = {
  heartChanged: 'heart-changed',
  coinChanged: 'coin-changed',
  pikachuRecruited: 'pikachu-recruited',
  pikachuAttackRequest: 'pikachu-attack-request',
  stageProgress: 'stage-progress',
} as const

export const GAME_WIDTH = 960
export const GAME_HEIGHT = 540

export const PHYSICS = {
  gravityY: 900,
  playerSpeed: 200,
  playerJumpVelocity: -480,
  stompBounceVelocity: -260,
  enemyContactDamage: 1,
  playerInvulnerabilityMs: 1200,
  knockbackVelocity: 220,
} as const

export const PIKACHU = {
  followOffsetX: 56,
  followLerp: 0.08,
  attackCooldownMs: 900,
  attackRange: 420,
  projectileDistance: 460,
} as const

export const ENEMY_CONFIGS = {
  slime: {
    textureKey: ASSET_KEYS.slime,
    animKey: 'slime-walk',
    walkFrames: [0, 1],
    frameRate: 4,
    speed: 40,
    allowGravity: true,
  },
  crab: {
    textureKey: ASSET_KEYS.crab,
    animKey: 'crab-walk',
    walkFrames: [0, 1],
    frameRate: 4,
    speed: 55,
    allowGravity: true,
  },
  jellyfish: {
    textureKey: ASSET_KEYS.jellyfish,
    animKey: 'jellyfish-float',
    walkFrames: [0, 1, 2],
    frameRate: 5,
    speed: 30,
    allowGravity: false,
  },
} as const

export type EnemyType = keyof typeof ENEMY_CONFIGS

export const BOSS = {
  maxHp: 3,
  contactDamageCooldownMs: 800,
} as const

export const STARTING_HEARTS = 3

export const GROUND_TOP_HEIGHT = 40
