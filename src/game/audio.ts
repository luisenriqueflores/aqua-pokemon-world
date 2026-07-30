import Phaser from 'phaser'

export function playSfx(scene: Phaser.Scene, key: string, config?: Phaser.Types.Sound.SoundConfig): void {
  if (!scene.cache.audio.exists(key)) return
  scene.sound.play(key, config)
}
