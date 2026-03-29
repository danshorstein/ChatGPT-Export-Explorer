import { useNavigate } from 'react-router-dom'
import type { SearchResult } from '../../types/index.js'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
}

function highlight(text: string, query: string): string {
  if (!query.trim()) return text
  // Simple highlight: wrap first match in ==…==
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '**$1**')
}

function snippet(content: string, query: string): string {
  const lower = content.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase().trim())
  if (idx === -1) return content.slice(0, 200)
  const start = Math.max(0, idx - 80)
  const end = Math.min(content.length, idx + 120)
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '')
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function renderHighlighted(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part}</mark>
      : <span key={i}>{part}</span>,
  )
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const navigate = useNavigate()

  if (results.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">{results.length} result{results.length !== 1 ? 's' : ''}</p>
      {results.map((r) => {
        const snip = snippet(r.content, query)
        const highlighted = highlight(snip, query)
        return (
          <button
            key={`${r.id}-${r.score}`}
            onClick={() => navigate(`/library/${r.conversation_id}`)}
            className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 rounded px-1.5 py-0.5 capitalize">{r.role}</span>
              <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">{r.conversation_title}</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {renderHighlighted(highlighted)}
            </p>
          </button>
        )
      })}
    </div>
  )
}
