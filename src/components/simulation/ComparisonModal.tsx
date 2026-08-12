import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchAllSimulacoes, fetchRendimentos, type SimulacaoRecord } from '@/services/simulacoes'
import { getFaixasIRPF, type FaixaIRPFRecord } from '@/services/faixas-irpf'
import { computeBreakdown, type ComparisonBreakdown } from '@/lib/comparison-utils'
import { formatCurrency, formatPercent } from '@/lib/tax-utils'
import { Loader2, GitCompare, ArrowLeft } from 'lucide-react'

interface ComparisonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComparisonModal({ open, onOpenChange }: ComparisonModalProps) {
  const [allSims, setAllSims] = useState<SimulacaoRecord[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [comparison, setComparison] = useState<
    (ComparisonBreakdown & { id: string; nome: string })[]
  >([])
  const [loading, setLoading] = useState(false)
  const [computing, setComputing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)
      setSelectedIds(new Set())
      setComparison([])
      setShowResults(false)
      fetchAllSimulacoes()
        .then(setAllSims)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [open])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 3) next.add(id)
      return next
    })
  }

  const handleCompare = async () => {
    if (selectedIds.size < 2 || selectedIds.size > 3) return
    setComputing(true)
    try {
      const faixas: FaixaIRPFRecord[] = await getFaixasIRPF()
      const selected = allSims.filter((s) => selectedIds.has(s.id))
      const results = await Promise.all(
        selected.map(async (sim) => {
          const rendimentos = await fetchRendimentos(sim.id)
          const totalRend = rendimentos.reduce((sum, r: any) => sum + (r.valor || 0), 0)
          const breakdown = computeBreakdown(sim, totalRend, faixas)
          return { ...breakdown, id: sim.id, nome: sim.expand?.produtor_id?.nome || 'N/A' }
        }),
      )
      setComparison(results)
      setShowResults(true)
    } catch (e) {
      console.error(e)
    } finally {
      setComputing(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setShowResults(false)
  }

  const rows: Array<[string, (c: ComparisonBreakdown) => string]> = [
    ['Receita Bruta', (c) => formatCurrency(c.receitaBruta)],
    ['IBS/CBS', (c) => formatCurrency(c.ibsCbs)],
    ['Funrural', (c) => formatCurrency(c.funrural)],
    ['Adicional Altas Rendas', (c) => formatCurrency(c.adicional)],
    ['IRPF', (c) => formatCurrency(c.irpf)],
    ['Total Tributos', (c) => formatCurrency(c.total)],
    ['Carga Tributária', (c) => formatPercent(c.cargaTributaria)],
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" /> Comparação de Simulações
          </DialogTitle>
          <DialogDescription>
            {showResults ? 'Resultado da comparação' : 'Selecione 2 ou 3 simulações para comparar'}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : showResults ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  {comparison.map((c) => (
                    <TableHead key={c.id} className="text-right">
                      {c.nome}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(([label, fn]) => (
                  <TableRow key={label}>
                    <TableCell className="font-medium">{label}</TableCell>
                    {comparison.map((c) => (
                      <TableCell key={c.id} className="text-right">
                        {fn(c)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="outline" onClick={() => setShowResults(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {allSims.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Sem dados</p>
              ) : (
                allSims.map((sim) => (
                  <label
                    key={sim.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedIds.has(sim.id)}
                      onCheckedChange={() => toggleSelect(sim.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {sim.expand?.produtor_id?.nome || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(sim.receita_bruta)} • {sim.status}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} selecionada(s)
              </span>
              <Button
                onClick={handleCompare}
                disabled={selectedIds.size < 2 || selectedIds.size > 3 || computing}
              >
                {computing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Comparar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
