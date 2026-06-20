import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator } from './components/Calculator'

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: 'ATO-Accurate Tax Brackets',
    description: 'Stage 3 tax cuts built in. Covers FY 2024–25 and FY 2025–26 with precise income thresholds and LITO offsets.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Every Pay Period',
    description: 'See your take-home pay broken down weekly, fortnightly, monthly, annually, daily, and hourly — all at once.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Medicare Levy & Surcharge',
    description: 'Automatically calculates the 2% Medicare levy with phase-in thresholds, plus the surcharge if you lack private hospital cover.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    title: 'HECS / HELP Debt',
    description: 'Supports both the FY24–25 flat-rate and FY25–26 marginal repayment systems with accurate ATO thresholds.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Salary Sacrifice & Super',
    description: 'Model pre-tax salary sacrifice, voluntary contributions, and package-includes-super scenarios to optimise your retirement savings.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    title: 'Working Holiday Maker',
    description: 'Flat 15% rate on the first $45,000 for WHM visa holders, then standard non-resident rates above that.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'How accurate are these calculations?',
    a: 'All tax brackets, Medicare thresholds, HECS rates, and superannuation percentages are sourced directly from the Australian Taxation Office for the selected financial year. The calculator uses the same formulas the ATO publishes.',
  },
  {
    q: 'What financial years are supported?',
    a: 'Currently FY 2024–25 and FY 2025–26. Both include the Stage 3 tax cuts that took effect on 1 July 2024, with updated Medicare thresholds and super guarantee rates for each year.',
  },
  {
    q: 'Does this include the Stage 3 tax cuts?',
    a: 'Yes. The Stage 3 tax brackets are the default for both financial years: 16% on $18,201–$45,000, 30% on $45,001–$135,000, 37% on $135,001–$190,000, and 45% above $190,000.',
  },
  {
    q: 'How does salary sacrifice affect my take-home pay?',
    a: 'Salary sacrifice is a pre-tax super contribution that reduces your taxable income. This means you pay less income tax and Medicare levy, but the sacrificed amount goes to your super fund instead of your bank account. The calculator shows the net effect on your take-home pay.',
  },
  {
    q: 'What is the Medicare Levy Surcharge?',
    a: 'If you earn over $93,000 (singles) and don\'t hold private hospital cover, the ATO charges an additional 1%–1.5% surcharge on top of the standard 2% Medicare levy. Toggle "Private hospital cover" on to remove it.',
  },
  {
    q: 'Is my data stored anywhere?',
    a: 'No. All calculations happen entirely in your browser. Nothing is sent to a server, no cookies are set, and no personal data is collected or stored.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[16px] font-medium text-apple-text">{q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="text-apple-secondary flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[15px] text-apple-secondary leading-relaxed pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-apple-bg/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#863bff] to-[#5B21B6] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-apple-text">PayCalc</span>
          </a>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-[13px] text-apple-secondary hover:text-apple-text transition-colors">Features</a>
            <a href="#calculator" className="text-[13px] text-apple-secondary hover:text-apple-text transition-colors">Calculator</a>
            <a href="#faq" className="text-[13px] text-apple-secondary hover:text-apple-text transition-colors">FAQ</a>
          </div>
          <button
            onClick={scrollToCalculator}
            className="text-[13px] font-medium text-white bg-[#863bff] hover:bg-[#7331e0] rounded-full px-4 py-1.5 transition-colors"
          >
            Calculate
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#863bff]/[0.04] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-[#863bff]/[0.08] rounded-full px-3.5 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#863bff]" />
              <span className="text-[13px] font-medium text-[#863bff]">Updated for FY 2025–26</span>
            </div>
            <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-bold text-apple-text leading-[1.05] tracking-tight">
              Know exactly what
              <br />
              <span className="bg-gradient-to-r from-[#863bff] to-[#c084fc] bg-clip-text text-transparent">
                you take home.
              </span>
            </h1>
            <p className="mt-5 text-[18px] sm:text-[21px] text-apple-secondary leading-relaxed max-w-2xl mx-auto">
              The Australian pay calculator that gets the details right.
              Tax brackets, Medicare, HECS, super, salary sacrifice — calculated
              instantly, explained clearly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center gap-2 text-[16px] font-medium text-white bg-[#863bff] hover:bg-[#7331e0] rounded-full px-7 py-3 transition-colors shadow-[0_2px_12px_rgba(134,59,255,0.35)]"
              >
                Start calculating
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 text-[16px] font-medium text-apple-secondary hover:text-apple-text rounded-full px-7 py-3 transition-colors"
              >
                See features
              </a>
            </div>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-apple-secondary"
          >
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4L6 11.3 2.7 8" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ATO rates
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4L6 11.3 2.7 8" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              100% private
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4L6 11.3 2.7 8" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              No sign-up required
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4L6 11.3 2.7 8" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Free to use
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-apple-text tracking-tight">
              Everything you need to know
              <br className="hidden sm:block" />
              {' '}about your pay.
            </h2>
            <p className="mt-4 text-[17px] text-apple-secondary max-w-xl mx-auto">
              Built for every Australian worker — from full-time employees to working holiday makers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                className="bg-white rounded-2xl shadow-card p-6 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-[#863bff]/[0.08] flex items-center justify-center text-[#863bff] mb-4">
                  {f.icon}
                </div>
                <h3 className="text-[16px] font-semibold text-apple-text mb-1.5">{f.title}</h3>
                <p className="text-[14px] text-apple-secondary leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-[#863bff]/[0.02] to-transparent">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-apple-text tracking-tight">
              Calculate your pay
            </h2>
            <p className="mt-3 text-[17px] text-apple-secondary">
              Enter your salary and see results instantly.
            </p>
          </div>

          <Calculator />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-apple-text tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-card px-6">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#863bff] to-[#5B21B6] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[14px] font-semibold text-apple-text">PayCalc</span>
              </div>
              <p className="text-[13px] text-apple-secondary max-w-sm leading-relaxed">
                Australian pay calculator built with ATO rates.
                Calculations are estimates only — for personal tax advice, consult a registered tax agent.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 text-[13px] text-apple-secondary">
              <div className="flex gap-5">
                <a href="#features" className="hover:text-apple-text transition-colors">Features</a>
                <a href="#calculator" className="hover:text-apple-text transition-colors">Calculator</a>
                <a href="#faq" className="hover:text-apple-text transition-colors">FAQ</a>
              </div>
              <span>&copy; {new Date().getFullYear()} PayCalc. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
