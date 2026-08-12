routerAdd(
  'GET',
  '/backend/v1/dashboard/distribuicao-tributos',
  (e) => {
    const userId = e.auth && e.auth.id
    if (!userId) return e.unauthorizedError('auth required')

    const userRole = (e.auth && e.auth.getString('role')) || ''
    const userEmail = (e.auth && e.auth.getString('email')) || ''

    let simulations = []

    if (userRole === 'CONSULTOR') {
      try {
        simulations = $app.findRecordsByFilter(
          'simulacoes',
          'status = "CALCULADA" || status = "APROVADA"',
          '-created',
          0,
          0,
        )
      } catch (_) {}
    } else {
      let producerIds = []
      try {
        const producers = $app.findRecordsByFilter(
          'produtores_rurais',
          'cpf_cnpj = "' + userEmail + '"',
          '',
          0,
          0,
        )
        producerIds = producers.map(function (p) {
          return p.id
        })
      } catch (_) {}

      for (let i = 0; i < producerIds.length; i++) {
        try {
          const sims = $app.findRecordsByFilter(
            'simulacoes',
            '(status = "CALCULADA" || status = "APROVADA") && produtor_id = "' +
              producerIds[i] +
              '"',
            '-created',
            0,
            0,
          )
          simulations = simulations.concat(sims)
        } catch (_) {}
      }
    }

    if (simulations.length === 0) {
      return e.json(200, { distribuicao: [], total: 0 })
    }

    let faixas = []
    try {
      faixas = $app.findRecordsByFilter('faixas_irpf', '', 'ordem', 0, 0)
    } catch (_) {}

    let totalIbsCbs = 0,
      totalFunrural = 0,
      totalAdicional = 0,
      totalIrpf = 0

    for (let s = 0; s < simulations.length; s++) {
      const sim = simulations[s]
      const receitaBruta = sim.getFloat('receita_bruta') || 0
      const despesaAnual = sim.getFloat('despesa_anual') || 0
      const ivaPadrao = sim.getFloat('iva_padrao') || 26.5
      const reducao = sim.getFloat('reducao_percentual') || 60
      const presuncao = sim.getFloat('presuncao_percentual') || 20

      const resultadoLiquido = receitaBruta - despesaAnual
      const ivaReduzido = ivaPadrao * (1 - reducao / 100)
      const bcIbsCbs = Math.max(0, resultadoLiquido) * (presuncao / 100)

      let totalRendimentos = 0
      try {
        const rendimentos = $app.findRecordsByFilter(
          'rendimentos_simulacao',
          'simulacao_id = "' + sim.id + '"',
          '',
          0,
          0,
        )
        for (let r = 0; r < rendimentos.length; r++) {
          totalRendimentos += rendimentos[r].getFloat('valor') || 0
        }
      } catch (_) {}

      const bcIrpf = totalRendimentos + bcIbsCbs
      const ibsCbsTax = bcIbsCbs * (ivaReduzido / 100)
      const funruralTax = receitaBruta * 0.012
      const adicionalTax = resultadoLiquido > 0 ? resultadoLiquido * 0.1003 : 0

      let irpfTax = 0
      for (let f = 0; f < faixas.length; f++) {
        const max = faixas[f].getFloat('valor_maximo') || 0
        const aliquota = faixas[f].getFloat('aliquota') || 0
        const parcelaDeduzir = faixas[f].getFloat('parcela_deduzir') || 0
        if (max === 0 || bcIrpf <= max) {
          irpfTax = Math.max(0, (bcIrpf * aliquota) / 100 - parcelaDeduzir)
          break
        }
      }

      totalIbsCbs += ibsCbsTax
      totalFunrural += funruralTax
      totalAdicional += adicionalTax
      totalIrpf += irpfTax
    }

    const grandTotal = totalIbsCbs + totalFunrural + totalAdicional + totalIrpf

    let distribuicao = []
    if (grandTotal > 0) {
      distribuicao = [
        { name: 'IBS/CBS', value: Math.round((totalIbsCbs / grandTotal) * 10000) / 100 },
        { name: 'Funrural', value: Math.round((totalFunrural / grandTotal) * 10000) / 100 },
        {
          name: 'Adicional Altas Rendas',
          value: Math.round((totalAdicional / grandTotal) * 10000) / 100,
        },
        { name: 'IRPF', value: Math.round((totalIrpf / grandTotal) * 10000) / 100 },
      ]
    }

    return e.json(200, { distribuicao: distribuicao, total: simulations.length })
  },
  $apis.requireAuth(),
)
