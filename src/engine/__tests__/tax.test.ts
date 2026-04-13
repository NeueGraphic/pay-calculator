import { describe, it, expect } from 'vitest'
import { calcRawIncomeTax, calcLITO, calcIncomeTax, getMarginalRate } from '../tax'

describe('calcRawIncomeTax', () => {
  describe('resident', () => {
    it('returns 0 for zero income', () => {
      expect(calcRawIncomeTax(0, true)).toBe(0)
    })

    it('returns 0 for negative income', () => {
      expect(calcRawIncomeTax(-10000, true)).toBe(0)
    })

    it('returns 0 within the tax-free threshold', () => {
      expect(calcRawIncomeTax(18200, true)).toBe(0)
    })

    it('applies 16% bracket for $30,000', () => {
      // $30,000 falls in 18201-45000 bracket: base 0 + (30000 - 18201 + 1) * 0.16
      const expected = 0 + (30000 - 18201 + 1) * 0.16
      expect(calcRawIncomeTax(30000, true)).toBeCloseTo(expected, 2)
    })

    it('applies 30% bracket for $100,000', () => {
      // 45001-135000 bracket: base 4288 + (100000 - 45001 + 1) * 0.30
      const expected = 4288 + (100000 - 45001 + 1) * 0.30
      expect(calcRawIncomeTax(100000, true)).toBeCloseTo(expected, 2)
    })

    it('applies 37% bracket for $180,000', () => {
      // 135001-190000 bracket: base 31288 + (180000 - 135001 + 1) * 0.37
      const expected = 31288 + (180000 - 135001 + 1) * 0.37
      expect(calcRawIncomeTax(180000, true)).toBeCloseTo(expected, 2)
    })

    it('applies 45% bracket for $250,000', () => {
      // 190001+ bracket: base 51638 + (250000 - 190001 + 1) * 0.45
      const expected = 51638 + (250000 - 190001 + 1) * 0.45
      expect(calcRawIncomeTax(250000, true)).toBeCloseTo(expected, 2)
    })
  })

  describe('non-resident', () => {
    it('applies 30% from dollar one', () => {
      // 0-135000 bracket: base 0 + (50000 - 0 + 1) * 0.30
      const expected = (50000 - 0 + 1) * 0.30
      expect(calcRawIncomeTax(50000, false)).toBeCloseTo(expected, 2)
    })

    it('applies 37% bracket for $150,000', () => {
      // 135001-190000 bracket: base 40500 + (150000 - 135001 + 1) * 0.37
      const expected = 40500 + (150000 - 135001 + 1) * 0.37
      expect(calcRawIncomeTax(150000, false)).toBeCloseTo(expected, 2)
    })
  })
})

describe('calcLITO', () => {
  it('returns full $700 for income at or below $37,500', () => {
    expect(calcLITO(37500)).toBe(700)
    expect(calcLITO(20000)).toBe(700)
  })

  it('phases out at 5c/$1 between $37,500 and $45,000', () => {
    // At $40,000: 700 - (40000 - 37500) * 0.05 = 700 - 125 = 575
    expect(calcLITO(40000)).toBeCloseTo(575, 2)
  })

  it('phases out at 1.5c/$1 between $45,001 and $66,667', () => {
    // At $50,000: 325 - (50000 - 45000) * 0.015 = 325 - 75 = 250
    expect(calcLITO(50000)).toBeCloseTo(250, 2)
  })

  it('returns 0 above $66,667', () => {
    expect(calcLITO(66668)).toBe(0)
    expect(calcLITO(100000)).toBe(0)
  })
})

describe('calcIncomeTax', () => {
  it('returns 0 for zero income', () => {
    expect(calcIncomeTax(0, true, true)).toBe(0)
  })

  it('withholds at 47% for resident not claiming TFT', () => {
    expect(calcIncomeTax(100000, true, false)).toBeCloseTo(47000, 2)
  })

  it('withholds at 45% for non-resident not claiming TFT', () => {
    expect(calcIncomeTax(100000, false, false)).toBeCloseTo(45000, 2)
  })

  it('applies LITO for residents claiming TFT', () => {
    const rawTax = calcRawIncomeTax(50000, true)
    const lito = calcLITO(50000)
    expect(calcIncomeTax(50000, true, true)).toBeCloseTo(Math.max(0, rawTax - lito), 2)
  })

  it('does not apply LITO for non-residents', () => {
    const rawTax = calcRawIncomeTax(50000, false)
    expect(calcIncomeTax(50000, false, true)).toBeCloseTo(rawTax, 2)
  })
})

describe('getMarginalRate', () => {
  it('returns 0 for zero income', () => {
    expect(getMarginalRate(0, true)).toBe(0)
  })

  it('returns 0% in the tax-free threshold', () => {
    expect(getMarginalRate(18200, true)).toBe(0)
  })

  it('returns 16% for the second bracket', () => {
    expect(getMarginalRate(30000, true)).toBe(16)
  })

  it('returns 30% for the third bracket', () => {
    expect(getMarginalRate(100000, true)).toBe(30)
  })

  it('returns 45% for the top bracket', () => {
    expect(getMarginalRate(250000, true)).toBe(45)
  })

  it('returns 30% from dollar one for non-residents', () => {
    expect(getMarginalRate(50000, false)).toBe(30)
  })
})
