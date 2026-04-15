import { useState } from 'react'
import { NumericFormat } from 'react-number-format'

interface NumberFieldProps {
  label: string
  description?: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  decimalScale?: number
  max?: number
}

export function NumberField({
  label,
  description,
  value,
  onChange,
  prefix = '$',
  suffix,
  decimalScale = 0,
  max,
}: NumberFieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium text-apple-text leading-tight">{label}</div>
        {description && (
          <div className="text-[12px] text-apple-secondary mt-0.5">{description}</div>
        )}
      </div>
      <div
        className={`flex-shrink-0 flex items-center gap-1 rounded-lg border px-2.5 py-1.5 transition-all duration-150 ${
          focused
            ? 'border-apple-blue shadow-input'
            : 'border-black/[0.08]'
        }`}
      >
        {prefix && (
          <span className="text-[14px] text-apple-secondary select-none">{prefix}</span>
        )}
        <NumericFormat
          value={value}
          onValueChange={(vals) => {
            const next = vals.floatValue ?? 0
            onChange(max !== undefined ? Math.min(next, max) : next)
          }}
          thousandSeparator=","
          decimalScale={decimalScale}
          allowNegative={false}
          className="w-20 text-right text-[15px] font-medium text-apple-text bg-transparent outline-none tabular-nums"
          placeholder="0"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="decimal"
        />
        {suffix && (
          <span className="text-[13px] text-apple-secondary select-none">{suffix}</span>
        )}
      </div>
    </div>
  )
}
