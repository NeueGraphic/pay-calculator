import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TAX_BRACKETS } from '../engine/tax'

interface TaxBracketVizProps {
  grossAnnual: number
}

const BRACKET_COLORS = [
  'bg-[#34C759]',  // 0%  — green
  'bg-[#FF9500]',  // 16% — orange
  'bg-[#FF6B35]',  // 30% — amber-orange
  'bg-[#FF3B30]',  // 37% — red
  'bg-[#AF1D14]',  // 45% — deep red
]

const MAX_DISPLAY = 200000

export function TaxBracketViz({ grossAnnual }: TaxBracketVizProps) {
  const [open, setOpen] = useState(false)

  const markerPct = Math.min((grossAnnual / MAX_DISPLAY) * 100, 100)

  // Build bracket segments with widths as % of MAX_DISPLAY
  const segments = TAX_BRACKETS.map((b, i) => {
    const from = b.min
    const to = Math.min(b.max === Infinity ? MAX_DISPLAY : b.max, MAX_DISPLAY)
    const width = Math.max(0, ((to - from) / MAX_DISPLAY) * 100)
    return { rate: b.rate * 100, width, color: BRACKET_COLORS[i] }
  }).filter(s => s.width > 0)

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="text-[13px] font-semibold text-apple-secondary uppercase tracking-[0.06em]">
          Tax Brackets
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="text-apple-secondary"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="bracket-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {/* Bar */}
              <div className="relative h-8 rounded-lg overflow-hidden flex mb-3">
                {segments.map((seg, i) => (
                  <div
                    key={i}
                    className={`${seg.color} h-full`}
                    style={{ width: `${seg.width}%` }}
                  />
                ))}
                {/* Income marker */}
                {grossAnnual > 0 && (
                  <motion.div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_4px_rgba(0,0,0,0.3)]"
                    animate={{ left: `${markerPct}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                )}
              </div>

              {/* Labels */}
              <div className="flex gap-3 flex-wrap">
                {segments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm ${seg.color}`} />
                    <span className="text-[12px] text-apple-secondary">{seg.rate}%</span>
                  </div>
                ))}
              </div>

              {/* Income label */}
              {grossAnnual > 0 && (
                <div className="mt-3 text-[13px] text-apple-secondary">
                  Your income of{' '}
                  <span className="font-semibold text-apple-text">
                    ${new Intl.NumberFormat('en-AU').format(Math.round(grossAnnual))}
                  </span>{' '}
                  sits in the{' '}
                  <span className="font-semibold text-apple-text">
                    {(TAX_BRACKETS.findLast(b => grossAnnual >= b.min)?.rate ?? 0) * 100}% bracket
                  </span>
                </div>
              )}

              {/* Scale labels */}
              <div className="flex justify-between mt-2 text-[11px] text-apple-secondary">
                <span>$0</span>
                <span>$50k</span>
                <span>$100k</span>
                <span>$150k</span>
                <span>$200k+</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
