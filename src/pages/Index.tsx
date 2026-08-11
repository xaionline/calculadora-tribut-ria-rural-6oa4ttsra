import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { DistributionChart } from '@/components/dashboard/DistributionChart'
import { CargaLineChart } from '@/components/dashboard/CargaLineChart'
import { ComparativeTable } from '@/components/dashboard/ComparativeTable'
import { AlertBanner } from '@/components/dashboard/AlertBanner'
import { calculateTaxes, mockSimulation } from '@/lib/tax-utils'
import type { SimulationData } from '@/lib/tax-types'

const Index = () => {
  const [simulation, setSimulation] = useState<SimulationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((r) => setTimeout(r, 300))
        setSimulation(mockSimulation)
      } catch {
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!simulation) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Nenhuma simulação encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Crie uma simulação para visualizar os dados do dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const result = calculateTaxes(simulation)

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Tributário Rural</h1>
        <p className="text-muted-foreground">Visão geral dos tributos rurais com IBS/CBS e IRPF</p>
      </div>
      <AlertBanner cargaTributaria={result.cargaTributaria} />
      <KpiCards receitaBruta={simulation.receitaBruta} result={result} />
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
