import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import type { TaxResult } from '@/lib/tax-types'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
]

interface DistributionChartProps {
  result: TaxResult
}

export function DistributionChart({ result }: DistributionChartProps) {
  const data = [
    { name: 'IBS/CBS', value: result.ibsCBS },
    { name: 'Funrural', value: result.funrural },
    { name: 'Adicional', value: result.adicional },
    { name: 'IRPF', value: result.irpf },
  ]

  return (
    <ChartContainer
      config={{
        ibs: { label: 'IBS/CBS', color: 'hsl(var(--chart-1))' },
        funrural: { label: 'Funrural', color: 'hsl(var(--chart-2))' },
        adicional: { label: 'Adicional', color: 'hsl(var(--chart-3))' },
        irpf: { label: 'IRPF', color: 'hsl(var(--chart-4))' },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
