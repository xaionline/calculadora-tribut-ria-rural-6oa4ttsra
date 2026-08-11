import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { faixasRendimento } from '@/lib/tax-utils'

export function CargaLineChart() {
  return (
    <ChartContainer
      config={{ carga: { label: 'Carga Tributária', color: 'hsl(var(--chart-1))' } }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={faixasRendimento}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="faixa" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Line type="monotone" dataKey="carga" stroke="hsl(var(--chart-1))" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
