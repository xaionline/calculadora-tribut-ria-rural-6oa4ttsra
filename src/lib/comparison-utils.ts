import type { FaixaIRPFRecord } from '@/services/faixas-irpf'

interface SimFields {
  receita_bruta: number
  despesa_anual: number
  iva_padrao: number
  reducao_percentual: number
  presuncao_percentual: number
}

export interface ComparisonBreakdown {
  receitaBruta: number
  ibsCbs: number
  funrural: number
  adicional: number
  irpf: number
  total: number
  cargaTributaria: number
}

export function computeBreakdown(
  sim: SimFields,
  totalRendimentos: number,
  faixas: FaixaIRPFRecord[],
): ComparisonBreakdown {
  const receitaBruta = sim.receita_bruta || 0
  const despesaAnual = sim.despesa_anual || 0
  const ivaPadrao = sim.iva_padrao || 26.5
  const reducao = sim.reducao_percentual || 60
  const presuncao = sim.presuncao_percentual || 20

  const resultadoLiquido = receitaBruta - despesaAnual
  const ivaReduzido = ivaPadrao * (1 - reducao / 100)
  const bcIbsCbs = Math.max(0, resultadoLiquido) * (presuncao / 100)
  const bcIrpf = totalRendimentos + bcIbsCbs

  const ibsCbs = bcIbsCbs * (ivaReduzido / 100)
  const funrural = receitaBruta * 0.012
  const adicional = resultadoLiquido > 0 ? resultadoLiquido * 0.1003 : 0

  let irpf = 0
  for (const f of faixas) {
    const max = f.valor_maximo || 0
    if (max === 0 || bcIrpf <= max) {
      irpf = Math.max(0, (bcIrpf * f.aliquota) / 100 - f.parcela_deduzir)
      break
    }
  }

  const total = ibsCbs + funrural + adicional + irpf
  const cargaTributaria = receitaBruta > 0 ? (total / receitaBruta) * 100 : 0

  return { receitaBruta, ibsCbs, funrural, adicional, irpf, total, cargaTributaria }
}
