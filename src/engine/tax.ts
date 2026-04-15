import type { ResidencyStatus } from './types'

interface TaxBracket {
  min: number
  max: number
  rate: number
  base: number // tax on income at min
}

// Stage 3 brackets — same for FY24-25 and FY25-26
const RESIDENT_BRACKETS: TaxBracket[] = [
  { min: 0,       max: 18200,   rate: 0.00, base: 0 },
  { min: 18201,   max: 45000,   rate: 0.16, base: 0 },
  { min: 45001,   max: 135000,  rate: 0.30, base: 4288 },
  { min: 135001,  max: 190000,  rate: 0.37, base: 31288 },
  { min: 190001,  max: Infinity, rate: 0.45, base: 51638 },
]

// Non-resident brackets (no tax-free threshold, no LITO)
const NON_RESIDENT_BRACKETS: TaxBracket[] = [
  { min: 0,       max: 135000,  rate: 0.30, base: 0 },
  { min: 135001,  max: 190000,  rate: 0.37, base: 40500 },
  { min: 190001,  max: Infinity, rate: 0.45, base: 60850 },
]

// Working Holiday Maker brackets (subclass 417/462 visa holders)
const WORKING_HOLIDAY_BRACKETS: TaxBracket[] = [
  { min: 0,       max: 45000,   rate: 0.15, base: 0 },
  { min: 45001,   max: 135000,  rate: 0.30, base: 6750 },
  { min: 135001,  max: 190000,  rate: 0.37, base: 33750 },
  { min: 190001,  max: Infinity, rate: 0.45, base: 54100 },
]

function getBrackets(residency: ResidencyStatus): TaxBracket[] {
  switch (residency) {
    case 'resident':
      return RESIDENT_BRACKETS
    case 'non-resident':
      return NON_RESIDENT_BRACKETS
    case 'working-holiday':
      return WORKING_HOLIDAY_BRACKETS
  }
}

export function calcRawIncomeTax(income: number, residency: ResidencyStatus): number {
  if (income <= 0) return 0
  const brackets = getBrackets(residency)
  const bracket = brackets.findLast((b) => income >= b.min) ?? brackets[0]
  return bracket.base + (income - bracket.min + 1) * bracket.rate
}

// LITO: max $700, two phase-out bands
// Phase 1: $37,500–$45,000 → reduce by 5¢ per $1 over $37,500
// Phase 2: $45,001–$66,667 → reduce by 1.5¢ per $1 over $45,000
export function calcLITO(income: number): number {
  if (income <= 37500) return 700
  if (income <= 45000) return Math.max(0, 700 - (income - 37500) * 0.05)
  if (income <= 66667) return Math.max(0, 325 - (income - 45000) * 0.015)
  return 0
}

export function calcIncomeTax(income: number, residency: ResidencyStatus, claimTFT: boolean): number {
  if (income <= 0) return 0

  // If no TFN / not claiming TFT: withhold at 47% (resident) or 45% (non-resident/WHM)
  if (!claimTFT) {
    return income * (residency === 'resident' ? 0.47 : 0.45)
  }

  const rawTax = calcRawIncomeTax(income, residency)

  // Apply LITO for residents only
  const lito = residency === 'resident' ? calcLITO(income) : 0
  return Math.max(0, rawTax - lito)
}

export function getMarginalRate(income: number, residency: ResidencyStatus): number {
  if (income <= 0) return 0
  const brackets = getBrackets(residency)
  const bracket = brackets.findLast((b) => income >= b.min) ?? brackets[0]
  return bracket.rate * 100
}

// Export brackets for TaxBracketViz
export const TAX_BRACKETS = RESIDENT_BRACKETS
