import { calcIncomeTax, calcLITO, getMarginalRate } from './tax'
import { calcMedicareLevy } from './medicare'
import { calcHECS } from './hecs'
import { calcSuperSG } from './super'
import type { CalcInputs, CalcResult } from './types'

export function calculate(inputs: CalcInputs): CalcResult {
  const { grossAnnual, fy, isResident, claimTFT, hasHECS } = inputs

  if (grossAnnual <= 0) {
    return {
      grossAnnual: 0,
      incomeTax: 0,
      medicareLevy: 0,
      hecsRepayment: 0,
      superSG: 0,
      netAnnual: 0,
      effectiveTaxRate: 0,
      marginalRate: 0,
      lito: 0,
    }
  }

  const incomeTax = calcIncomeTax(grossAnnual, isResident, claimTFT)
  const medicareLevy = calcMedicareLevy(grossAnnual, isResident, fy)
  const hecsRepayment = hasHECS ? calcHECS(grossAnnual, fy) : 0
  const superSG = calcSuperSG(grossAnnual, fy)
  const lito = isResident && claimTFT ? calcLITO(grossAnnual) : 0

  const totalDeductions = incomeTax + medicareLevy + hecsRepayment
  const netAnnual = grossAnnual - totalDeductions
  const effectiveTaxRate = (totalDeductions / grossAnnual) * 100
  const marginalRate = getMarginalRate(grossAnnual, isResident)

  return {
    grossAnnual,
    incomeTax,
    medicareLevy,
    hecsRepayment,
    superSG,
    netAnnual,
    effectiveTaxRate,
    marginalRate,
    lito,
  }
}
