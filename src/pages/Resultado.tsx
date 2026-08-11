import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Resultado() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Resultado</h1>
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento do Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Os resultados detalhados da simulação serão exibidos aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
