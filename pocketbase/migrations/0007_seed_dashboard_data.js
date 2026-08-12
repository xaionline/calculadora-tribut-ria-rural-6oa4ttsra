migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    let consultorId = ''
    try {
      consultorId = app.findAuthRecordByEmail('_pb_users_auth_', 'pirola.daniel@gmail.com').id
    } catch (_) {
      const rec = new Record(usersCol)
      rec.setEmail('pirola.daniel@gmail.com')
      rec.setPassword('Skip@Pass')
      rec.setVerified(true)
      rec.set('name', 'Daniel Pirola')
      rec.set('role', 'CONSULTOR')
      app.save(rec)
      consultorId = rec.id
    }

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'cliente@exemplo.com')
    } catch (_) {
      const rec = new Record(usersCol)
      rec.setEmail('cliente@exemplo.com')
      rec.setPassword('Skip@Pass')
      rec.setVerified(true)
      rec.set('name', 'Cliente Exemplo')
      rec.set('role', 'CLIENTE')
      app.save(rec)
    }

    const faixasCol = app.findCollectionByNameOrId('faixas_irpf')
    const faixasData = [
      [1, 0, 60000, 0, 0],
      [2, 60000.01, 73800, 7.5, 4500],
      [3, 73800.01, 88200, 15, 10035],
      [4, 88200.01, 110400, 22.5, 16650],
      [5, 110400.01, 0, 27.5, 22170],
    ]
    if (app.countRecords('faixas_irpf') === 0) {
      for (const f of faixasData) {
        const rec = new Record(faixasCol)
        rec.set('ano_base', 2025)
        rec.set('ordem', f[0])
        rec.set('valor_minimo', f[1])
        rec.set('valor_maximo', f[2])
        rec.set('aliquota', f[3])
        rec.set('parcela_deduzir', f[4])
        app.save(rec)
      }
    }

    const prodCol = app.findCollectionByNameOrId('produtores_rurais')
    const produtoresData = [
      [
        'Fazenda Santa Helena',
        'cliente@exemplo.com',
        'PESSOA_FISICA',
        'Soja e Milho',
        'Cascavel',
        'PR',
      ],
      ['Sítio Boa Vista', '98765432100', 'PESSOA_FISICA', 'Pecuária', 'Uberlândia', 'MG'],
      ['Fazenda Três Marias', '11222333000144', 'PESSOA_JURIDICA', 'Café', 'Varginha', 'MG'],
    ]
    const prodIds = []
    if (app.countRecords('produtores_rurais') === 0) {
      for (const p of produtoresData) {
        const rec = new Record(prodCol)
        rec.set('nome', p[0])
        rec.set('cpf_cnpj', p[1])
        rec.set('tipo_pessoa', p[2])
        rec.set('atividade_rural', p[3])
        rec.set('municipio', p[4])
        rec.set('uf', p[5])
        app.save(rec)
        prodIds.push(rec.id)
      }
    } else {
      const existing = app.findRecordsByFilter('produtores_rurais', '', 'nome', 0, 0)
      for (const e of existing) prodIds.push(e.id)
    }

    const simCol = app.findCollectionByNameOrId('simulacoes')
    const simsData = [
      [0, 2025, 20000000, 17000000, 26.5, 60, 20, 3747830, 18.19, 'CALCULADA'],
      [1, 2024, 8500000, 6500000, 26.5, 60, 20, 1450000, 17.06, 'APROVADA'],
      [2, 2024, 12300000, 9800000, 26.5, 60, 20, 2280000, 18.54, 'CALCULADA'],
      [0, 2025, 5000000, 3500000, 26.5, 60, 20, 800000, 16.0, 'RASCUNHO'],
    ]
    const simIds = []
    if (app.countRecords('simulacoes') === 0) {
      for (const s of simsData) {
        const rec = new Record(simCol)
        rec.set('produtor_id', prodIds[s[0]])
        rec.set('consultor_id', consultorId)
        rec.set('ano_base', s[1])
        rec.set('receita_bruta', s[2])
        rec.set('despesa_anual', s[3])
        rec.set('iva_padrao', s[4])
        rec.set('reducao_percentual', s[5])
        rec.set('presuncao_percentual', s[6])
        rec.set('total_tributos', s[7])
        rec.set('carga_tributaria', s[8])
        rec.set('status', s[9])
        app.save(rec)
        simIds.push(rec.id)
      }
    }

    if (simIds.length > 0 && app.countRecords('rendimentos_simulacao') === 0) {
      const rendCol = app.findCollectionByNameOrId('rendimentos_simulacao')
      const rendData = [
        [0, 'PRO_LABORE', 120000],
        [0, 'ALUGUEIS', 30000],
        [1, 'PRO_LABORE', 60000],
        [2, 'SALARIOS', 0],
      ]
      for (const r of rendData) {
        if (r[0] < simIds.length) {
          const rec = new Record(rendCol)
          rec.set('simulacao_id', simIds[r[0]])
          rec.set('tipo_rendimento', r[1])
          rec.set('valor', r[2])
          app.save(rec)
        }
      }
    }
  },
  (app) => {
    const cols = ['rendimentos_simulacao', 'simulacoes', 'produtores_rurais', 'faixas_irpf']
    for (const name of cols) {
      try {
        const records = app.findRecordsByFilter(name, '', '', 0, 0)
        for (const r of records) app.delete(r)
      } catch (_) {}
    }
  },
)
