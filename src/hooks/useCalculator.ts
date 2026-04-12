import { useState, useMemo } from 'react'
import { calculate } from '../engine/calculate'
import type { CalcInputs, CalcResult, FY, PayPeriod, IncomeType } from '../engine/types'

interface CalculatorState {
  salary: number
  incomeType: IncomeType
  hoursPerWeek: number
  payPeriod: PayPeriod
  fy: FY
  hasHECS: boolean
  isResident: boolean
  claimTFT: boolean
}

const DEFAULT_STATE: CalculatorState = {
  salary: 85000,
  incomeType: 'annual',
  hoursPerWeek: 38,
  payPeriod: 'monthly',
  fy: '2526',
  hasHECS: false,
  isResident: true,
  claimTFT: true,
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE)

  const grossAnnual = useMemo(() => {
    if (state.incomeType === 'hourly') {
      return state.salary * state.hoursPerWeek * 52
    }
    return state.salary
  }, [state.salary, state.incomeType, state.hoursPerWeek])

  const inputs: CalcInputs = useMemo(() => ({
    grossAnnual,
    fy: state.fy,
    payPeriod: state.payPeriod,
    hasHECS: state.hasHECS,
    isResident: state.isResident,
    claimTFT: state.claimTFT,
    hoursPerWeek: state.hoursPerWeek,
  }), [grossAnnual, state.fy, state.payPeriod, state.hasHECS, state.isResident, state.claimTFT, state.hoursPerWeek])

  const result: CalcResult = useMemo(() => calculate(inputs), [inputs])

  const update = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }

  return { state, result, grossAnnual, update }
}
