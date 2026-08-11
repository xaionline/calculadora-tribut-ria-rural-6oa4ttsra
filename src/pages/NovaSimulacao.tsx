import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateTaxes, formatCurrency, formatPercent, mockSimulation } from '@/lib/tax-utils'
import type { SimulationData, TaxResult } from '@/lib/tax-types'

const financialFields = [
  { key: 'receitaBruta' as const, label: 'Receita Bruta Anual (R$)', step: 1000 },
  { key: 'despesas' as const, label: 'Despesas Anuais (R$)', step: 1000 },
]

const aliquotaFields = [
  { key: 'aliquotaIBS' as const, label: 'Alíquota IBS (%)', step: 0.1 },
  { key: 'aliquotaCBS' as const, label: 'Alíquota CBS (%)', step: 0.1 },
  { key: 'aliquotaFunrural' as const, label: 'Alíquota Funrural (%)', step: 0.1 },
  { key: 'aliquotaAdicional' as const, label: 'Adicional Altas Rendas (%)', step: 0.01 },
  { key: 'aliquotaIRPF' as const, label: 'Alíquota IRPF (%)', step: 0.1 },
]

export default function NovaSimulacao() {
  const [form, setForm] = useState<SimulationData>(mockSimulation)
  const [result, setResult] = useState<TaxResult | null>(null)

  const updateField = (field: keyof SimulationData, value: number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCalculate = () => {
    setResult(calculateTaxes(form))
  }

  const resultItems = result
    ? [
        { label: 'IBS/CBS', value: formatCurrency(result.ibsCBS) },
        { label: 'Funrural', value: formatCurrency(result.funrural) },
        { label: 'Adicional Altas Rendas', value: formatCurrency(result.adicional) },
        { label: 'IRPF', value: formatCurrency(result.irpf) },
        { label: 'Total Tributos', value: formatCurrency(result.totalTributos) },
        { label: 'Carga Tributária', value: formatPercent(result.cargaTributaria) },
      ]
    : []

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nova Simulação</h1>
        <p className="text-muted-foreground">Configure os parâmetros para calcular os tributos</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Financeiros</CardTitle>
            <CardDescription>Receitas e despesas da propriedade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {financialFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type="number"
                  step={field.step}
                  value={form[field.key]}
                  onChange={(e) => updateField(field.key, +e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alíquotas</CardTitle>
            <CardDescription>Configuração das taxas aplicáveis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aliquotaFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type="number"
                  step={field.step}
                  value={form[field.key]}
                  onChange={(e) => updateField(field.key, +e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Button onClick={handleCalculate} size="lg">
        Calcular Tributos
      </Button>
      {result && (
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Resultado da Simulação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {resultItems.map((item) => (
                <div key={item.label}>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
