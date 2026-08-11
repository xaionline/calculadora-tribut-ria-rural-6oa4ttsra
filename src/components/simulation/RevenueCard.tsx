import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CurrencyInput } from '@/components/simulation/CurrencyInput'
import { formatCurrencyInput } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { SimulationFormState, SimulationFormComputed } from '@/lib/tax-types'

interface RevenueCardProps {
  form: SimulationFormState
  updateField: <K extends keyof SimulationFormState>(key: K, value: SimulationFormState[K]) => void
  computed: SimulationFormComputed
  isDespesaMaior: boolean
}

export function RevenueCard({ form, updateField, computed, isDespesaMaior }: RevenueCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas e Despesas</CardTitle>
        <CardDescription>Valores financeiros anuais da propriedade</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Receita Bruta Anual *</Label>
          <CurrencyInput
            value={form.receitaBrutaAnual}
            onChange={(v) => updateField('receitaBrutaAnual', v)}
          />
        </div>
        <div className="space-y-2">
          <Label>Despesa Anual *</Label>
          <CurrencyInput
            value={form.despesaAnual}
            onChange={(v) => updateField('despesaAnual', v)}
          />
        </div>
        {isDespesaMaior && (
          <Alert variant="destructive">
            <AlertDescription>
              A despesa anual não pode ser maior que a receita bruta anual.
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label>Resultado Líquido</Label>
          <div
            className={cn(
              'h-10 px-3 flex items-center rounded-md border text-sm font-semibold',
              computed.resultadoLiquido >= 0
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800'
                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
            )}
          >
            {formatCurrencyInput(computed.resultadoLiquido)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
