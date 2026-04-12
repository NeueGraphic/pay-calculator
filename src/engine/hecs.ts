import type { FY } from './types'

// FY2024-25: flat rate applied to full repayment income
// Rate is applied to total income (not just excess over threshold)
const HECS_RATES_2425: Array<[number, number, number]> = [
  // [from, to, rate]
  [54435,  59518,  0.010],
  [59519,  63089,  0.020],
  [63090,  66875,  0.025],
  [66876,  70888,  0.030],
  [70889,  75140,  0.035],
  [75141,  79649,  0.040],
  [79650,  84429,  0.045],
  [84430,  89494,  0.050],
  [89495,  94856,  0.055],
  [94857, 100514,  0.060],
  [100515, 106538, 0.065],
  [106539, 112944, 0.070],
  [112945, 119752, 0.075],
  [119753, 126982, 0.080],
  [126983, 134652, 0.085],
  [134653, 142787, 0.090],
  [142788, 151415, 0.095],
  [151416, Infinity, 0.100],
]

// FY2025-26: marginal system — only income ABOVE $67,000 is subject
const HECS_RATES_2526: Array<[number, number, number]> = [
  [67000,   70618,  0.010],
  [70619,   74855,  0.020],
  [74856,   79346,  0.025],
  [79347,   84107,  0.030],
  [84108,   89154,  0.035],
  [89155,   94505,  0.040],
  [94506,  100175,  0.045],
  [100176, 106186,  0.050],
  [106187, 112556,  0.055],
  [112557, 119310,  0.060],
  [119311, 126469,  0.065],
  [126470, 134057,  0.070],
  [134058, 142100,  0.075],
  [142101, 150626,  0.080],
  [150627, 159664,  0.085],
  [159665, 169243,  0.090],
  [169244, 179398,  0.095],
  [179399, Infinity, 0.100],
]

export function calcHECS(income: number, fy: FY): number {
  if (fy === '2425') {
    const band = HECS_RATES_2425.find(([from, to]) => income >= from && income <= to)
    if (!band) return 0
    return income * band[2]
  } else {
    // FY25-26: marginal — only on amount above threshold
    // Find the applicable rate on the top dollar earned
    const band = HECS_RATES_2526.find(([from, to]) => income >= from && income <= to)
    if (!band) return 0
    const [, , rate] = band
    // FY25-26 is marginal: apply rate to income ABOVE the $67,000 minimum threshold
    return (income - 67000) * rate
  }
}
