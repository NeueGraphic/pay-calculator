import { AnimatedNumber } from './AnimatedNumber'
import type { CalcResult } from '../engine/types'

interface PeriodBreakdownProps {
  result: CalcResult
}

const PERIODS: Array<{ label: string; divisor: number }> = [
  { label: 'Annual', divisor: 1 },
  { label: 'Monthly', divisor: 12 },
  { label: 'Fortnightly', divisor: 26 },
  { label: 'Weekly', divisor: 52 },
  { label: 'Daily', divisor: 260 }, // working days
  { label: 'Hourly (38h/wk)', divisor: 52 * 38 },
]

export function PeriodBreakdown({ result }: PeriodBreakdownProps) {
  const totalDeductions =
    result.incomeTax + result.medicareLevy + result.medicareLevySurcharge + result.hecsRepayment

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 pt-5 pb-2">
        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary">
          Period Breakdown
        </div>
      </div>
      <div className="px-3 pb-3">
        <table className="w-full text-[13px] tabular-nums">
          <thead>
            <tr className="text-[11px] text-apple-secondary uppercase tracking-wide">
              <th className="text-left font-medium px-3 pb-2">Period</th>
              <th className="text-right font-medium px-3 pb-2">Gross</th>
              <th className="text-right font-medium px-3 pb-2">Tax</th>
              <th className="text-right font-medium px-3 pb-2">Take-home</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {PERIODS.map((p) => {
              const gross = result.grossAnnual / p.divisor
              const tax = totalDeductions / p.divisor
              const net = result.netAnnual / p.divisor
              const decimals = p.divisor >= 260 ? 2 : 0
              return (
                <tr key={p.label}>
                  <td className="text-apple-text font-medium px-3 py-2.5">{p.label}</td>
                  <td className="text-right text-apple-secondary px-3 py-2.5">
                    <AnimatedNumber value={gross} prefix="$" decimals={decimals} />
                  </td>
                  <td className="text-right text-apple-red px-3 py-2.5">
                    <AnimatedNumber value={tax} prefix="$" decimals={decimals} />
                  </td>
                  <td className="text-right text-apple-text font-semibold px-3 py-2.5">
                    <AnimatedNumber value={net} prefix="$" decimals={decimals} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
