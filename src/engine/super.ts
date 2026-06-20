import type { FY } from './types'

const SG_RATES: Record<FY, number> = {
  '2425': 0.115, // 11.5%
  '2526': 0.120, // 12.0%
}

export function calcSuperSG(baseSalary: number, fy: FY): number {
  return baseSalary * SG_RATES[fy]
}

export function getSGRate(fy: FY): number {
  return SG_RATES[fy] * 100
}

/**
 * Split a "package includes super" amount into base salary + SG super.
 * package = base + base * sgRate  →  base = package / (1 + sgRate)
 */
export function splitPackageIncludingSuper(
  packageAmount: number,
  fy: FY,
): { baseSalary: number; superSG: number } {
  const rate = SG_RATES[fy]
  const baseSalary = packageAmount / (1 + rate)
  const superSG = packageAmount - baseSalary
  return { baseSalary, superSG }
}
