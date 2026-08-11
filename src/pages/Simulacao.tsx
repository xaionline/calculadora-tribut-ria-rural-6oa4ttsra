import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Simulacao() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Simulação Tributária</h1>
      <Card>
        <CardHeader>
          <CardTitle>Nova Simulação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure os parâmetros da sua propriedade rural para calcular os tributos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
