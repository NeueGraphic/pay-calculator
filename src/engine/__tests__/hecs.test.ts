import { describe, it, expect } from 'vitest'
import { calcHECS } from '../hecs'

describe('calcHECS', () => {
  describe('FY 2024-25 (flat rate on total income)', () => {
    it('returns 0 below the minimum threshold ($54,435)', () => {
      expect(calcHECS(54434, '2425')).toBe(0)
      expect(calcHECS(0, '2425')).toBe(0)
    })

    it('applies 1% on total income in the first band', () => {
      // $55,000 * 0.01 = 550
      expect(calcHECS(55000, '2425')).toBeCloseTo(550, 2)
    })

    it('applies 5% for income in the $84,430-$89,494 band', () => {
      // $85,000 * 0.05 = 4250
      expect(calcHECS(85000, '2425')).toBeCloseTo(4250, 2)
    })

    it('applies 10% for income above $151,416', () => {
      // $200,000 * 0.10 = 20000
      expect(calcHECS(200000, '2425')).toBeCloseTo(20000, 2)
    })
  })

  describe('FY 2025-26 (marginal — only income above $67,000)', () => {
    it('returns 0 below the minimum threshold ($67,000)', () => {
      expect(calcHECS(66999, '2526')).toBe(0)
      expect(calcHECS(0, '2526')).toBe(0)
    })

    it('applies 1% on amount above $67,000 in the first band', () => {
      // (68000 - 67000) * 0.01 = 10
      expect(calcHECS(68000, '2526')).toBeCloseTo(10, 2)
    })

    it('applies rate on amount above $67,000 for higher bands', () => {
      // $100,000 in 94506-100175 band (rate 0.045)
      // (100000 - 67000) * 0.045 = 1485
      expect(calcHECS(100000, '2526')).toBeCloseTo(1485, 2)
    })

    it('applies 10% on amount above $67,000 for top band', () => {
      // $200,000 in 179399+ band (rate 0.10)
      // (200000 - 67000) * 0.10 = 13300
      expect(calcHECS(200000, '2526')).toBeCloseTo(13300, 2)
    })
  })
})
