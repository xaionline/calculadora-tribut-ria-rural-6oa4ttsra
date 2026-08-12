import { useState, useEffect, useCallback } from 'react'
import { useRealtime } from '@/hooks/use-realtime'
import { fetchSimulacoes } from '@/services/simulacoes'

export function useSimulacoesListing() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('-created')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchSimulacoes({ page, perPage: 10, sort, status, search })
      setData(result)
    } catch (e) {
      setError('Erro ao carregar simulações')
    } finally {
      setLoading(false)
    }
  }, [page, sort, status, search])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('simulacoes', () => {
    loadData()
  })
  useEffect(() => {
    setPage(1)
  }, [search, status, sort])

  return {
    data,
    loading,
    error,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    sort,
    setSort,
    page,
    setPage,
    refresh: loadData,
  }
}
