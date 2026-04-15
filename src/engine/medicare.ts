import type { FY, ResidencyStatus } from './types'

interface MedicareThresholds {
  lower: number   // no levy below this
  upper: number   // full 2% above this
  phaseInRate: number // 10¢ per $1 in phase-in band
}

const THRESHOLDS: Record<FY, MedicareThresholds> = {
  '2425': { lower: 27222, upper: 34027, phaseInRate: 0.10 },
  '2526': { lower: 29207, upper: 36509, phaseInRate: 0.10 },
}

export function calcMedicareLevy(income: number, residency: ResidencyStatus, fy: FY): number {
  // Only residents pay the Medicare Levy (WHM and non-residents are exempt)
  if (residency !== 'resident' || income <= 0) return 0

  const { lower, upper, phaseInRate } = THRESHOLDS[fy]

  if (income <= lower) return 0
  if (income <= upper) return (income - lower) * phaseInRate
  return income * 0.02
}

// Medicare Levy Surcharge — applies to those without adequate private hospital cover
// whose income for MLS purposes is above the relevant threshold.
// Using singles thresholds (family thresholds increase with dependents).
interface MLSBand {
  max: number
  rate: number
}

const MLS_SINGLE_BANDS: Record<FY, MLSBand[]> = {
  '2425': [
    { max: 97000,  rate: 0.000 },
    { max: 113000, rate: 0.010 },
    { max: 151000, rate: 0.0125 },
    { max: Infinity, rate: 0.015 },
  ],
  '2526': [
    { max: 101000, rate: 0.000 },
    { max: 118000, rate: 0.010 },
    { max: 158000, rate: 0.0125 },
    { max: Infinity, rate: 0.015 },
  ],
}

export function calcMedicareLevySurcharge(
  income: number,
  residency: ResidencyStatus,
  hasPrivateHealth: boolean,
  fy: FY,
): number {
  if (residency !== 'resident' || hasPrivateHealth || income <= 0) return 0
  const band = MLS_SINGLE_BANDS[fy].find((b) => income <= b.max)
  if (!band) return 0
  return income * band.rate
}
