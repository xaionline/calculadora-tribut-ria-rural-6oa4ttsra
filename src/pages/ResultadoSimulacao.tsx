import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { DistributionChart } from '@/components/dashboard/DistributionChart'
import { calculateFormTaxes, formatCurrency, formatPercent } from '@/lib/tax-utils'
import { findIrpfBracket, calculateIrpf } from '@/lib/irpf-brackets'
import type { SimulationFormState } from '@/lib/tax-types'
import { ArrowLeft, FileText, PiggyBank, TrendingDown, Percent, Receipt } from 'lucide-react'

export default function ResultadoSimulacao() {
  const location = useLocation()
  const navigate = useNavigate()

  const form = location.state as SimulationFormState | null

  if (!form) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Resultado da Simulação</h1>
          <p className="text-muted-foreground">
            Nenhuma simulação foi encontrada. Inicie uma nova simulação.
          </p>
        </div>
        <Button onClick={() => navigate('/nova-simulacao')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Nova Simulação
        </Button>
      </div>
    )
  }

  const computed = calculateFormTaxes(form)
  const baseCalculo = Math.max(0, form.receitaBrutaAnual - (form.despesas || 0))
  const { bracket, valor: irpfValor } = calculateIrpf(baseCalculo)
  const resultadoLiquido = form.receitaBrutaAnual - computed.totalTributos - (form.despesas || 0)

  const kpiItems = [
    {
      label: 'Receita Bruta Anual',
      value: formatCurrency(form.receitaBrutaAnual),
      icon: PiggyBank,
      color: 'text-green-600',
    },
    {
      label: 'Total de Tributos',
      value: formatCurrency(computed.totalTributos),
      icon: Receipt,
      color: 'text-red-600',
    },
    {
      label: 'Carga Tributária',
      value: formatPercent(computed.cargaTributaria),
      icon: Percent,
      color: 'text-orange-600',
    },
    {
      label: 'Resultado Líquido',
      value: formatCurrency(resultadoLiquido),
      icon: resultadoLiquido >= 0 ? TrendingDown : TrendingDown,
      color: resultadoLiquido >= 0 ? 'text-blue-600' : 'text-red-600',
    },
  ]

  const taxRows = [
    { label: 'IBS/CBS', value: computed.ibsCBS ?? 0 },
    { label: 'Funrural', value: computed.funrural ?? 0 },
    { label: 'Adicional Altas Rendas', value: computed.adicional ?? 0 },
    { label: 'IRPF', value: computed.irpf ?? 0 },
  ]

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resultado da Simulação</h1>
          <p className="text-muted-foreground">
            Análise tributária para {form.nomeProdutor || 'Produtor'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/nova-simulacao')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiItems.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento de Tributos</CardTitle>
            <CardDescription>Valores calculados por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tributo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxRows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(row.value)}
                    </TableCell>
                  </TableRow>
                ))}
                <Separator className="my-2" />
                <TableRow className="font-bold">
                  <TableCell>Total Tributos</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(computed.totalTributos)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Tributos</CardTitle>
            <CardDescription>Participação de cada tributo no total</CardDescription>
          </CardHeader>
          <CardContent>
            <DistributionChart result={computed} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Faixa IRPF Aplicada
          </CardTitle>
          <CardDescription>Base de cálculo: {formatCurrency(baseCalculo)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              {bracket.faixaLabel}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Alíquota: <strong className="text-foreground">{bracket.aliquotaLabel}</strong>
            </span>
            <span className="text-sm text-muted-foreground">
              Parcela a deduzir: <strong className="text-foreground">{bracket.deducaoLabel}</strong>
            </span>
            <span className="text-sm text-muted-foreground">
              IRPF devido: <strong className="text-foreground">{formatCurrency(irpfValor)}</strong>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
