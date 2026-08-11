import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { CenarioChart } from '@/components/cenario/CenarioChart'
import { CenarioTable } from '@/components/cenario/CenarioTable'
import {
  CENARIO_MIN,
  CENARIO_MAX,
  CENARIO_STEP,
  CENARIO_EQUILIBRIUM_RENDIMENTO,
  calculateAliquotaMinima,
} from '@/lib/cenario-utils'
import { formatCurrencyInput, formatPercentBR } from '@/lib/formatters'
import { ArrowLeft, ArrowRight, TrendingUp, Target, GitCompare } from 'lucide-react'

export default function SimulacaoCenarios() {
  const navigate = useNavigate()
  const [rendimento, setRendimento] = useState(CENARIO_MIN)

  const aliquota = calculateAliquotaMinima(rendimento)

  const handleUseScenario = () => {
    navigate('/nova-simulacao', { state: { receitaBrutaAnual: rendimento } })
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitCompare className="h-6 w-6" />
            Simulação de Cenários
          </h1>
          <p className="text-muted-foreground">
            Projeção da alíquota mínima efetiva por faixa de rendimento
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cenário Selecionado
          </CardTitle>
          <CardDescription>
            Ajuste o slider para explorar diferentes faixas de rendimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Rendimento Anual</span>
              <Badge variant="secondary" className="text-lg font-bold px-4 py-1.5">
                {formatCurrencyInput(rendimento)}
              </Badge>
            </div>
            <Slider
              value={[rendimento]}
              onValueChange={(v) => setRendimento(v[0])}
              min={CENARIO_MIN}
              max={CENARIO_MAX}
              step={CENARIO_STEP}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrencyInput(CENARIO_MIN)}</span>
              <span>{formatCurrencyInput(CENARIO_MAX)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">Alíquota Mínima Efetiva</p>
              <p className="text-2xl font-bold text-primary">{formatPercentBR(aliquota)}</p>
            </div>
            <div className="rounded-lg border p-4 space-y-1 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Target className="h-4 w-4 text-green-600" />
                Ponto de Equilíbrio Fiscal (5%)
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrencyInput(CENARIO_EQUILIBRIUM_RENDIMENTO)}
              </p>
            </div>
          </div>

          <Button onClick={handleUseScenario} size="lg" className="w-full">
            Usar este cenário
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Alíquota Mínima</CardTitle>
            <CardDescription>
              Área sombreada representa a projeção da alíquota mínima efetiva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CenarioChart selectedRendimento={rendimento} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabela Detalhada</CardTitle>
            <CardDescription>
              Valores de R$ 600.000 a R$ 1.210.000 em incrementos de R$ 10.000
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CenarioTable selectedRendimento={rendimento} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
