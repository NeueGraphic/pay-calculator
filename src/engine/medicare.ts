import type { FY } from './types'

interface MedicareThresholds {
  lower: number   // no levy below this
  upper: number   // full 2% above this
  phaseInRate: number // 10¢ per $1 in phase-in band
}

const THRESHOLDS: Record<FY, MedicareThresholds> = {
  '2425': { lower: 27222, upper: 34027, phaseInRate: 0.10 },
  '2526': { lower: 29207, upper: 36509, phaseInRate: 0.10 },
}

export function calcMedicareLevy(income: number, isResident: boolean, fy: FY): number {
  if (!isResident || income <= 0) return 0

  const { lower, upper, phaseInRate } = THRESHOLDS[fy]

  if (income <= lower) return 0
  if (income <= upper) return (income - lower) * phaseInRate
  return income * 0.02
}
