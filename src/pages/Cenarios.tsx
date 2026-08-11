import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Cenarios() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Cenários</h1>
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Cenários</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Compare diferentes cenários tributários lado a lado.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
