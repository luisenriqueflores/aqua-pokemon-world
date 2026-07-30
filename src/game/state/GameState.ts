import Phaser from 'phaser'
import { REGISTRY_KEYS, STARTING_HEARTS } from '../constants'

/** Thin helpers around Phaser's shared game registry (persists across all scenes). */
export function resetGameState(registry: Phaser.Data.DataManager): void {
  registry.set(REGISTRY_KEYS.hearts, STARTING_HEARTS)
  registry.set(REGISTRY_KEYS.coins, 0)
  registry.set(REGISTRY_KEYS.hasPikachu, false)
  registry.set(REGISTRY_KEYS.stageIndex, 0)
  registry.set(REGISTRY_KEYS.stageCoinsTotal, 0)
  registry.set(REGISTRY_KEYS.stageCoinsCollected, 0)
}

export function getHearts(registry: Phaser.Data.DataManager): number {
  return registry.get(REGISTRY_KEYS.hearts) ?? STARTING_HEARTS
}

export function getCoins(registry: Phaser.Data.DataManager): number {
  return registry.get(REGISTRY_KEYS.coins) ?? 0
}

export function hasPikachu(registry: Phaser.Data.DataManager): boolean {
  return registry.get(REGISTRY_KEYS.hasPikachu) ?? false
}
