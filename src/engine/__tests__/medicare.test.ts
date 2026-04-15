import { describe, it, expect } from 'vitest'
import { calcMedicareLevy, calcMedicareLevySurcharge } from '../medicare'

describe('calcMedicareLevy', () => {
  it('returns 0 for non-residents', () => {
    expect(calcMedicareLevy(100000, 'non-resident', '2425')).toBe(0)
  })

  it('returns 0 for working holiday makers', () => {
    expect(calcMedicareLevy(100000, 'working-holiday', '2425')).toBe(0)
  })

  it('returns 0 for zero income', () => {
    expect(calcMedicareLevy(0, 'resident', '2425')).toBe(0)
  })

  describe('FY 2024-25 (lower: $27,222, upper: $34,027)', () => {
    it('returns 0 below the lower threshold', () => {
      expect(calcMedicareLevy(27222, 'resident', '2425')).toBe(0)
      expect(calcMedicareLevy(20000, 'resident', '2425')).toBe(0)
    })

    it('phases in at 10c/$1 in the shade-in range', () => {
      expect(calcMedicareLevy(30000, 'resident', '2425')).toBeCloseTo(277.80, 2)
    })

    it('applies full 2% above the upper threshold', () => {
      expect(calcMedicareLevy(100000, 'resident', '2425')).toBeCloseTo(2000, 2)
    })
  })

  describe('FY 2025-26 (lower: $29,207, upper: $36,509)', () => {
    it('returns 0 below the lower threshold', () => {
      expect(calcMedicareLevy(29207, 'resident', '2526')).toBe(0)
    })

    it('phases in at 10c/$1 in the shade-in range', () => {
      expect(calcMedicareLevy(32000, 'resident', '2526')).toBeCloseTo(279.30, 2)
    })

    it('applies full 2% above the upper threshold', () => {
      expect(calcMedicareLevy(100000, 'resident', '2526')).toBeCloseTo(2000, 2)
    })
  })
})

describe('calcMedicareLevySurcharge', () => {
  it('returns 0 when person has private health cover', () => {
    expect(calcMedicareLevySurcharge(150000, 'resident', true, '2526')).toBe(0)
  })

  it('returns 0 for non-residents', () => {
    expect(calcMedicareLevySurcharge(150000, 'non-resident', false, '2526')).toBe(0)
  })

  it('returns 0 for zero income', () => {
    expect(calcMedicareLevySurcharge(0, 'resident', false, '2526')).toBe(0)
  })

  describe('FY 2025-26 singles thresholds', () => {
    it('returns 0 below the first threshold ($101,000)', () => {
      expect(calcMedicareLevySurcharge(90000, 'resident', false, '2526')).toBe(0)
    })

    it('applies 1.0% in the first band', () => {
      expect(calcMedicareLevySurcharge(110000, 'resident', false, '2526')).toBeCloseTo(1100, 2)
    })

    it('applies 1.25% in the second band', () => {
      expect(calcMedicareLevySurcharge(150000, 'resident', false, '2526')).toBeCloseTo(1875, 2)
    })

    it('applies 1.5% in the top band', () => {
      expect(calcMedicareLevySurcharge(200000, 'resident', false, '2526')).toBeCloseTo(3000, 2)
    })
  })

  describe('FY 2024-25 singles thresholds', () => {
    it('returns 0 below the first threshold ($97,000)', () => {
      expect(calcMedicareLevySurcharge(90000, 'resident', false, '2425')).toBe(0)
    })

    it('applies 1.0% just above the first threshold', () => {
      expect(calcMedicareLevySurcharge(100000, 'resident', false, '2425')).toBeCloseTo(1000, 2)
    })
  })
})
