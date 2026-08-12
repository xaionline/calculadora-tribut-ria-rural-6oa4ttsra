import { useState, useMemo } from 'react'
import type { SimulationFormState, SimulationFormComputed } from '@/lib/tax-types'
import { calculateFormTaxes } from '@/lib/tax-utils'

const defaultForm: SimulationFormState = {
  nomeProdutor: '',
  cpfCnpj: '',
  tipoPessoa: 'PESSOA_FISICA',
  atividadeRural: '',
  municipio: '',
  uf: '',
  receitaBrutaAnual: 20000000,
  despesaAnual: 17000000,
  ivaPadrao: 26.5,
  reducao: 60,
  presuncaoBC: 20,
  rendimentos: [
    { label: 'Salários', value: 0 },
    { label: 'Pró-Labore', value: 0 },
    { label: 'Aluguéis', value: 0 },
    { label: 'Honorários', value: 0 },
    { label: 'Outros Rendimentos', value: 0 },
    { label: 'Dividendos', value: 0 },
  ],
}

export function useSimulationForm(initialReceitaBruta?: number) {
  const [form, setForm] = useState<SimulationFormState>({
    ...defaultForm,
    ...(initialReceitaBruta !== undefined ? { receitaBrutaAnual: initialReceitaBruta } : {}),
  })

  const updateField = <K extends keyof SimulationFormState>(
    key: K,
    value: SimulationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateRendimento = (index: number, value: number) => {
    setForm((prev) => ({
      ...prev,
      rendimentos: prev.rendimentos.map((r, i) => (i === index ? { ...r, value } : r)),
    }))
  }

  const computed = useMemo(() => calculateFormTaxes(form), [form])
  const isDespesaMaior = form.despesaAnual > form.receitaBrutaAnual

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (!form.nomeProdutor.trim()) e.nomeProdutor = 'Nome do produtor é obrigatório'
    if (!form.cpfCnpj.trim()) e.cpfCnpj = 'CPF/CNPJ é obrigatório'
    if (form.receitaBrutaAnual <= 0) e.receitaBrutaAnual = 'Receita deve ser maior que zero'
    return e
  }, [form])

  const isValid = Object.keys(errors).length === 0

  return { form, updateField, updateRendimento, computed, isDespesaMaior, errors, isValid }
}
