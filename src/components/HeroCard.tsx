import { motion } from 'framer-motion'
import { AnimatedNumber } from './AnimatedNumber'
import type { CalcResult, PayPeriod } from '../engine/types'
import { PAY_PERIOD_DIVISOR } from '../engine/types'

interface HeroCardProps {
  result: CalcResult
  payPeriod: PayPeriod
}

const periodLabel: Record<PayPeriod, string> = {
  weekly: 'per week',
  fortnightly: 'per fortnight',
  monthly: 'per month',
  annual: 'per year',
}

export function HeroCard({ result, payPeriod }: HeroCardProps) {
  const divisor = PAY_PERIOD_DIVISOR[payPeriod]
  const netPeriod = result.netAnnual / divisor
  const grossPeriod = result.grossAnnual / divisor
  const takeHomePct = result.grossAnnual > 0
    ? (result.netAnnual / result.grossAnnual) * 100
    : 100

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Top section */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary mb-1">
              Take-Home Pay
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={netPeriod}
                prefix="$"
                className="text-[48px] font-bold text-apple-text leading-none tracking-tight"
              />
            </div>
            <div className="text-[15px] text-apple-secondary mt-1">
              {periodLabel[payPeriod]}
            </div>
          </div>

          {/* Effective rate pill */}
          <div className="flex-shrink-0 mt-1">
            <div className="bg-apple-bg rounded-xl px-3 py-2 text-center">
              <div className="text-[11px] font-semibold tracking-[0.05em] uppercase text-apple-secondary">
                Effective rate
              </div>
              <AnimatedNumber
                value={result.effectiveTaxRate}
                suffix="%"
                decimals={1}
                className="text-[22px] font-bold text-apple-text leading-tight"
              />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-[12px] text-apple-secondary mb-1.5">
            <span>
              <AnimatedNumber value={takeHomePct} suffix="%" decimals={1} /> of gross
            </span>
            <span>
              Gross: $<AnimatedNumber value={grossPeriod} />/{payPeriod === 'annual' ? 'yr' : payPeriod === 'monthly' ? 'mo' : payPeriod === 'fortnightly' ? 'fn' : 'wk'}
            </span>
          </div>
          <div className="h-2 bg-apple-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-apple-green rounded-full"
              animate={{ width: `${takeHomePct}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Marginal rate strip */}
      <div className="border-t border-black/[0.06] px-6 py-3 flex items-center justify-between bg-apple-bg/50">
        <span className="text-[13px] text-apple-secondary">Marginal tax rate</span>
        <span className="text-[13px] font-semibold text-apple-text">{result.marginalRate}%</span>
      </div>
    </div>
  )
}
