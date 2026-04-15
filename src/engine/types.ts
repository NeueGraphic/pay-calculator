export type PayPeriod = 'weekly' | 'fortnightly' | 'monthly' | 'annual'
export type FY = '2425' | '2526'
export type IncomeType = 'annual' | 'hourly'
export type ResidencyStatus = 'resident' | 'non-resident' | 'working-holiday'

export interface CalcInputs {
  grossAnnual: number            // base salary (pre-super) for taxable income calc
  fy: FY
  payPeriod: PayPeriod
  hasHECS: boolean
  residency: ResidencyStatus
  claimTFT: boolean              // claim tax-free threshold
  hoursPerWeek: number           // used only when incomeType = 'hourly'
  hasPrivateHealth: boolean      // exempts from Medicare Levy Surcharge
  salaryIncludesSuper: boolean   // if true, grossAnnual includes SG super
  salarySacrifice: number        // annual pre-tax super contribution
  additionalSuper: number        // annual post-tax super contribution
}

export interface CalcResult {
  grossAnnual: number            // taxable income base (after salary sacrifice, before tax)
  packageAnnual: number          // total package (base + SG super)
  incomeTax: number              // annual, after LITO
  medicareLevy: number           // annual
  medicareLevySurcharge: number  // annual (0 if has private health or below threshold)
  hecsRepayment: number          // annual (0 if no HECS)
  superSG: number                // annual employer SG contribution
  salarySacrifice: number        // annual pre-tax super contribution (passed through)
  additionalSuper: number        // annual post-tax super contribution (passed through)
  totalSuper: number             // SG + salary sacrifice + additional
  netAnnual: number              // take-home pay in hand
  effectiveTaxRate: number       // % of gross (tax + medicare + MLS + hecs)
  marginalRate: number           // %
  lito: number                   // LITO amount applied
}

export const PAY_PERIOD_DIVISOR: Record<PayPeriod, number> = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  annual: 1,
}
