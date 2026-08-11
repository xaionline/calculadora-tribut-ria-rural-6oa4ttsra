migrate(
  (app) => {
    const collection = new Collection({
      name: 'faixas_irpf',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.role = "CONSULTOR"',
      updateRule: '@request.auth.role = "CONSULTOR"',
      deleteRule: '@request.auth.role = "CONSULTOR"',
      fields: [
        { name: 'ano_base', type: 'number', onlyInt: true },
        { name: 'ordem', type: 'number', onlyInt: true },
        { name: 'valor_minimo', type: 'number' },
        { name: 'valor_maximo', type: 'number' },
        { name: 'aliquota', type: 'number' },
        { name: 'parcela_deduzir', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('faixas_irpf')
    app.delete(collection)
  },
)
