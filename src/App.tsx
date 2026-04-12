import { useCalculator } from './hooks/useCalculator'
import { SalaryInput } from './components/SalaryInput'
import { SegmentedControl } from './components/SegmentedControl'
import { Toggle } from './components/Toggle'
import { HeroCard } from './components/HeroCard'
import { BreakdownCard } from './components/BreakdownCard'
import { TaxBracketViz } from './components/TaxBracketViz'
import type { FY, PayPeriod } from './engine/types'

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

export default function App() {
  const { state, result, grossAnnual, update } = useCalculator()

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-apple-bg/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="text-[17px] font-semibold text-apple-text tracking-tight">
            Pay Calculator
          </h1>
          <SegmentedControl
            options={fyOptions}
            value={state.fy}
            onChange={(v) => update('fy', v)}
            size="sm"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">

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

        {/* Options toggles */}
        <div className="bg-white rounded-2xl shadow-card px-6 py-5">
          <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary mb-4">
            Options
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
              checked={!state.isResident}
              onChange={(v) => update('isResident', !v)}
              label="Non-Resident"
              description="Different tax rates, no Medicare levy or LITO"
            />
            <div className="border-t border-black/[0.05]" />
            <Toggle
              checked={!state.claimTFT}
              onChange={(v) => update('claimTFT', !v)}
              label="No Tax-Free Threshold"
              description="Withholding at highest rate (no TFN declaration)"
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

        {/* Tax bracket visualizer */}
        <TaxBracketViz grossAnnual={grossAnnual} />

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-[12px] text-apple-secondary leading-relaxed">
            Calculations based on ATO rates for the selected financial year.
            <br />
            For personal tax advice, consult a registered tax agent.
          </p>
        </div>
      </main>
    </div>
  )
}
