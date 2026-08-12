import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { FaixaIRPFDialog } from '@/components/simulation/FaixaIRPFDialog'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { getFaixasIRPF, deleteFaixaIRPF, type FaixaIRPFRecord } from '@/services/faixas-irpf'
import { formatCurrency } from '@/lib/tax-utils'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function TabelaIRPF() {
  const { user } = useAuth()
  const isConsultor = user?.role === 'CONSULTOR'
  const [faixas, setFaixas] = useState<FaixaIRPFRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFaixa, setEditingFaixa] = useState<FaixaIRPFRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const anoBase = 2025

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      setFaixas(await getFaixasIRPF(anoBase))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('faixas_irpf', () => {
    loadData()
  })

  const handleCreate = () => {
    setEditingFaixa(null)
    setDialogOpen(true)
  }
  const handleEdit = (f: FaixaIRPFRecord) => {
    setEditingFaixa(f)
    setDialogOpen(true)
  }
  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteFaixaIRPF(deleteId)
      toast.success('Faixa excluída')
    } catch {
      toast.error('Erro ao excluir')
    }
    setDeleteId(null)
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tabela IRPF</h1>
          <p className="text-muted-foreground">Faixas do imposto de renda — {anoBase}</p>
        </div>
        {isConsultor && (
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" /> Nova Faixa
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : faixas.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Sem dados</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Valor Mínimo</TableHead>
                    <TableHead>Valor Máximo</TableHead>
                    <TableHead>Alíquota</TableHead>
                    <TableHead>Parcela a Deduzir</TableHead>
                    {isConsultor && <TableHead className="text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faixas.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.ordem}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatCurrency(f.valor_minimo)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {f.valor_maximo ? formatCurrency(f.valor_maximo) : '—'}
                      </TableCell>
                      <TableCell>{f.aliquota}%</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatCurrency(f.parcela_deduzir)}
                      </TableCell>
                      {isConsultor && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(f)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(f.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <FaixaIRPFDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        faixa={editingFaixa}
        otherFaixas={faixas.filter((f) => f.id !== editingFaixa?.id)}
        anoBase={anoBase}
        onSaved={() => {
          setDialogOpen(false)
          setEditingFaixa(null)
          loadData()
        }}
      />
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
