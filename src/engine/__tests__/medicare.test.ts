import { describe, it, expect } from 'vitest'
import { calcMedicareLevy } from '../medicare'

describe('calcMedicareLevy', () => {
  it('returns 0 for non-residents', () => {
    expect(calcMedicareLevy(100000, false, '2425')).toBe(0)
  })

  it('returns 0 for zero income', () => {
    expect(calcMedicareLevy(0, true, '2425')).toBe(0)
  })

  describe('FY 2024-25 (lower: $27,222, upper: $34,027)', () => {
    it('returns 0 below the lower threshold', () => {
      expect(calcMedicareLevy(27222, true, '2425')).toBe(0)
      expect(calcMedicareLevy(20000, true, '2425')).toBe(0)
    })

    it('phases in at 10c/$1 in the shade-in range', () => {
      // $30,000: (30000 - 27222) * 0.10 = 277.80
      expect(calcMedicareLevy(30000, true, '2425')).toBeCloseTo(277.80, 2)
    })

    it('applies full 2% above the upper threshold', () => {
      // $100,000: 100000 * 0.02 = 2000
      expect(calcMedicareLevy(100000, true, '2425')).toBeCloseTo(2000, 2)
    })
  })

  describe('FY 2025-26 (lower: $29,207, upper: $36,509)', () => {
    it('returns 0 below the lower threshold', () => {
      expect(calcMedicareLevy(29207, true, '2526')).toBe(0)
    })

    it('phases in at 10c/$1 in the shade-in range', () => {
      // $32,000: (32000 - 29207) * 0.10 = 279.30
      expect(calcMedicareLevy(32000, true, '2526')).toBeCloseTo(279.30, 2)
    })

    it('applies full 2% above the upper threshold', () => {
      expect(calcMedicareLevy(100000, true, '2526')).toBeCloseTo(2000, 2)
    })
  })
})
