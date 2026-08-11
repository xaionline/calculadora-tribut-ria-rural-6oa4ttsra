import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SST() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">SST — Segurança e Saúde no Trabalho</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestão SST Rural</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ferramentas e documentos para gestão de SST na propriedade rural.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
