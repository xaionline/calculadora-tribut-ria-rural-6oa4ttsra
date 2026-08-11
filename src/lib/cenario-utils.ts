import { formatCurrencyInput, formatPercentBR } from '@/lib/formatters'

export const CENARIO_MIN = 600000
export const CENARIO_MAX = 1210000
export const CENARIO_STEP = 10000
export const CENARIO_EQUILIBRIUM_RENDIMENTO = 900000
export const CENARIO_EQUILIBRIUM_ALIQUOTA = 5
export const CENARIO_TETO = 10
export const CENARIO_ROW_COUNT = 62

export function calculateAliquotaMinima(rendimento: number): number {
  const rate = ((rendimento - CENARIO_MIN) / CENARIO_MIN) * 10
  return Math.min(Math.max(rate, 0), CENARIO_TETO)
}

export interface CenarioDataPoint {
  rendimento: number
  aliquota: number
  rendimentoLabel: string
  aliquotaLabel: string
  isEquilibrium: boolean
}

export const cenarioData: CenarioDataPoint[] = Array.from({ length: CENARIO_ROW_COUNT }, (_, i) => {
  const rendimento = CENARIO_MIN + i * CENARIO_STEP
  const aliquota = calculateAliquotaMinima(rendimento)
  return {
    rendimento,
    aliquota,
    rendimentoLabel: formatCurrencyInput(rendimento),
    aliquotaLabel: formatPercentBR(aliquota),
    isEquilibrium: rendimento === CENARIO_EQUILIBRIUM_RENDIMENTO,
  }
})
