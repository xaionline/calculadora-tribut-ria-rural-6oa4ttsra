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

export type TipoPessoa = 'PESSOA_FISICA' | 'PESSOA_JURIDICA'

export interface SimulationFormState {
  nomeProdutor: string
  cpfCnpj: string
  tipoPessoa: TipoPessoa
  atividadeRural: string
  municipio: string
  uf: string
  receitaBrutaAnual: number
  despesaAnual: number
  ivaPadrao: number
  reducao: number
  presuncaoBC: number
  rendimentos: { label: string; value: number }[]
}

export interface SimulationFormComputed {
  resultadoLiquido: number
  ivaReduzido: number
  bcIbsCbs: number
  totalRendimentos: number
  bcIrpfM: number
  ibsCbsTax: number
  irpfTax: number
  totalTributos: number
  cargaTributaria: number
}
