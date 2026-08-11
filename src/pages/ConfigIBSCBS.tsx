import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

const configItems = [
  {
    titulo: 'IBS — Imposto sobre Bens e Serviços',
    aliquota: 6.5,
    descricao: 'Substitui ICMS e ISS',
    cor: 'hsl(var(--chart-1))',
  },
  {
    titulo: 'CBS — Contribuição sobre Bens e Serviços',
    aliquota: 4.0,
    descricao: 'Substitui PIS e COFINS',
    cor: 'hsl(var(--chart-2))',
  },
]

const switchItems = [
  { label: 'Redução gradual (2026–2033)', desc: 'Aplica redução progressiva do regime atual' },
  { label: 'Cashback IBS/CBS', desc: 'Habilita cashback para o setor rural' },
  { label: 'Adicional Altas Rendas', desc: 'Aplica adicional sobre a base de cálculo' },
]

export default function ConfigIBSCBS() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações IBS/CBS</h1>
        <p className="text-muted-foreground">Parâmetros do novo regime tributário</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configItems.map((item) => (
          <Card key={item.titulo}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{item.titulo}</CardTitle>
                <Badge style={{ backgroundColor: item.cor }}>
                  {item.aliquota.toFixed(1).replace('.', ',')}%
                </Badge>
              </div>
              <CardDescription>{item.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Alíquota (%)</Label>
                <Input type="number" step="0.1" defaultValue={item.aliquota} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Período de Transição</CardTitle>
          <CardDescription>Configurações do cronograma de implementação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {switchItems.map((sw) => (
            <div key={sw.label} className="flex items-center justify-between">
              <div>
                <Label>{sw.label}</Label>
                <p className="text-sm text-muted-foreground">{sw.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
