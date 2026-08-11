migrate(
  (app) => {
    const simulacoesId = app.findCollectionByNameOrId('simulacoes').id
    const collection = new Collection({
      name: 'rendimentos_simulacao',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.role = "CONSULTOR"',
      updateRule: '@request.auth.role = "CONSULTOR"',
      deleteRule: '@request.auth.role = "CONSULTOR"',
      fields: [
        {
          name: 'simulacao_id',
          type: 'relation',
          required: true,
          collectionId: simulacoesId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'tipo_rendimento',
          type: 'select',
          values: ['SALARIOS', 'PRO_LABORE', 'ALUGUEIS', 'HONORARIOS', 'OUTROS', 'DIVIDENDOS'],
          maxSelect: 1,
        },
        { name: 'valor', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('rendimentos_simulacao')
    app.delete(collection)
  },
)
