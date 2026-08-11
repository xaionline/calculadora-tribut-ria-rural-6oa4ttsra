import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface AlertBannerProps {
  cargaTributaria: number
}

export function AlertBanner({ cargaTributaria }: AlertBannerProps) {
  if (cargaTributaria <= 20) return null
  return (
    <Alert variant="destructive" className="animate-fade-in">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Atenção: Carga Tributária Elevada</AlertTitle>
      <AlertDescription>
        A carga tributária atual é de {cargaTributaria.toFixed(2)}%, acima do limite recomendado de
        20%. Considere revisar o regime tributário ou otimizar a estrutura de receitas e despesas.
      </AlertDescription>
    </Alert>
  )
}
