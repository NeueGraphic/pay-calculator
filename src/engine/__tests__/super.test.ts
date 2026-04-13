import { describe, it, expect } from 'vitest'
import { calcSuperSG, getSGRate } from '../super'

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
