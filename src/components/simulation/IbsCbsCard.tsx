import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrencyInput, formatPercentBR } from '@/lib/formatters'
import type { SimulationFormState, SimulationFormComputed } from '@/lib/tax-types'

interface IbsCbsCardProps {
  form: SimulationFormState
  updateField: <K extends keyof SimulationFormState>(key: K, value: SimulationFormState[K]) => void
  computed: SimulationFormComputed
}

export function IbsCbsCard({ form, updateField, computed }: IbsCbsCardProps) {
  const pctInput = (key: 'ivaPadrao' | 'reducao' | 'presuncaoBC', value: number) => (
    <div className="relative">
      <Input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => updateField(key, Math.max(0, +e.target.value || 0))}
        className="pr-8"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        %
      </span>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração IBS/CBS</CardTitle>
        <CardDescription>Parâmetros do novo regime tributário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>IVA Padrão</Label>
            {pctInput('ivaPadrao', form.ivaPadrao)}
          </div>
          <div className="space-y-2">
            <Label>Redução</Label>
            {pctInput('reducao', form.reducao)}
          </div>
        </div>
        <div className="space-y-2">
          <Label>IVA Reduzido</Label>
          <div className="h-10 px-3 flex items-center rounded-md border bg-muted text-sm font-semibold">
            {formatPercentBR(computed.ivaReduzido)}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Presunção BC</Label>
          {pctInput('presuncaoBC', form.presuncaoBC)}
        </div>
        <div className="space-y-2">
          <Label>BC IBS/CBS</Label>
          <div className="h-10 px-3 flex items-center rounded-md border bg-muted text-sm font-semibold">
            {formatCurrencyInput(computed.bcIbsCbs)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
