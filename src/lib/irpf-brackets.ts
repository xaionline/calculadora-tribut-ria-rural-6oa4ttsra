export interface IrpfBracket {
  faixa: number
  de: number
  ate: number | null
  aliquota: number
  parcelaDeduzir: number
  faixaLabel: string
  deLabel: string
  ateLabel: string
  aliquotaLabel: string
  deducaoLabel: string
}

export const irpfBrackets: IrpfBracket[] = [
  {
    faixa: 1,
    de: 0,
    ate: 60000,
    aliquota: 0,
    parcelaDeduzir: 0,
    faixaLabel: '1ª Faixa',
    deLabel: 'R$ 0,00',
    ateLabel: 'R$ 60.000,00',
    aliquotaLabel: '0,00%',
    deducaoLabel: 'R$ 0,00',
  },
  {
    faixa: 2,
    de: 60000.01,
    ate: 73800,
    aliquota: 7.5,
    parcelaDeduzir: 4500,
    faixaLabel: '2ª Faixa',
    deLabel: 'R$ 60.000,01',
    ateLabel: 'R$ 73.800,00',
    aliquotaLabel: '7,50%',
    deducaoLabel: 'R$ 4.500,00',
  },
  {
    faixa: 3,
    de: 73800.01,
    ate: 88200,
    aliquota: 15,
    parcelaDeduzir: 10035,
    faixaLabel: '3ª Faixa',
    deLabel: 'R$ 73.800,01',
    ateLabel: 'R$ 88.200,00',
    aliquotaLabel: '15,00%',
    deducaoLabel: 'R$ 10.035,00',
  },
  {
    faixa: 4,
    de: 88200.01,
    ate: 110400,
    aliquota: 22.5,
    parcelaDeduzir: 16650,
    faixaLabel: '4ª Faixa',
    deLabel: 'R$ 88.200,01',
    ateLabel: 'R$ 110.400,00',
    aliquotaLabel: '22,50%',
    deducaoLabel: 'R$ 16.650,00',
  },
  {
    faixa: 5,
    de: 110400.01,
    ate: null,
    aliquota: 27.5,
    parcelaDeduzir: 22170,
    faixaLabel: '5ª Faixa',
    deLabel: 'R$ 110.400,01',
    ateLabel: '—',
    aliquotaLabel: '27,50%',
    deducaoLabel: 'R$ 22.170,00',
  },
]

export function findIrpfBracket(base: number): IrpfBracket {
  for (const b of irpfBrackets) {
    if (b.ate === null) return b
    if (base <= b.ate) return b
  }
  return irpfBrackets[irpfBrackets.length - 1]
}

export function calculateIrpf(base: number): {
  bracket: IrpfBracket
  valor: number
} {
  const bracket = findIrpfBracket(base)
  const valor = Math.max(0, (base * bracket.aliquota) / 100 - bracket.parcelaDeduzir)
  return { bracket, valor }
}
