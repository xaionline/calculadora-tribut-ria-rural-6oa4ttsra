migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('simulacoes')
    col.addIndex('idx_simulacoes_status', false, 'status', '')
    col.addIndex('idx_simulacoes_created', false, 'created', '')
    col.addIndex('idx_simulacoes_produtor_id', false, 'produtor_id', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('simulacoes')
    col.removeIndex('idx_simulacoes_status')
    col.removeIndex('idx_simulacoes_created')
    col.removeIndex('idx_simulacoes_produtor_id')
    app.save(col)
  },
)
