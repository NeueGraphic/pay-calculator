import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedNumber({
  value,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1], // Apple's easing
      onUpdate: (v) => setDisplay(v),
    })
    prevRef.current = value
    return () => controls.stop()
  }, [value])

  const formatted = new Intl.NumberFormat('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.round(display))

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
