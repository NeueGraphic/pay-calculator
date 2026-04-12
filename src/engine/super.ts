import type { FY } from './types'

const SG_RATES: Record<FY, number> = {
  '2425': 0.115, // 11.5%
  '2526': 0.120, // 12.0%
}

export function calcSuperSG(grossAnnual: number, fy: FY): number {
  return grossAnnual * SG_RATES[fy]
}

export function getSGRate(fy: FY): number {
  return SG_RATES[fy] * 100
}
