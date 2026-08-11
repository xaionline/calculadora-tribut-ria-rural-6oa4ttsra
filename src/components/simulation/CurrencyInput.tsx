import { Input } from '@/components/ui/input'
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface CurrencyInputProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  id?: string
  className?: string
}

export function CurrencyInput({ value, onChange, readOnly, id, className }: CurrencyInputProps) {
  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      value={formatCurrencyInput(value)}
      onChange={(e) => onChange?.(parseCurrencyInput(e.target.value))}
      readOnly={readOnly}
      className={cn(readOnly && 'bg-muted font-semibold cursor-not-allowed', className)}
    />
  )
}
