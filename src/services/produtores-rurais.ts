import pb from '@/lib/pocketbase/client'

export interface ProdutorRecord {
  id: string
  nome: string
  cpf_cnpj: string
  tipo_pessoa: string
  atividade_rural: string
  municipio: string
  uf: string
  created: string
  updated: string
}

export const findProdutorByCpfCnpj = async (cpfCnpj: string): Promise<ProdutorRecord | null> => {
  try {
    const list = await pb.collection('produtores_rurais').getFullList<ProdutorRecord>({
      filter: `cpf_cnpj = "${cpfCnpj}"`,
    })
    return list[0] || null
  } catch {
    return null
  }
}

export const createProdutor = (data: Partial<ProdutorRecord>) =>
  pb.collection('produtores_rurais').create(data)
