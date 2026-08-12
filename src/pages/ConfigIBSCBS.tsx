import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import {
  getParametros,
  saveParametros,
  DEFAULT_PARAMS,
  type ParametrosConfig,
} from '@/services/parametros-configuracao'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

const fields: Array<{
  key: keyof typeof DEFAULT_PARAMS
  label: string
  desc: string
  color: string
}> = [
  {
    key: 'iva_padrao',
    label: 'IVA Padrão',
    desc: 'Alíquota padrão do IBS/CBS',
    color: 'hsl(var(--chart-1))',
  },
  {
    key: 'reducao_percentual',
    label: 'Redução',
    desc: 'Redução percentual do regime atual',
    color: 'hsl(var(--chart-2))',
  },
  {
    key: 'presuncao_percentual',
    label: 'Presunção BC',
    desc: 'Presunção da base de cálculo',
    color: 'hsl(var(--chart-3))',
  },
  {
    key: 'aliquota_funrural',
    label: 'Alíquota Funrural',
    desc: 'Alíquota do Funrural',
    color: 'hsl(var(--chart-4))',
  },
  {
    key: 'aliquota_adicional',
    label: 'Alíquota Adicional',
    desc: 'Adicional sobre altas rendas',
    color: 'hsl(var(--chart-5))',
  },
]

export default function ConfigIBSCBS() {
  const { user } = useAuth()
  const isConsultor = user?.role === 'CONSULTOR'
  const [values, setValues] = useState(DEFAULT_PARAMS)
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    getParametros().then((data: ParametrosConfig) => {
      setValues({
        iva_padrao: data.iva_padrao,
        reducao_percentual: data.reducao_percentual,
        presuncao_percentual: data.presuncao_percentual,
        aliquota_funrural: data.aliquota_funrural,
        aliquota_adicional: data.aliquota_adicional,
      })
      setConfigId(data.id || null)
      setLoading(false)
    })
  }, [])

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (values.iva_padrao < 0) e.iva_padrao = 'Valor deve ser >= 0'
    if (values.reducao_percentual < 0 || values.reducao_percentual > 100)
      e.reducao_percentual = '0 a 100'
    if (values.presuncao_percentual < 0 || values.presuncao_percentual > 100)
      e.presuncao_percentual = '0 a 100'
    if (values.aliquota_funrural < 0) e.aliquota_funrural = 'Valor deve ser >= 0'
    if (values.aliquota_adicional < 0) e.aliquota_adicional = 'Valor deve ser >= 0'
    return e
  }, [values])

  const isValid = Object.keys(errors).length === 0

  const handleSave = async () => {
    if (!isValid) return
    setSaving(true)
    try {
      const result = await saveParametros(configId, values)
      if (!configId && result?.id) setConfigId(result.id)
      toast.success('Configurações salvas com sucesso')
      setFieldErrors({})
    } catch (err) {
      const fe = extractFieldErrors(err)
      setFieldErrors(fe)
      if (Object.keys(fe).length === 0) toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações IBS/CBS</h1>
        <p className="text-muted-foreground">Parâmetros do novo regime tributário</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const displayErrors = { ...errors, ...fieldErrors }
          return (
            <Card key={field.key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{field.label}</CardTitle>
                  <Badge style={{ backgroundColor: field.color }}>
                    {values[field.key].toFixed(2).replace('.', ',')}%
                  </Badge>
                </div>
                <CardDescription>{field.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Valor (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={!isConsultor}
                    value={values[field.key]}
                    onChange={(e) => setValues({ ...values, [field.key]: +e.target.value })}
                    className={displayErrors[field.key] ? 'border-destructive' : ''}
                  />
                  {displayErrors[field.key] && (
                    <p className="text-xs text-destructive">{displayErrors[field.key]}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {isConsultor && (
        <Button
          onClick={handleSave}
          size="lg"
          disabled={saving || !isValid}
          className="w-full sm:w-auto"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}{' '}
          Salvar Configurações
        </Button>
      )}
      {!isConsultor && (
        <p className="text-sm text-muted-foreground">
          Você está visualizando em modo somente leitura.
        </p>
      )}
    </div>
  )
}
