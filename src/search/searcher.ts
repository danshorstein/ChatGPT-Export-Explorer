import type MiniSearch from 'minisearch'
import type { SearchResult, MessageRole } from '../types/index.js'
import { mapToSearchResults } from './indexer.js'
import type { SearchDocument } from './indexer.js'

export interface SearchFilters {
  role?: MessageRole | 'all'
  dateFrom?: number
  dateTo?: number
}

export function search(
  index: MiniSearch<SearchDocument>,
  query: string,
  filters: SearchFilters = {},
): SearchResult[] {
  if (!query.trim()) return []

  const raw = index.search(query, { prefix: true, fuzzy: 0.2 })
  let results = mapToSearchResults(raw)

  if (filters.role && filters.role !== 'all') {
    results = results.filter((r) => r.role === filters.role)
  }

  if (filters.dateFrom !== undefined) {
    results = results.filter((r) => r.created_at >= filters.dateFrom!)
  }

  if (filters.dateTo !== undefined) {
    results = results.filter((r) => r.created_at <= filters.dateTo!)
  }

  return results
}
