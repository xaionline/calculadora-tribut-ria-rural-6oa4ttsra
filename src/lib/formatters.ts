export const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

export function formatCurrencyInput(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function parseCurrencyInput(text: string): number {
  const digits = text.replace(/\D/g, '')
  if (!digits) return 0
  return parseInt(digits, 10) / 100
}

export function formatPercentBR(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`
}

export function formatDocument(value: string, isPF: boolean): string {
  const digits = value.replace(/\D/g, '')
  if (isPF) {
    const d = digits.slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 6) return d.replace(/(\d{3})(\d+)/, '$1.$2')
    if (d.length <= 9) return d.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
  }
  const d = digits.slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return d.replace(/(\d{2})(\d+)/, '$1.$2')
  if (d.length <= 8) return d.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3')
  if (d.length <= 12) return d.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4')
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5')
}
