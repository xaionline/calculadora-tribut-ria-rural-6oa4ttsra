import pb from '@/lib/pocketbase/client'

export interface SimulacaoRecord {
  id: string
  produtor_id: string
  consultor_id: string
  ano_base: number
  receita_bruta: number
  despesa_anual: number
  iva_padrao: number
  reducao_percentual: number
  presuncao_percentual: number
  total_tributos: number
  carga_tributaria: number
  status: string
  created: string
  updated: string
  expand?: {
    produtor_id?: {
      id: string
      nome: string
      cpf_cnpj: string
      tipo_pessoa: string
      atividade_rural: string
      municipio: string
      uf: string
    }
    consultor_id?: { id: string; name: string; email: string }
  }
}

export async function fetchSimulacoes(params: {
  page: number
  perPage: number
  sort: string
  status?: string
  search?: string
}) {
  const filters: string[] = []

  if (params.status && params.status !== 'all') {
    filters.push(`status = "${params.status}"`)
  }

  if (params.search?.trim()) {
    const produtores = await pb.collection('produtores_rurais').getFullList({
      filter: `nome ~ "${params.search.trim()}"`,
    })
    if (produtores.length === 0) {
      return {
        items: [] as SimulacaoRecord[],
        page: 1,
        perPage: params.perPage,
        totalItems: 0,
        totalPages: 0,
      }
    }
    const ids = produtores.map((p) => `produtor_id = "${p.id}"`).join(' || ')
    filters.push(`(${ids})`)
  }

  const filter = filters.length > 0 ? filters.join(' && ') : ''

  return pb.collection('simulacoes').getList<SimulacaoRecord>(params.page, params.perPage, {
    sort: params.sort,
    filter,
    expand: 'produtor_id,consultor_id',
  })
}

export const getSimulacao = (id: string) =>
  pb.collection('simulacoes').getOne<SimulacaoRecord>(id, { expand: 'produtor_id,consultor_id' })

export const createSimulacao = (data: Record<string, unknown>) =>
  pb.collection('simulacoes').create(data)

export const updateSimulacao = (id: string, data: Record<string, unknown>) =>
  pb.collection('simulacoes').update(id, data)

export const deleteSimulacao = (id: string) => pb.collection('simulacoes').delete(id)

export async function fetchAllSimulacoes() {
  return pb.collection('simulacoes').getFullList<SimulacaoRecord>({
    sort: '-created',
    expand: 'produtor_id',
  })
}

export const createRendimento = (data: Record<string, unknown>) =>
  pb.collection('rendimentos_simulacao').create(data)

export const fetchRendimentos = (simulacaoId: string) =>
  pb.collection('rendimentos_simulacao').getFullList({
    filter: `simulacao_id = "${simulacaoId}"`,
  })
