import { useCalculator } from '../hooks/useCalculator'
import { SalaryInput } from './SalaryInput'
import { SegmentedControl } from './SegmentedControl'
import { Toggle } from './Toggle'
import { NumberField } from './NumberField'
import { HeroCard } from './HeroCard'
import { BreakdownCard } from './BreakdownCard'
import { PeriodBreakdown } from './PeriodBreakdown'
import { TaxBracketViz } from './TaxBracketViz'
import type { FY, PayPeriod, ResidencyStatus } from '../engine/types'

const payPeriodOptions: Array<{ label: string; value: PayPeriod }> = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Fortnightly', value: 'fortnightly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
]

const fyOptions: Array<{ label: string; value: FY }> = [
  { label: 'FY24–25', value: '2425' },
  { label: 'FY25–26', value: '2526' },
]

const residencyOptions: Array<{ label: string; value: ResidencyStatus }> = [
  { label: 'Resident', value: 'resident' },
  { label: 'Non-resident', value: 'non-resident' },
  { label: 'Working Holiday', value: 'working-holiday' },
]

export function Calculator() {
  const { state, result, grossAnnual, update } = useCalculator()

  return (
    <div className="space-y-4">
      {/* FY selector */}
      <div className="flex justify-center">
        <SegmentedControl
          options={fyOptions}
          value={state.fy}
          onChange={(v) => update('fy', v)}
          size="sm"
        />
      </div>

      {/* Salary input */}
      <SalaryInput
        salary={state.salary}
        incomeType={state.incomeType}
        hoursPerWeek={state.hoursPerWeek}
        onSalaryChange={(v) => update('salary', v)}
        onIncomeTypeChange={(v) => update('incomeType', v)}
        onHoursChange={(v) => update('hoursPerWeek', v)}
      />

      {/* Pay period selector */}
      <div className="flex justify-center">
        <SegmentedControl
          options={payPeriodOptions}
          value={state.payPeriod}
          onChange={(v) => update('payPeriod', v)}
        />
      </div>

      {/* Residency */}
      <div className="bg-white rounded-2xl shadow-card px-6 py-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary">
            Tax Residency
          </div>
        </div>
        <SegmentedControl
          options={residencyOptions}
          value={state.residency}
          onChange={(v) => update('residency', v)}
          size="sm"
        />
      </div>

      {/* Tax options */}
      <div className="bg-white rounded-2xl shadow-card px-6 py-5">
        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary mb-4">
          Tax Options
        </div>
        <div className="space-y-4">
          <Toggle
            checked={state.hasHECS}
            onChange={(v) => update('hasHECS', v)}
            label="HECS / HELP Debt"
            description="Adds study loan repayment to deductions"
          />
          <div className="border-t border-black/[0.05]" />
          <Toggle
            checked={state.claimTFT}
            onChange={(v) => update('claimTFT', v)}
            label="Claim tax-free threshold"
            description="Turn off if you don't claim TFT at this employer"
          />
          <div className="border-t border-black/[0.05]" />
          <Toggle
            checked={state.hasPrivateHealth}
            onChange={(v) => update('hasPrivateHealth', v)}
            label="Private hospital cover"
            description="Exempts you from the Medicare Levy Surcharge"
          />
        </div>
      </div>

      {/* Super options */}
      <div className="bg-white rounded-2xl shadow-card px-6 py-5">
        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary mb-4">
          Superannuation
        </div>
        <div className="space-y-4">
          <Toggle
            checked={state.salaryIncludesSuper}
            onChange={(v) => update('salaryIncludesSuper', v)}
            label="Package includes super"
            description="Entered amount is total package (base + SG)"
          />
          <div className="border-t border-black/[0.05]" />
          <NumberField
            label="Salary sacrifice"
            description="Pre-tax super contribution (annual)"
            value={state.salarySacrifice}
            onChange={(v) => update('salarySacrifice', v)}
            suffix="/ yr"
            max={30000}
          />
          <div className="border-t border-black/[0.05]" />
          <NumberField
            label="Voluntary super"
            description="Post-tax super contribution (annual)"
            value={state.additionalSuper}
            onChange={(v) => update('additionalSuper', v)}
            suffix="/ yr"
          />
        </div>
      </div>

      {/* Hero output */}
      <HeroCard result={result} payPeriod={state.payPeriod} />

      {/* Breakdown */}
      <BreakdownCard
        result={result}
        payPeriod={state.payPeriod}
        hasHECS={state.hasHECS}
        fy={state.fy}
      />

      {/* Multi-period breakdown */}
      <PeriodBreakdown result={result} />

      {/* Tax bracket visualizer */}
      <TaxBracketViz grossAnnual={grossAnnual} />
    </div>
  )
}
