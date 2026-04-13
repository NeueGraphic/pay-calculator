import { describe, it, expect } from 'vitest'
import { calculate } from '../calculate'
import type { CalcInputs } from '../types'

const baseInputs: CalcInputs = {
  grossAnnual: 100000,
  fy: '2526',
  payPeriod: 'annual',
  hasHECS: false,
  isResident: true,
  claimTFT: true,
  hoursPerWeek: 38,
}

describe('calculate', () => {
  it('returns all zeros for zero income', () => {
    const result = calculate({ ...baseInputs, grossAnnual: 0 })
    expect(result.grossAnnual).toBe(0)
    expect(result.incomeTax).toBe(0)
    expect(result.medicareLevy).toBe(0)
    expect(result.hecsRepayment).toBe(0)
    expect(result.superSG).toBe(0)
    expect(result.netAnnual).toBe(0)
    expect(result.effectiveTaxRate).toBe(0)
    expect(result.marginalRate).toBe(0)
    expect(result.lito).toBe(0)
  })

  it('calculates correct net annual for $100k resident FY25-26', () => {
    const result = calculate(baseInputs)
    expect(result.grossAnnual).toBe(100000)
    expect(result.incomeTax).toBeGreaterThan(0)
    expect(result.medicareLevy).toBeCloseTo(2000, 0) // 2% of 100k
    expect(result.hecsRepayment).toBe(0)
    expect(result.superSG).toBeCloseTo(12000, 0) // 12% of 100k
    expect(result.netAnnual).toBe(100000 - result.incomeTax - result.medicareLevy)
    expect(result.marginalRate).toBe(30) // 100k falls in 30% bracket
  })

  it('includes HECS repayment when enabled', () => {
    const withHecs = calculate({ ...baseInputs, hasHECS: true })
    const withoutHecs = calculate({ ...baseInputs, hasHECS: false })
    expect(withHecs.hecsRepayment).toBeGreaterThan(0)
    expect(withoutHecs.hecsRepayment).toBe(0)
    expect(withHecs.netAnnual).toBeLessThan(withoutHecs.netAnnual)
  })

  it('calculates effective tax rate correctly', () => {
    const result = calculate(baseInputs)
    const totalDeductions = result.incomeTax + result.medicareLevy + result.hecsRepayment
    expect(result.effectiveTaxRate).toBeCloseTo((totalDeductions / 100000) * 100, 2)
  })

  it('calculates LITO for eligible residents', () => {
    // $50k income is within LITO range
    const result = calculate({ ...baseInputs, grossAnnual: 50000 })
    expect(result.lito).toBeGreaterThan(0)
  })

  it('returns 0 LITO for high-income earners', () => {
    // $100k income is above LITO phase-out ($66,667)
    const result = calculate(baseInputs)
    expect(result.lito).toBe(0)
  })

  it('returns 0 LITO for non-residents', () => {
    const result = calculate({ ...baseInputs, grossAnnual: 50000, isResident: false })
    expect(result.lito).toBe(0)
  })

  it('non-residents pay more tax than residents at $100k', () => {
    const resident = calculate(baseInputs)
    const nonResident = calculate({ ...baseInputs, isResident: false })
    expect(nonResident.incomeTax).toBeGreaterThan(resident.incomeTax)
  })
})
