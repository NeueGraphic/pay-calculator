import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left group"
    >
      {/* iOS-style switch */}
      <div
        className={`relative flex-shrink-0 w-[51px] h-[31px] rounded-full transition-colors duration-200 ${
          checked ? 'bg-apple-green' : 'bg-black/[0.15]'
        }`}
      >
        <motion.div
          className="absolute top-[2px] bottom-[2px] w-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25),0_0_0_0.5px_rgba(0,0,0,0.08)]"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      </div>

      <div>
        <div className="text-[15px] font-medium text-apple-text leading-tight">{label}</div>
        {description && (
          <div className="text-[12px] text-apple-secondary mt-0.5">{description}</div>
        )}
      </div>
    </button>
  )
}
