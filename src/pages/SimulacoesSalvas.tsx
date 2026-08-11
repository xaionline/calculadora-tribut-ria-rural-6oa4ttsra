import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { mockSavedSimulations, formatCurrency, formatPercent } from '@/lib/tax-utils'
import { Eye, Trash2 } from 'lucide-react'

export default function SimulacoesSalvas() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulações Salvas</h1>
        <p className="text-muted-foreground">Histórico de simulações realizadas</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Simulações</CardTitle>
          <CardDescription>{mockSavedSimulations.length} simulações registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Receita Bruta</TableHead>
                <TableHead className="text-right">Total Tributos</TableHead>
                <TableHead className="text-right">Carga Tributária</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSavedSimulations.map((sim) => (
                <TableRow key={sim.id}>
                  <TableCell className="font-medium">{sim.nome}</TableCell>
                  <TableCell>{sim.data}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sim.receitaBruta)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sim.totalTributos)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={sim.cargaTributaria > 18 ? 'destructive' : 'secondary'}>
                      {formatPercent(sim.cargaTributaria)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
