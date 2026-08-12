import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFaixaIRPF, updateFaixaIRPF, type FaixaIRPFRecord } from '@/services/faixas-irpf'
import { formatCurrency } from '@/lib/tax-utils'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface FaixaIRPFDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  faixa: FaixaIRPFRecord | null
  otherFaixas: FaixaIRPFRecord[]
  anoBase: number
  onSaved: () => void
}

export function FaixaIRPFDialog({
  open,
  onOpenChange,
  faixa,
  otherFaixas,
  anoBase,
  onSaved,
}: FaixaIRPFDialogProps) {
  const [form, setForm] = useState({
    ordem: 1,
    valor_minimo: 0,
    valor_maximo: 0,
    aliquota: 0,
    parcela_deduzir: 0,
  })
  const [maxIsNull, setMaxIsNull] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (faixa) {
      setForm({
        ordem: faixa.ordem,
        valor_minimo: faixa.valor_minimo,
        valor_maximo: faixa.valor_maximo || 0,
        aliquota: faixa.aliquota,
        parcela_deduzir: faixa.parcela_deduzir,
      })
      setMaxIsNull(!faixa.valor_maximo)
    } else {
      const prevFaixa = [...otherFaixas].sort((a, b) => a.ordem - b.ordem).pop()
      const minVal = prevFaixa ? prevFaixa.valor_maximo + 0.01 : 0
      setForm({
        ordem: otherFaixas.length + 1,
        valor_minimo: minVal,
        valor_maximo: minVal + 10000,
        aliquota: 0,
        parcela_deduzir: 0,
      })
      setMaxIsNull(false)
    }
    setFieldErrors({})
  }, [faixa, otherFaixas, open])

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (form.ordem < 1) e.ordem = 'Ordem deve ser maior que 0'
    if (form.valor_minimo < 0) e.valor_minimo = 'Valor mínimo deve ser >= 0'
    if (!maxIsNull && form.valor_maximo <= form.valor_minimo)
      e.valor_maximo = 'Valor máximo deve ser > mínimo'
    if (form.aliquota < 0 || form.aliquota > 100) e.aliquota = 'Alíquota deve estar entre 0 e 100'
    if (form.parcela_deduzir < 0) e.parcela_deduzir = 'Parcela deve ser >= 0'
    const prev = otherFaixas.find((f) => f.ordem === form.ordem - 1)
    if (prev) {
      const expected = prev.valor_maximo + 0.01
      if (Math.abs(form.valor_minimo - expected) > 0.001)
        e.valor_minimo = `Deve ser ${formatCurrency(expected)} (máx. faixa anterior + 0,01)`
    }
    const next = otherFaixas.find((f) => f.ordem === form.ordem + 1)
    if (next && !maxIsNull) {
      const expected = next.valor_minimo - 0.01
      if (Math.abs(form.valor_maximo - expected) > 0.001)
        e.valor_maximo = `Deve ser ${formatCurrency(expected)} (mín. próxima faixa - 0,01)`
    }
    return e
  }, [form, maxIsNull, otherFaixas])

  const isValid = Object.keys(errors).length === 0

  const handleSave = async () => {
    if (!isValid) {
      setFieldErrors(errors)
      return
    }
    setSaving(true)
    try {
      const data = { ...form, ano_base: anoBase, valor_maximo: maxIsNull ? 0 : form.valor_maximo }
      if (faixa) {
        await updateFaixaIRPF(faixa.id, data)
        toast.success('Faixa atualizada com sucesso')
      } else {
        await createFaixaIRPF(data)
        toast.success('Faixa criada com sucesso')
      }
      onSaved()
    } catch (err) {
      const fe = extractFieldErrors(err)
      setFieldErrors({ ...errors, ...fe })
      if (Object.keys(fe).length === 0) toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const displayErrors = { ...errors, ...fieldErrors }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faixa ? 'Editar Faixa' : 'Nova Faixa'}</DialogTitle>
          <DialogDescription>Preencha os dados da faixa IRPF</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ['ordem', 'Ordem', 'number', 1],
              ['aliquota', 'Alíquota (%)', 'number', 0.01],
              ['valor_minimo', 'Valor Mínimo', 'number', 0.01],
              ['valor_maximo', 'Valor Máximo', 'number', 0.01],
            ] as const
          ).map(([key, label, type, step]) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <Input
                type={type}
                step={step}
                value={form[key]}
                disabled={key === 'valor_maximo' && maxIsNull}
                onChange={(e) => setForm({ ...form, [key]: +e.target.value })}
                className={displayErrors[key] ? 'border-destructive' : ''}
              />
              {displayErrors[key] && (
                <p className="text-xs text-destructive">{displayErrors[key]}</p>
              )}
            </div>
          ))}
          <div className="space-y-2 col-span-2">
            <Label>Parcela a Deduzir</Label>
            <Input
              type="number"
              step="0.01"
              value={form.parcela_deduzir}
              onChange={(e) => setForm({ ...form, parcela_deduzir: +e.target.value })}
              className={displayErrors.parcela_deduzir ? 'border-destructive' : ''}
            />
            {displayErrors.parcela_deduzir && (
              <p className="text-xs text-destructive">{displayErrors.parcela_deduzir}</p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm col-span-2">
            <input
              type="checkbox"
              checked={maxIsNull}
              onChange={(e) => setMaxIsNull(e.target.checked)}
            />
            Última faixa (sem limite máximo)
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || !isValid}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
