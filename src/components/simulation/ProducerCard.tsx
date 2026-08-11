import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UFS, formatDocument } from '@/lib/formatters'
import type { SimulationFormState, TipoPessoa } from '@/lib/tax-types'

interface ProducerCardProps {
  form: SimulationFormState
  updateField: <K extends keyof SimulationFormState>(key: K, value: SimulationFormState[K]) => void
}

export function ProducerCard({ form, updateField }: ProducerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Produtor</CardTitle>
        <CardDescription>Informações cadastrais do produtor rural</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nome do Produtor *</Label>
          <Input
            value={form.nomeProdutor}
            onChange={(e) => updateField('nomeProdutor', e.target.value)}
            placeholder="Nome completo ou razão social"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CPF/CNPJ *</Label>
            <Input
              value={form.cpfCnpj}
              onChange={(e) =>
                updateField(
                  'cpfCnpj',
                  formatDocument(e.target.value, form.tipoPessoa === 'PESSOA_FISICA'),
                )
              }
              placeholder={
                form.tipoPessoa === 'PESSOA_FISICA' ? '000.000.000-00' : '00.000.000/0000-00'
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo de Pessoa</Label>
            <Select
              value={form.tipoPessoa}
              onValueChange={(v) => {
                updateField('tipoPessoa', v as TipoPessoa)
                updateField('cpfCnpj', formatDocument(form.cpfCnpj, v === 'PESSOA_FISICA'))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PESSOA_FISICA">Pessoa Física</SelectItem>
                <SelectItem value="PESSOA_JURIDICA">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Atividade Rural</Label>
          <Input
            value={form.atividadeRural}
            onChange={(e) => updateField('atividadeRural', e.target.value)}
            placeholder="Ex: Cultivo de soja, Pecuária de corte..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Município</Label>
            <Input
              value={form.municipio}
              onChange={(e) => updateField('municipio', e.target.value)}
              placeholder="Cidade"
            />
          </div>
          <div className="space-y-2">
            <Label>UF</Label>
            <Select value={form.uf} onValueChange={(v) => updateField('uf', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {UFS.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
