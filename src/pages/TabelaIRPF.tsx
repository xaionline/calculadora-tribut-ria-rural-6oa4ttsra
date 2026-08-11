import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'

const faixas = [
  { faixa: 'Até R$ 24.288,80', aliquota: '0%', deducao: 'R$ 0,00' },
  { faixa: 'R$ 24.288,81 a R$ 33.919,80', aliquota: '7,5%', deducao: 'R$ 1.821,66' },
  { faixa: 'R$ 33.919,81 a R$ 45.012,60', aliquota: '15%', deducao: 'R$ 4.365,81' },
  { faixa: 'R$ 45.012,61 a R$ 55.976,16', aliquota: '22,5%', deducao: 'R$ 7.742,76' },
  { faixa: 'Acima de R$ 55.976,16', aliquota: '27,5%', deducao: 'R$ 10.539,54' },
]

export default function TabelaIRPF() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Tabela IRPF</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tabela Progressiva Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faixa de Rendimentos</TableHead>
                <TableHead>Alíquota</TableHead>
                <TableHead>Dedução</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faixas.map((f) => (
                <TableRow key={f.faixa}>
                  <TableCell>{f.faixa}</TableCell>
                  <TableCell>{f.aliquota}</TableCell>
                  <TableCell>{f.deducao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
