import type {
  SimulationData,
  TaxResult,
  FaixaRendimento,
  ComparativeRow,
  SavedSimulation,
} from '@/lib/tax-types'

export function calculateTaxes(data: SimulationData): TaxResult {
  const base = data.receitaBruta - data.despesas
  const ibsCBS = data.receitaBruta * ((data.aliquotaIBS + data.aliquotaCBS) / 100)
  const funrural = data.receitaBruta * (data.aliquotaFunrural / 100)
  const adicional = base > 0 ? base * (data.aliquotaAdicional / 100) : 0
  const irpf = Math.max(0, base) * (data.aliquotaIRPF / 100)
  const totalTributos = ibsCBS + funrural + adicional + irpf
  const resultadoLiquido = base
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
  receitaBruta: 20000000,
  despesas: 17000000,
  aliquotaIBS: 6.5,
  aliquotaCBS: 4.0,
  aliquotaFunrural: 1.2,
  aliquotaAdicional: 10.03,
  aliquotaIRPF: 36.9,
}

export const mockResult: TaxResult = {
  ibsCBS: 2100000,
  funrural: 240000,
  adicional: 300830,
  irpf: 1107000,
  totalTributos: 3747830,
  resultadoLiquido: 3000000,
  cargaTributaria: 18.19,
}

export const faixasRendimento: FaixaRendimento[] = [
  { faixa: 'R$ 600k', carga: 15.2 },
  { faixa: 'R$ 700k', carga: 16.1 },
  { faixa: 'R$ 800k', carga: 16.8 },
  { faixa: 'R$ 900k', carga: 17.3 },
  { faixa: 'R$ 1.000k', carga: 17.7 },
  { faixa: 'R$ 1.100k', carga: 18.0 },
  { faixa: 'R$ 1.210k', carga: 18.4 },
]

export const comparativeRows: ComparativeRow[] = [
  { item: 'IBS/CBS', regimeAtual: 'R$ 2.640.000,00', novoRegime: 'R$ 2.100.000,00' },
  { item: 'Funrural', regimeAtual: 'R$ 240.000,00', novoRegime: 'R$ 240.000,00' },
  { item: 'IRPF', regimeAtual: 'R$ 1.107.000,00', novoRegime: 'R$ 1.107.000,00' },
  { item: 'Adicional Altas Rendas', regimeAtual: '—', novoRegime: 'R$ 300.830,00' },
  { item: 'Total', regimeAtual: 'R$ 3.987.000,00', novoRegime: 'R$ 3.747.830,00' },
]

export const mockSavedSimulations: SavedSimulation[] = [
  {
    id: '1',
    nome: 'Fazenda Santa Helena — 2025',
    data: '15/01/2025',
    receitaBruta: 20000000,
    totalTributos: 3747830,
    cargaTributaria: 18.19,
  },
  {
    id: '2',
    nome: 'Sítio Boa Vista — 2024',
    data: '10/12/2024',
    receitaBruta: 8500000,
    totalTributos: 1450000,
    cargaTributaria: 17.06,
  },
  {
    id: '3',
    nome: 'Fazenda Três Marias — 2024',
    data: '05/11/2024',
    receitaBruta: 12300000,
    totalTributos: 2280000,
    cargaTributaria: 18.54,
  },
]
