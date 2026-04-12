import { useRef, useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Option<T extends string> {
  label: string
  value: T
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const activeIndex = options.findIndex(o => o.value === value)
    const buttons = container.querySelectorAll<HTMLButtonElement>('button')
    const btn = buttons[activeIndex]
    if (btn) {
      setPillStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }, [value, options])

  const py = size === 'sm' ? 'py-1' : 'py-1.5'
  const px = size === 'sm' ? 'px-3' : 'px-4'
  const text = size === 'sm' ? 'text-[13px]' : 'text-[14px]'

  return (
    <div
      ref={containerRef}
      className="relative flex bg-black/[0.06] rounded-[10px] p-[3px] gap-0"
    >
      {/* Sliding pill */}
      <motion.div
        className="absolute top-[3px] bottom-[3px] rounded-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]"
        animate={{ left: pillStyle.left, width: pillStyle.width }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      />

      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 ${py} ${px} ${text} font-medium rounded-[8px] transition-colors duration-150 whitespace-nowrap ${
            value === opt.value
              ? 'text-apple-text'
              : 'text-apple-secondary hover:text-apple-text'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
