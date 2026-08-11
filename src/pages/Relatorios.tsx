import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { DistributionChart } from '@/components/dashboard/DistributionChart'
import { ComparativeTable } from '@/components/dashboard/ComparativeTable'
import { mockSimulation, mockResult, formatCurrency, formatPercent } from '@/lib/tax-utils'
import { Download, Printer } from 'lucide-react'

export default function Relatorios() {
  const sim = mockSimulation
  const result = mockResult

  const reportRows = [
    { label: 'Receita Bruta', value: formatCurrency(sim.receitaBruta) },
    { label: 'Despesas Anuais', value: formatCurrency(sim.despesas) },
    { label: 'Base de Cálculo', value: formatCurrency(sim.receitaBruta - sim.despesas) },
    { label: 'IBS/CBS', value: formatCurrency(result.ibsCBS) },
    { label: 'Funrural', value: formatCurrency(result.funrural) },
    { label: 'Adicional Altas Rendas', value: formatCurrency(result.adicional) },
    { label: 'IRPF', value: formatCurrency(result.irpf) },
    { label: 'Total Tributos', value: formatCurrency(result.totalTributos) },
    { label: 'Carga Tributária', value: formatPercent(result.cargaTributaria) },
  ]

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada da carga tributária</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Tributos — Pessoa Física Rural</CardTitle>
          <CardDescription>Demonstrativo de cálculo IBS/CBS + IRPF</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportRows.map((row, i) => (
                <TableRow key={i} className={i >= 7 ? 'font-bold' : ''}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            <CardTitle>Comparativo de Regimes</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparativeTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
