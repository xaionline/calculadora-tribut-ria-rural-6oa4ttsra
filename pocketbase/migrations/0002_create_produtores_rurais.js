migrate(
  (app) => {
    const collection = new Collection({
      name: 'produtores_rurais',
      type: 'base',
      listRule: '@request.auth.role = "CONSULTOR" || cpf_cnpj = @request.auth.email',
      viewRule: '@request.auth.role = "CONSULTOR" || cpf_cnpj = @request.auth.email',
      createRule: '@request.auth.role = "CONSULTOR"',
      updateRule: '@request.auth.role = "CONSULTOR"',
      deleteRule: '@request.auth.role = "CONSULTOR"',
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'cpf_cnpj', type: 'text', required: true },
        {
          name: 'tipo_pessoa',
          type: 'select',
          values: ['PESSOA_FISICA', 'PESSOA_JURIDICA'],
          maxSelect: 1,
        },
        { name: 'atividade_rural', type: 'text' },
        { name: 'municipio', type: 'text' },
        { name: 'uf', type: 'text', max: 2 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('produtores_rurais')
    app.delete(collection)
  },
)
