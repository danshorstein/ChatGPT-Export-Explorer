import { useContext } from 'react'
import { useSearch } from '../hooks/useSearch.js'
import { SearchBar } from '../components/search/SearchBar.js'
import { SearchResults } from '../components/search/SearchResults.js'
import { AppContext } from '../state/AppContext.js'
import type { MessageRole } from '../types/index.js'

export function SearchView() {
  const { searchIndex } = useContext(AppContext)
  const { query, setQuery, filters, setFilters, results } = useSearch()

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-xl font-semibold text-gray-900">Search</h1>

      <SearchBar query={query} onChange={setQuery} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium">Role</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value as MessageRole | 'all' })}
            className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="user">User</option>
            <option value="assistant">Assistant</option>
          </select>
        </div>
      </div>

      {!searchIndex && (
        <p className="text-sm text-gray-400">Search index not available.</p>
      )}

      {query.trim() && results.length === 0 && searchIndex && (
        <p className="text-sm text-gray-400">No results for "{query}"</p>
      )}

      <SearchResults results={results} query={query} />
    </div>
  )
}
