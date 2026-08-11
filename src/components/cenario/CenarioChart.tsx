import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import {
  cenarioData,
  CENARIO_EQUILIBRIUM_RENDIMENTO,
  CENARIO_EQUILIBRIUM_ALIQUOTA,
} from '@/lib/cenario-utils'
import { formatCurrencyInput, formatPercentBR } from '@/lib/formatters'

interface CenarioChartProps {
  selectedRendimento: number
}

export function CenarioChart({ selectedRendimento }: CenarioChartProps) {
  const selectedPoint = cenarioData.find((d) => d.rendimento === selectedRendimento)
  const selectedAliquota = selectedPoint?.aliquota ?? 0

  return (
    <ChartContainer
      config={{ aliquota: { label: 'Alíquota Mínima', color: 'hsl(var(--chart-1))' } }}
      className="h-[350px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={cenarioData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id="cenarioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="rendimento"
            tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11 }}
            interval={9}
          />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(0).replace('.', ',')}%`}
            tick={{ fontSize: 12 }}
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip
            formatter={(v: number) => [formatPercentBR(v), 'Alíquota Mínima']}
            labelFormatter={(l) => formatCurrencyInput(Number(l))}
          />
          <Area
            type="monotone"
            dataKey="aliquota"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fill="url(#cenarioGradient)"
          />
          <ReferenceLine
            y={CENARIO_EQUILIBRIUM_ALIQUOTA}
            stroke="#86efac"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <ReferenceDot
            x={CENARIO_EQUILIBRIUM_RENDIMENTO}
            y={CENARIO_EQUILIBRIUM_ALIQUOTA}
            r={7}
            fill="#bbf7d0"
            stroke="#22c55e"
            strokeWidth={2}
          />
          <ReferenceDot
            x={selectedRendimento}
            y={selectedAliquota}
            r={7}
            fill="hsl(var(--chart-1))"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
