import pb from '@/lib/pocketbase/client'

export interface FaixaIRPFRecord {
  id: string
  ano_base: number
  ordem: number
  valor_minimo: number
  valor_maximo: number
  aliquota: number
  parcela_deduzir: number
  created: string
  updated: string
}

export const getFaixasIRPF = (anoBase?: number) =>
  pb.collection('faixas_irpf').getFullList<FaixaIRPFRecord>({
    sort: 'ordem',
    filter: anoBase ? `ano_base = ${anoBase}` : '',
  })

export const createFaixaIRPF = (data: Partial<FaixaIRPFRecord>) =>
  pb.collection('faixas_irpf').create(data)

export const updateFaixaIRPF = (id: string, data: Partial<FaixaIRPFRecord>) =>
  pb.collection('faixas_irpf').update(id, data)

export const deleteFaixaIRPF = (id: string) => pb.collection('faixas_irpf').delete(id)
