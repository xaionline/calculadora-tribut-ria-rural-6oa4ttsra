import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { DistributionChart } from '@/components/dashboard/DistributionChart'
import { CargaLineChart } from '@/components/dashboard/CargaLineChart'
import { ComparativeTable } from '@/components/dashboard/ComparativeTable'
import { AlertBanner } from '@/components/dashboard/AlertBanner'
import { mockSimulation, mockResult, formatCurrency } from '@/lib/tax-utils'

const Index = () => {
  const simulation = mockSimulation
  const result = mockResult

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Tributário Rural</h1>
        <p className="text-muted-foreground">Visão geral dos tributos rurais com IBS/CBS e IRPF</p>
      </div>
      <AlertBanner cargaTributaria={result.cargaTributaria} />
      <KpiCards receitaBruta={simulation.receitaBruta} result={result} />
      <Card className="bg-muted/40">
        <CardContent className="py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Despesa Anual</span>
          <span className="text-lg font-semibold">{formatCurrency(simulation.despesas)}</span>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Tributos</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart result={result} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Carga Tributária por Faixa de Rendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <CargaLineChart />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Comparativo: Regime Atual vs Novo Regime (IBS/CBS)</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparativeTable />
        </CardContent>
      </Card>
    </div>
  )
}

export default Index
