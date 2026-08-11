import type { SimulationData, TaxResult, FaixaRendimento, ComparativeRow } from '@/lib/tax-types'

export function calculateTaxes(data: SimulationData): TaxResult {
  const base = data.receitaBruta - data.despesas
  const ibsCBS = data.receitaBruta * ((data.aliquotaIBS + data.aliquotaCBS) / 100)
  const funrural = data.receitaBruta * (data.aliquotaFunrural / 100)
  const adicional = base > 0 ? base * 0.02 : 0
  const irpf = Math.max(0, base) * (data.aliquotaIRPF / 100)
  const totalTributos = ibsCBS + funrural + adicional + irpf
  const resultadoLiquido = data.receitaBruta - data.despesas - totalTributos
  const cargaTributaria = data.receitaBruta > 0 ? (totalTributos / data.receitaBruta) * 100 : 0
  return { ibsCBS, funrural, adicional, irpf, totalTributos, resultadoLiquido, cargaTributaria }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export const mockSimulation: SimulationData = {
  receitaBruta: 480000,
  despesas: 180000,
  aliquotaIBS: 8.8,
  aliquotaCBS: 4.4,
  aliquotaFunrural: 1.2,
  aliquotaIRPF: 15,
}

export const faixasRendimento: FaixaRendimento[] = [
  { faixa: 'Até R$ 120k', carga: 12.5 },
  { faixa: 'R$ 120k–240k', carga: 15.8 },
  { faixa: 'R$ 240k–480k', carga: 18.3 },
  { faixa: 'R$ 480k–960k', carga: 21.7 },
  { faixa: 'Acima R$ 960k', carga: 24.1 },
]

export const comparativeRows: ComparativeRow[] = [
  { item: 'IBS/CBS', regimeAtual: 'R$ 63.360', novoRegime: 'R$ 63.360' },
  { item: 'Funrural', regimeAtual: 'R$ 5.760', novoRegime: 'R$ 5.760' },
  { item: 'IRPF', regimeAtual: 'R$ 45.000', novoRegime: 'R$ 45.000' },
  { item: 'Adicional', regimeAtual: 'R$ 6.000', novoRegime: 'R$ 6.000' },
  { item: 'Total', regimeAtual: 'R$ 120.120', novoRegime: 'R$ 120.120' },
]
