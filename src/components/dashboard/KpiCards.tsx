import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Wallet, Receipt, Percent } from 'lucide-react'
import type { TaxResult } from '@/lib/tax-types'
import { formatCurrency, formatPercent } from '@/lib/tax-utils'

interface KpiCardsProps {
  receitaBruta: number
  result: TaxResult
}

export function KpiCards({ receitaBruta, result }: KpiCardsProps) {
  const cards = [
    { title: 'Receita Bruta', value: formatCurrency(receitaBruta), icon: TrendingUp },
    { title: 'Resultado Líquido', value: formatCurrency(result.resultadoLiquido), icon: Wallet },
    { title: 'Total Tributos', value: formatCurrency(result.totalTributos), icon: Receipt },
    { title: 'Carga Tributária', value: formatPercent(result.cargaTributaria), icon: Percent },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
