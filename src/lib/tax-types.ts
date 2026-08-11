export interface SimulationData {
  receitaBruta: number
  despesas: number
  aliquotaIBS: number
  aliquotaCBS: number
  aliquotaFunrural: number
  aliquotaAdicional: number
  aliquotaIRPF: number
}

export interface TaxResult {
  ibsCBS: number
  funrural: number
  adicional: number
  irpf: number
  totalTributos: number
  resultadoLiquido: number
  cargaTributaria: number
}

export interface FaixaRendimento {
  faixa: string
  carga: number
}

export interface ComparativeRow {
  item: string
  regimeAtual: string
  novoRegime: string
}

export interface SavedSimulation {
  id: string
  nome: string
  data: string
  receitaBruta: number
  totalTributos: number
  cargaTributaria: number
}
