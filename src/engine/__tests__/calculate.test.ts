import { describe, it, expect } from 'vitest'
import { calculate } from '../calculate'
import type { CalcInputs } from '../types'

const baseInputs: CalcInputs = {
  grossAnnual: 100000,
  fy: '2526',
  payPeriod: 'annual',
  hasHECS: false,
  residency: 'resident',
  claimTFT: true,
  hoursPerWeek: 38,
  hasPrivateHealth: false,
  salaryIncludesSuper: false,
  salarySacrifice: 0,
  additionalSuper: 0,
}

describe('calculate', () => {
  it('returns all zeros for zero income', () => {
    const result = calculate({ ...baseInputs, grossAnnual: 0 })
    expect(result.grossAnnual).toBe(0)
    expect(result.incomeTax).toBe(0)
    expect(result.medicareLevy).toBe(0)
    expect(result.medicareLevySurcharge).toBe(0)
    expect(result.hecsRepayment).toBe(0)
    expect(result.superSG).toBe(0)
    expect(result.netAnnual).toBe(0)
    expect(result.effectiveTaxRate).toBe(0)
    expect(result.marginalRate).toBe(0)
    expect(result.lito).toBe(0)
  })

  it('calculates correct figures for $100k resident FY25-26', () => {
    const result = calculate(baseInputs)
    expect(result.grossAnnual).toBe(100000)
    expect(result.incomeTax).toBeGreaterThan(0)
    expect(result.medicareLevy).toBeCloseTo(2000, 0)
    expect(result.hecsRepayment).toBe(0)
    expect(result.superSG).toBeCloseTo(12000, 0) // 12% SG
    expect(result.marginalRate).toBe(30)
  })

  it('adds MLS when income is high and no private hospital cover', () => {
    const result = calculate({ ...baseInputs, grossAnnual: 150000 })
    expect(result.medicareLevySurcharge).toBeGreaterThan(0)
  })

  it('does not apply MLS when private hospital cover is held', () => {
    const result = calculate({ ...baseInputs, grossAnnual: 150000, hasPrivateHealth: true })
    expect(result.medicareLevySurcharge).toBe(0)
  })

  it('includes HECS repayment when enabled', () => {
    const withHecs = calculate({ ...baseInputs, hasHECS: true })
    const withoutHecs = calculate({ ...baseInputs, hasHECS: false })
    expect(withHecs.hecsRepayment).toBeGreaterThan(0)
    expect(withoutHecs.hecsRepayment).toBe(0)
    expect(withHecs.netAnnual).toBeLessThan(withoutHecs.netAnnual)
  })

  it('non-residents pay more tax than residents at $100k', () => {
    const resident = calculate(baseInputs)
    const nonResident = calculate({ ...baseInputs, residency: 'non-resident' })
    expect(nonResident.incomeTax).toBeGreaterThan(resident.incomeTax)
  })

  it('returns 0 LITO for non-residents', () => {
    const result = calculate({ ...baseInputs, grossAnnual: 50000, residency: 'non-resident' })
    expect(result.lito).toBe(0)
  })

  describe('salary sacrifice', () => {
    it('reduces taxable income by the sacrificed amount', () => {
      const without = calculate(baseInputs)
      const withSac = calculate({ ...baseInputs, salarySacrifice: 10000 })
      expect(withSac.grossAnnual).toBe(90000)
      expect(withSac.incomeTax).toBeLessThan(without.incomeTax)
    })

    it('adds sacrifice to total super', () => {
      const result = calculate({ ...baseInputs, salarySacrifice: 10000 })
      expect(result.salarySacrifice).toBe(10000)
      expect(result.totalSuper).toBeCloseTo(result.superSG + 10000, 2)
    })

    it('caps sacrifice at base salary', () => {
      const result = calculate({ ...baseInputs, grossAnnual: 50000, salarySacrifice: 100000 })
      expect(result.salarySacrifice).toBeLessThanOrEqual(50000)
    })
  })

  describe('package includes super', () => {
    it('splits package into base + super', () => {
      // $112,000 package with 12% SG → base $100,000, super $12,000
      const result = calculate({
        ...baseInputs,
        grossAnnual: 112000,
        salaryIncludesSuper: true,
      })
      expect(result.grossAnnual).toBeCloseTo(100000, 0)
      expect(result.superSG).toBeCloseTo(12000, 0)
      expect(result.packageAnnual).toBeCloseTo(112000, 2)
    })

    it('matches exclusive result when package is base+SG', () => {
      const exclusive = calculate({ ...baseInputs, grossAnnual: 100000 })
      const inclusive = calculate({
        ...baseInputs,
        grossAnnual: 100000 + exclusive.superSG,
        salaryIncludesSuper: true,
      })
      expect(inclusive.grossAnnual).toBeCloseTo(exclusive.grossAnnual, 0)
      expect(inclusive.superSG).toBeCloseTo(exclusive.superSG, 0)
      expect(inclusive.netAnnual).toBeCloseTo(exclusive.netAnnual, 0)
    })
  })

  describe('voluntary (post-tax) super', () => {
    it('reduces take-home pay but does not affect tax', () => {
      const without = calculate(baseInputs)
      const withVol = calculate({ ...baseInputs, additionalSuper: 5000 })
      expect(withVol.incomeTax).toBe(without.incomeTax)
      expect(withVol.netAnnual).toBeCloseTo(without.netAnnual - 5000, 2)
      expect(withVol.additionalSuper).toBe(5000)
      expect(withVol.totalSuper).toBeCloseTo(without.totalSuper + 5000, 2)
    })
  })

  describe('working holiday maker', () => {
    it('applies WHM tax rates and no Medicare levy', () => {
      const result = calculate({ ...baseInputs, residency: 'working-holiday' })
      expect(result.medicareLevy).toBe(0)
      expect(result.medicareLevySurcharge).toBe(0)
      expect(result.lito).toBe(0)
      // WHM at $100k: base 6750 + (100000 - 45001 + 1) * 0.30 = 23250
      expect(result.incomeTax).toBeCloseTo(23250, 0)
    })
  })

  describe('effective tax rate', () => {
    it('reflects all deductions on taxable income', () => {
      const result = calculate({ ...baseInputs, grossAnnual: 150000, hasHECS: true })
      const totalDeductions =
        result.incomeTax + result.medicareLevy + result.medicareLevySurcharge + result.hecsRepayment
      expect(result.effectiveTaxRate).toBeCloseTo((totalDeductions / result.grossAnnual) * 100, 2)
    })
  })
})
