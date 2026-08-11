import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProducerCard } from '@/components/simulation/ProducerCard'
import { RevenueCard } from '@/components/simulation/RevenueCard'
import { IbsCbsCard } from '@/components/simulation/IbsCbsCard'
import { RendimentosCard } from '@/components/simulation/RendimentosCard'
import { useSimulationForm } from '@/hooks/use-simulation-form'
import { toast } from 'sonner'
import { Calculator, Save, AlertTriangle } from 'lucide-react'

export default function NovaSimulacao() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialReceita = (location.state as { receitaBrutaAnual?: number } | null)
    ?.receitaBrutaAnual
  const { form, updateField, updateRendimento, computed, isDespesaMaior } =
    useSimulationForm(initialReceita)

  const handleCalculate = () => {
    navigate('/resultado-simulacao', { state: form })
    toast.success('Cálculo realizado com sucesso!')
  }

  const handleSave = () => {
    if (!form.nomeProdutor.trim()) {
      toast.error('Informe o nome do produtor.')
      return
    }
    if (!form.cpfCnpj.trim()) {
      toast.error('Informe o CPF/CNPJ.')
      return
    }
    if (form.receitaBrutaAnual <= 0) {
      toast.error('A receita bruta anual deve ser maior que zero.')
      return
    }
    const saved = JSON.parse(localStorage.getItem('savedSimulations') || '[]')
    saved.push({
      id: Date.now().toString(),
      nome: form.nomeProdutor,
      data: new Date().toLocaleDateString('pt-BR'),
      receitaBruta: form.receitaBrutaAnual,
      totalTributos: computed.totalTributos,
      cargaTributaria: computed.cargaTributaria,
    })
    localStorage.setItem('savedSimulations', JSON.stringify(saved))
    toast.success('Simulação salva com sucesso!')
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
          <Calculator className="h-5 w-5 mr-2" />
          Calcular Tributos
        </Button>
        <Button onClick={handleSave} variant="outline" size="lg" className="flex-1">
          <Save className="h-5 w-5 mr-2" />
          Salvar Simulação
        </Button>
      </div>
    </div>
  )
}
