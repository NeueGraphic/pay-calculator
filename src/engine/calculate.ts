import { calcIncomeTax, calcLITO, getMarginalRate } from './tax'
import { calcMedicareLevy, calcMedicareLevySurcharge } from './medicare'
import { calcHECS } from './hecs'
import { calcSuperSG, splitPackageIncludingSuper } from './super'
import type { CalcInputs, CalcResult } from './types'

const EMPTY_RESULT: CalcResult = {
  grossAnnual: 0,
  packageAnnual: 0,
  incomeTax: 0,
  medicareLevy: 0,
  medicareLevySurcharge: 0,
  hecsRepayment: 0,
  superSG: 0,
  salarySacrifice: 0,
  additionalSuper: 0,
  totalSuper: 0,
  netAnnual: 0,
  effectiveTaxRate: 0,
  marginalRate: 0,
  lito: 0,
}

export function calculate(inputs: CalcInputs): CalcResult {
  const {
    grossAnnual: rawGross,
    fy,
    residency,
    claimTFT,
    hasHECS,
    hasPrivateHealth,
    salaryIncludesSuper,
    salarySacrifice,
    additionalSuper,
  } = inputs

  if (rawGross <= 0) return EMPTY_RESULT

  // Step 1: separate base salary from employer SG super
  const { baseSalary, superSG } = salaryIncludesSuper
    ? splitPackageIncludingSuper(rawGross, fy)
    : { baseSalary: rawGross, superSG: calcSuperSG(rawGross, fy) }

  const packageAnnual = baseSalary + superSG

  // Step 2: apply salary sacrifice (reduces taxable income, adds to super)
  const clampedSacrifice = Math.max(0, Math.min(salarySacrifice, baseSalary))
  const taxableIncome = baseSalary - clampedSacrifice

  if (taxableIncome <= 0) {
    return {
      ...EMPTY_RESULT,
      grossAnnual: taxableIncome,
      packageAnnual,
      superSG,
      salarySacrifice: clampedSacrifice,
      additionalSuper: Math.max(0, additionalSuper),
      totalSuper: superSG + clampedSacrifice + Math.max(0, additionalSuper),
    }
  }

  // Step 3: run tax calculations on the taxable income
  const incomeTax = calcIncomeTax(taxableIncome, residency, claimTFT)
  const medicareLevy = calcMedicareLevy(taxableIncome, residency, fy)
  const medicareLevySurcharge = calcMedicareLevySurcharge(
    taxableIncome,
    residency,
    hasPrivateHealth,
    fy,
  )
  const hecsRepayment = hasHECS ? calcHECS(taxableIncome, fy) : 0
  const lito = residency === 'resident' && claimTFT ? calcLITO(taxableIncome) : 0

  // Step 4: net take-home is base salary (post-sacrifice) minus deductions minus voluntary super
  const clampedAdditionalSuper = Math.max(0, additionalSuper)
  const totalDeductions = incomeTax + medicareLevy + medicareLevySurcharge + hecsRepayment
  const netAnnual = taxableIncome - totalDeductions - clampedAdditionalSuper

  const effectiveTaxRate = (totalDeductions / taxableIncome) * 100
  const marginalRate = getMarginalRate(taxableIncome, residency)
  const totalSuper = superSG + clampedSacrifice + clampedAdditionalSuper

  return {
    grossAnnual: taxableIncome,
    packageAnnual,
    incomeTax,
    medicareLevy,
    medicareLevySurcharge,
    hecsRepayment,
    superSG,
    salarySacrifice: clampedSacrifice,
    additionalSuper: clampedAdditionalSuper,
    totalSuper,
    netAnnual,
    effectiveTaxRate,
    marginalRate,
    lito,
  }
}
