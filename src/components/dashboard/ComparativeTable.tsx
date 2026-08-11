import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { comparativeRows } from '@/lib/tax-utils'

export function ComparativeTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Regime Atual</TableHead>
          <TableHead className="text-right">Novo Regime (IBS/CBS)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comparativeRows.map((row) => (
          <TableRow key={row.item}>
            <TableCell className="font-medium">{row.item}</TableCell>
            <TableCell className="text-right">{row.regimeAtual}</TableCell>
            <TableCell className="text-right">{row.novoRegime}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
