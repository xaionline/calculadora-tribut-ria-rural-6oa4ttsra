import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
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
import { ComparisonModal } from '@/components/simulation/ComparisonModal'
import { useSimulacoesListing } from '@/hooks/use-simulacoes-listing'
import { useAuth } from '@/hooks/use-auth'
import { deleteSimulacao } from '@/services/simulacoes'
import { formatCurrency, formatPercent } from '@/lib/tax-utils'
import { toast } from 'sonner'
import { Eye, Trash2, Search, GitCompare, ChevronLeft, ChevronRight } from 'lucide-react'

const statusVariant: Record<string, 'secondary' | 'default' | 'destructive' | 'outline'> = {
  RASCUNHO: 'secondary',
  CALCULADA: 'default',
  APROVADA: 'outline',
  ARQUIVADA: 'destructive',
}

export default function SimulacoesSalvas() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isConsultor = user?.role === 'CONSULTOR'
  const {
    data,
    loading,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    sort,
    setSort,
    page,
    setPage,
  } = useSimulacoesListing()
  const [compareOpen, setCompareOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleView = (sim: any) => {
    navigate('/resultado-simulacao', {
      state: {
        nomeProdutor: sim.expand?.produtor_id?.nome || '',
        cpfCnpj: sim.expand?.produtor_id?.cpf_cnpj || '',
        tipoPessoa: sim.expand?.produtor_id?.tipo_pessoa || 'PESSOA_FISICA',
        atividadeRural: sim.expand?.produtor_id?.atividade_rural || '',
        municipio: sim.expand?.produtor_id?.municipio || '',
        uf: sim.expand?.produtor_id?.uf || '',
        receitaBrutaAnual: sim.receita_bruta,
        despesaAnual: sim.despesa_anual,
        ivaPadrao: sim.iva_padrao,
        reducao: sim.reducao_percentual,
        presuncaoBC: sim.presuncao_percentual,
        rendimentos: [],
      },
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSimulacao(deleteId)
      toast.success('Simulação excluída')
    } catch {
      toast.error('Erro ao excluir')
    }
    setDeleteId(null)
  }

  const items = data?.items || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Simulações Salvas</h1>
          <p className="text-muted-foreground">Histórico de simulações realizadas</p>
        </div>
        <Button variant="outline" onClick={() => setCompareOpen(true)}>
          <GitCompare className="h-4 w-4 mr-2" /> Comparar
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por produtor..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="RASCUNHO">Rascunho</SelectItem>
            <SelectItem value="CALCULADA">Calculada</SelectItem>
            <SelectItem value="APROVADA">Aprovada</SelectItem>
            <SelectItem value="ARQUIVADA">Arquivada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created">Mais recentes</SelectItem>
            <SelectItem value="created">Mais antigas</SelectItem>
            <SelectItem value="-receita_bruta">Maior receita</SelectItem>
            <SelectItem value="receita_bruta">Menor receita</SelectItem>
            <SelectItem value="-total_tributos">Maior tributos</SelectItem>
            <SelectItem value="total_tributos">Menor tributos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Sem dados</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produtor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Receita Bruta</TableHead>
                    <TableHead className="text-right">Total Tributos</TableHead>
                    <TableHead className="text-right">Carga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((sim: any) => (
                    <TableRow key={sim.id}>
                      <TableCell className="font-medium">
                        {sim.expand?.produtor_id?.nome || 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(sim.created).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(sim.receita_bruta)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(sim.total_tributos)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={sim.carga_tributaria > 18 ? 'destructive' : 'secondary'}>
                          {formatPercent(sim.carga_tributaria)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[sim.status] || 'secondary'}>
                          {sim.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleView(sim)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isConsultor && (
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(sim.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {!loading && items.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Próxima <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <ComparisonModal open={compareOpen} onOpenChange={setCompareOpen} />
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
