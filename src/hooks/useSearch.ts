import { useState, useContext, useMemo, useEffect } from 'react'
import { AppContext } from '../state/AppContext.js'
import { search } from '../search/searcher.js'
import type { SearchResult, MessageRole } from '../types/index.js'

export interface SearchFilters {
  role: MessageRole | 'all'
  dateFrom?: number
  dateTo?: number
}

export function useSearch() {
  const { searchIndex } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({ role: 'all' })

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const results: SearchResult[] = useMemo(() => {
    if (!searchIndex || !debouncedQuery.trim()) return []
    return search(searchIndex, debouncedQuery, filters)
  }, [searchIndex, debouncedQuery, filters])

  return { query, setQuery, filters, setFilters, results }
}
