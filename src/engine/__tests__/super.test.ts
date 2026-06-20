import { describe, it, expect } from 'vitest'
import { calcSuperSG, getSGRate, splitPackageIncludingSuper } from '../super'

describe('calcSuperSG', () => {
  it('calculates 11.5% for FY 2024-25', () => {
    expect(calcSuperSG(100000, '2425')).toBeCloseTo(11500, 2)
  })

  it('calculates 12% for FY 2025-26', () => {
    expect(calcSuperSG(100000, '2526')).toBeCloseTo(12000, 2)
  })

  it('returns 0 for zero income', () => {
    expect(calcSuperSG(0, '2425')).toBe(0)
  })
})

describe('getSGRate', () => {
  it('returns 11.5 for FY 2024-25', () => {
    expect(getSGRate('2425')).toBe(11.5)
  })

  it('returns 12 for FY 2025-26', () => {
    expect(getSGRate('2526')).toBe(12)
  })
})

describe('splitPackageIncludingSuper', () => {
  it('splits $112,000 into $100k base + $12k super at 12%', () => {
    const { baseSalary, superSG } = splitPackageIncludingSuper(112000, '2526')
    expect(baseSalary).toBeCloseTo(100000, 0)
    expect(superSG).toBeCloseTo(12000, 0)
  })

  it('splits $111,500 into $100k base + $11.5k super at 11.5%', () => {
    const { baseSalary, superSG } = splitPackageIncludingSuper(111500, '2425')
    expect(baseSalary).toBeCloseTo(100000, 0)
    expect(superSG).toBeCloseTo(11500, 0)
  })

  it('base + super always equals original package', () => {
    const { baseSalary, superSG } = splitPackageIncludingSuper(85000, '2526')
    expect(baseSalary + superSG).toBeCloseTo(85000, 2)
  })
})
