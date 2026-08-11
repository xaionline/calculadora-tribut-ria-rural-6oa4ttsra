migrate(
  (app) => {
    const produtoresId = app.findCollectionByNameOrId('produtores_rurais').id
    const collection = new Collection({
      name: 'simulacoes',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.role = "CONSULTOR"',
      updateRule: '@request.auth.role = "CONSULTOR"',
      deleteRule: '@request.auth.role = "CONSULTOR" && status != "APROVADA"',
      fields: [
        {
          name: 'produtor_id',
          type: 'relation',
          required: true,
          collectionId: produtoresId,
          maxSelect: 1,
        },
        {
          name: 'consultor_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'ano_base', type: 'number', required: true, onlyInt: true },
        { name: 'receita_bruta', type: 'number', required: true },
        { name: 'despesa_anual', type: 'number', required: true },
        { name: 'iva_padrao', type: 'number' },
        { name: 'reducao_percentual', type: 'number' },
        { name: 'presuncao_percentual', type: 'number' },
        { name: 'total_tributos', type: 'number' },
        { name: 'carga_tributaria', type: 'number' },
        {
          name: 'status',
          type: 'select',
          values: ['RASCUNHO', 'CALCULADA', 'APROVADA', 'ARQUIVADA'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('simulacoes')
    app.delete(collection)
  },
)
