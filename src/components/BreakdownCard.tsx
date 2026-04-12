import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedNumber } from './AnimatedNumber'
import type { CalcResult, PayPeriod } from '../engine/types'
import { PAY_PERIOD_DIVISOR } from '../engine/types'
import { getSGRate } from '../engine/super'
import type { FY } from '../engine/types'

interface BreakdownCardProps {
  result: CalcResult
  payPeriod: PayPeriod
  hasHECS: boolean
  fy: FY
}

interface RowProps {
  label: string
  sublabel?: string
  amount: number
  annualAmount: number
  grossAnnual: number
  color: 'red' | 'green' | 'blue' | 'orange'
}

const BAR_COLORS = {
  red: 'bg-apple-red',
  green: 'bg-apple-green',
  blue: 'bg-apple-blue',
  orange: 'bg-[#FF9500]',
}

function BreakdownRow({ label, sublabel, amount, annualAmount, grossAnnual, color }: RowProps) {
  const pct = grossAnnual > 0 ? Math.min((annualAmount / grossAnnual) * 100, 100) : 0

  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-[15px] font-medium text-apple-text">{label}</span>
            {sublabel && (
              <span className="text-[12px] text-apple-secondary ml-1.5">{sublabel}</span>
            )}
          </div>
          <AnimatedNumber
            value={amount}
            prefix="$"
            className="text-[15px] font-semibold text-apple-text tabular-nums flex-shrink-0"
          />
        </div>
        {/* Bar */}
        <div className="mt-1.5 h-[3px] bg-black/[0.05] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${BAR_COLORS[color]}`}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          />
        </div>
      </div>
    </div>
  )
}

export function BreakdownCard({ result, payPeriod, hasHECS, fy }: BreakdownCardProps) {
  const divisor = PAY_PERIOD_DIVISOR[payPeriod]
  const sgRate = getSGRate(fy)

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 pt-5">
        {/* Section: Deductions */}
        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary mb-1">
          Deductions
        </div>

        <div className="divide-y divide-black/[0.05]">
          <BreakdownRow
            label="Income Tax"
            sublabel={`${result.marginalRate}% marginal`}
            amount={result.incomeTax / divisor}
            annualAmount={result.incomeTax}
            grossAnnual={result.grossAnnual}
            color="red"
          />
          <BreakdownRow
            label="Medicare Levy"
            sublabel="2%"
            amount={result.medicareLevy / divisor}
            annualAmount={result.medicareLevy}
            grossAnnual={result.grossAnnual}
            color="orange"
          />
          <AnimatePresence>
            {hasHECS && result.hecsRepayment > 0 && (
              <motion.div
                key="hecs-row"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="overflow-hidden"
              >
                <BreakdownRow
                  label="HECS/HELP"
                  sublabel="repayment"
                  amount={result.hecsRepayment / divisor}
                  annualAmount={result.hecsRepayment}
                  grossAnnual={result.grossAnnual}
                  color="blue"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Divider + Employer */}
      <div className="mx-6 border-t border-black/[0.06] mt-1" />

      <div className="px-6 pb-5">
        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary mt-4 mb-1">
          Employer Adds
        </div>
        <div className="divide-y divide-black/[0.05]">
          <BreakdownRow
            label="Super (SG)"
            sublabel={`${sgRate}% of gross`}
            amount={result.superSG / divisor}
            annualAmount={result.superSG}
            grossAnnual={result.grossAnnual}
            color="green"
          />
        </div>
      </div>

      {/* Annual summary footer */}
      <div className="border-t border-black/[0.06] bg-apple-bg/50 px-6 py-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[11px] text-apple-secondary">Tax + Levies</div>
            <AnimatedNumber
              value={(result.incomeTax + result.medicareLevy) / divisor}
              prefix="$"
              className="text-[14px] font-semibold text-apple-red tabular-nums"
            />
          </div>
          <div>
            <div className="text-[11px] text-apple-secondary">HECS</div>
            <AnimatedNumber
              value={result.hecsRepayment / divisor}
              prefix="$"
              className="text-[14px] font-semibold text-apple-blue tabular-nums"
            />
          </div>
          <div>
            <div className="text-[11px] text-apple-secondary">Super</div>
            <AnimatedNumber
              value={result.superSG / divisor}
              prefix="$"
              className="text-[14px] font-semibold text-apple-green tabular-nums"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
