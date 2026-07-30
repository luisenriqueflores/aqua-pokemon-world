import stage1 from './stage1'
import stage2 from './stage2'
import stage3 from './stage3'
import type { StageData } from './types'

export const STAGES: Record<string, StageData> = {
  stage1,
  stage2,
  stage3,
}

export const STAGE_ORDER = ['stage1', 'stage2', 'stage3']

export function getStageByIndex(index: number): StageData {
  const key = STAGE_ORDER[index] ?? STAGE_ORDER[0]
  return STAGES[key]
}
