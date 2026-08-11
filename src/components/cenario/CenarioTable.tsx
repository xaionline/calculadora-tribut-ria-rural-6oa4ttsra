import { useEffect, useRef } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { cenarioData } from '@/lib/cenario-utils'
import { cn } from '@/lib/utils'

interface CenarioTableProps {
  selectedRendimento: number
}

export function CenarioTable({ selectedRendimento }: CenarioTableProps) {
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([])

  useEffect(() => {
    const index = cenarioData.findIndex((d) => d.rendimento === selectedRendimento)
    if (index >= 0 && rowRefs.current[index]) {
      rowRefs.current[index]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [selectedRendimento])

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead>Rendimento (R$)</TableHead>
            <TableHead className="text-right">Alíquota Mínima (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cenarioData.map((row, i) => (
            <TableRow
              key={row.rendimento}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              className={cn(
                row.isEquilibrium && 'bg-green-100 dark:bg-green-950/40',
                row.rendimento === selectedRendimento &&
                  !row.isEquilibrium &&
                  'bg-primary/10 font-semibold',
                row.rendimento === selectedRendimento &&
                  row.isEquilibrium &&
                  'bg-green-200 dark:bg-green-900/50 font-semibold',
              )}
            >
              <TableCell>{row.rendimentoLabel}</TableCell>
              <TableCell className="text-right">{row.aliquotaLabel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
