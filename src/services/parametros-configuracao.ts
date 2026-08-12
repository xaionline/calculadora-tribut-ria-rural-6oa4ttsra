import pb from '@/lib/pocketbase/client'

export interface ParametrosConfig {
  id: string
  iva_padrao: number
  reducao_percentual: number
  presuncao_percentual: number
  aliquota_funrural: number
  aliquota_adicional: number
  created: string
  updated: string
}

export const DEFAULT_PARAMS = {
  iva_padrao: 26.5,
  reducao_percentual: 60,
  presuncao_percentual: 20,
  aliquota_funrural: 1.2,
  aliquota_adicional: 10.03,
}

export const getParametros = async (): Promise<ParametrosConfig> => {
  try {
    const list = await pb.collection('parametros_configuracao').getFullList<ParametrosConfig>({
      sort: '-created',
    })
    if (list.length > 0) return list[0]
  } catch {
    /* intentionally ignored */
  }
  return { id: '', ...DEFAULT_PARAMS, created: '', updated: '' }
}

export const saveParametros = (id: string | null, data: Partial<ParametrosConfig>) => {
  if (id) {
    return pb.collection('parametros_configuracao').update(id, data)
  }
  return pb.collection('parametros_configuracao').create(data)
}
