import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CurrencyInput } from '@/components/simulation/CurrencyInput'
import { formatCurrencyInput } from '@/lib/formatters'
import type { SimulationFormState, SimulationFormComputed } from '@/lib/tax-types'

interface RendimentosCardProps {
  form: SimulationFormState
  updateRendimento: (index: number, value: number) => void
  computed: SimulationFormComputed
}

export function RendimentosCard({ form, updateRendimento, computed }: RendimentosCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimentos Tributáveis</CardTitle>
        <CardDescription>Rendimentos para cálculo do IRPF-M</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rendimento</TableHead>
                <TableHead className="w-[200px]">Valor (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.rendimentos.map((rend, index) => (
                <TableRow key={rend.label}>
                  <TableCell className="font-medium">{rend.label}</TableCell>
                  <TableCell>
                    <CurrencyInput
                      value={rend.value}
                      onChange={(v) => updateRendimento(index, v)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="font-bold">
                  {formatCurrencyInput(computed.totalRendimentos)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">BC IRPF-M</TableCell>
                <TableCell className="font-bold">{formatCurrencyInput(computed.bcIrpfM)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
