export type PayPeriod = 'weekly' | 'fortnightly' | 'monthly' | 'annual'
export type FY = '2425' | '2526'
export type IncomeType = 'annual' | 'hourly'

export interface CalcInputs {
  grossAnnual: number
  fy: FY
  payPeriod: PayPeriod
  hasHECS: boolean
  isResident: boolean
  claimTFT: boolean      // claim tax-free threshold
  hoursPerWeek: number   // used only when incomeType = 'hourly'
}

export interface CalcResult {
  grossAnnual: number
  incomeTax: number        // annual, after LITO
  medicareLevy: number     // annual
  hecsRepayment: number    // annual (0 if no HECS)
  superSG: number          // annual employer SG contribution
  netAnnual: number
  effectiveTaxRate: number // % of gross (tax + medicare + hecs)
  marginalRate: number     // %
  lito: number             // LITO amount applied
}

export const PAY_PERIOD_DIVISOR: Record<PayPeriod, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  annual: 1,
}
