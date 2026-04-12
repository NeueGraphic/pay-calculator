import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { SegmentedControl } from './SegmentedControl'
import type { IncomeType } from '../engine/types'

interface SalaryInputProps {
  salary: number
  incomeType: IncomeType
  hoursPerWeek: number
  onSalaryChange: (v: number) => void
  onIncomeTypeChange: (v: IncomeType) => void
  onHoursChange: (v: number) => void
}

const incomeTypeOptions: Array<{ label: string; value: IncomeType }> = [
  { label: 'Annual', value: 'annual' },
  { label: 'Hourly', value: 'hourly' },
]

export function SalaryInput({
  salary,
  incomeType,
  hoursPerWeek,
  onSalaryChange,
  onIncomeTypeChange,
  onHoursChange,
}: SalaryInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-card px-6 pt-5 pb-6">
      {/* Income type toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-apple-secondary">
          Income
        </span>
        <SegmentedControl
          options={incomeTypeOptions}
          value={incomeType}
          onChange={onIncomeTypeChange}
          size="sm"
        />
      </div>

      {/* Main salary input */}
      <div
        className={`flex items-center gap-2 rounded-xl border transition-all duration-200 px-4 py-3 ${
          focused
            ? 'border-apple-blue shadow-input'
            : 'border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
        }`}
      >
        <span className="text-[32px] font-semibold text-apple-secondary leading-none select-none">
          $
        </span>
        <NumericFormat
          value={salary}
          onValueChange={(vals) => onSalaryChange(vals.floatValue ?? 0)}
          thousandSeparator=","
          decimalSeparator="."
          decimalScale={incomeType === 'hourly' ? 2 : 0}
          allowNegative={false}
          className="flex-1 min-w-0 text-[40px] font-semibold text-apple-text leading-none bg-transparent outline-none placeholder:text-black/20"
          placeholder="0"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="decimal"
        />
        <span className="text-[15px] font-medium text-apple-secondary whitespace-nowrap">
          {incomeType === 'annual' ? '/ year' : '/ hour'}
        </span>
      </div>

      {/* Hours per week — shown only for hourly */}
      {incomeType === 'hourly' && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[13px] text-apple-secondary">Hours per week</span>
          <input
            type="number"
            value={hoursPerWeek}
            onChange={(e) => onHoursChange(Number(e.target.value))}
            min={1}
            max={168}
            className="w-16 text-center text-[15px] font-medium text-apple-text bg-black/[0.04] rounded-lg px-2 py-1 outline-none border border-transparent focus:border-apple-blue focus:shadow-input transition-all"
          />
        </div>
      )}
    </div>
  )
}
