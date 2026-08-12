migrate(
  (app) => {
    const collection = new Collection({
      name: 'parametros_configuracao',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.role = "CONSULTOR"',
      updateRule: '@request.auth.role = "CONSULTOR"',
      deleteRule: '@request.auth.role = "CONSULTOR"',
      fields: [
        { name: 'iva_padrao', type: 'number' },
        { name: 'reducao_percentual', type: 'number' },
        { name: 'presuncao_percentual', type: 'number' },
        { name: 'aliquota_funrural', type: 'number' },
        { name: 'aliquota_adicional', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [],
    })
    app.save(collection)

    const simCol = app.findCollectionByNameOrId('simulacoes')
    simCol.addIndex('idx_simulacoes_ano_base', false, 'ano_base', '')
    app.save(simCol)

    if (app.countRecords('parametros_configuracao') === 0) {
      const rec = new Record(collection)
      rec.set('iva_padrao', 26.5)
      rec.set('reducao_percentual', 60)
      rec.set('presuncao_percentual', 20)
      rec.set('aliquota_funrural', 1.2)
      rec.set('aliquota_adicional', 10.03)
      app.save(rec)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('parametros_configuracao')
      app.delete(col)
    } catch (_) {}

    try {
      const simCol = app.findCollectionByNameOrId('simulacoes')
      simCol.removeIndex('idx_simulacoes_ano_base')
      app.save(simCol)
    } catch (_) {}
  },
)
