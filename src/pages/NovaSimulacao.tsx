import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProducerCard } from '@/components/simulation/ProducerCard'
import { RevenueCard } from '@/components/simulation/RevenueCard'
import { IbsCbsCard } from '@/components/simulation/IbsCbsCard'
import { RendimentosCard } from '@/components/simulation/RendimentosCard'
import { useSimulationForm } from '@/hooks/use-simulation-form'
import { useAuth } from '@/hooks/use-auth'
import { findProdutorByCpfCnpj, createProdutor } from '@/services/produtores-rurais'
import { createSimulacao, createRendimento } from '@/services/simulacoes'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import { Calculator, Save, AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'

const RENDIMENTO_MAP: Record<string, string> = {
  Salários: 'SALARIOS',
  'Pró-Labore': 'PRO_LABORE',
  Aluguéis: 'ALUGUEIS',
  Honorários: 'HONORARIOS',
  'Outros Rendimentos': 'OUTROS',
  Dividendos: 'DIVIDENDOS',
}

export default function NovaSimulacao() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const initialReceita = (location.state as { receitaBrutaAnual?: number } | null)
    ?.receitaBrutaAnual
  const { form, updateField, updateRendimento, computed, isDespesaMaior, errors, isValid } =
    useSimulationForm(initialReceita)
  const [saving, setSaving] = useState(false)

  const handleCalculate = () => {
    navigate('/resultado-simulacao', { state: form })
    toast.success('Cálculo realizado com sucesso!')
  }

  const handleSave = async () => {
    if (!isValid) {
      toast.error('Corrija os erros antes de salvar.')
      return
    }
    setSaving(true)
    try {
      let produtor = await findProdutorByCpfCnpj(form.cpfCnpj)
      if (!produtor) {
        produtor = (await createProdutor({
          nome: form.nomeProdutor,
          cpf_cnpj: form.cpfCnpj,
          tipo_pessoa: form.tipoPessoa,
          atividade_rural: form.atividadeRural,
          municipio: form.municipio,
          uf: form.uf,
        })) as any
      }
      const sim = (await createSimulacao({
        produtor_id: produtor.id,
        consultor_id: user?.id,
        ano_base: 2025,
        receita_bruta: form.receitaBrutaAnual,
        despesa_anual: form.despesaAnual,
        iva_padrao: form.ivaPadrao,
        reducao_percentual: form.reducao,
        presuncao_percentual: form.presuncaoBC,
        total_tributos: computed.totalTributos,
        carga_tributaria: computed.cargaTributaria,
        status: 'CALCULADA',
      })) as any
      for (const r of form.rendimentos) {
        if (r.value > 0 && RENDIMENTO_MAP[r.label]) {
          await createRendimento({
            simulacao_id: sim.id,
            tipo_rendimento: RENDIMENTO_MAP[r.label],
            valor: r.value,
          })
        }
      }
      toast.success('Simulação salva com sucesso!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nova Simulação</h1>
        <p className="text-muted-foreground">
          Preencha os dados para calcular os tributos do novo regime
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProducerCard form={form} updateField={updateField} />
        <RevenueCard
          form={form}
          updateField={updateField}
          computed={computed}
          isDespesaMaior={isDespesaMaior}
        />
        <IbsCbsCard form={form} updateField={updateField} computed={computed} />
        <RendimentosCard form={form} updateRendimento={updateRendimento} computed={computed} />
      </div>
      {(errors.nomeProdutor || errors.cpfCnpj || errors.receitaBrutaAnual) && (
        <Card className="border-destructive">
          <CardContent className="py-3 space-y-1">
            {Object.entries(errors).map(([key, msg]) => (
              <p key={key} className="text-sm text-destructive">
                {msg}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
      {isDespesaMaior && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            A despesa anual é maior que a receita bruta. O resultado líquido está negativo.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleCalculate} size="lg" className="flex-1">
          <Calculator className="h-5 w-5 mr-2" /> Calcular Tributos
        </Button>
        <Button
          onClick={handleSave}
          variant="outline"
          size="lg"
          disabled={!isValid || saving}
          className="flex-1"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}{' '}
          Salvar Simulação
        </Button>
      </div>
    </div>
  )
}
