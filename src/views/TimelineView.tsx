import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTimeline } from '../hooks/useTimeline.js'

const PAGE_SIZE = 50

function formatDateTime(ts: number) {
  return new Date(ts * 1000).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export function TimelineView() {
  const { entries, loading } = useTimeline()
  const [visible, setVisible] = useState(PAGE_SIZE)
  const navigate = useNavigate()

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading timeline…</div>
  }

  const shown = entries.slice(0, visible)

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Timeline</h1>
        <span className="text-sm text-gray-500">{entries.length.toLocaleString()} user messages</span>
      </div>

      <p className="text-sm text-gray-500">
        All your messages in chronological order, across every conversation.
      </p>

      <div className="space-y-3">
        {shown.map((entry) => (
          <div key={`${entry.id}-${entry.created_at}`} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">{formatDateTime(entry.created_at)}</span>
              <span className="text-gray-300">·</span>
              <button
                onClick={() => navigate(`/library/${entry.conversation_id}`)}
                className="text-xs text-indigo-600 hover:underline truncate max-w-xs"
              >
                {entry.conversation_title}
              </button>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {entry.content ?? <span className="italic text-gray-400">[empty message]</span>}
            </p>
            {entry.has_attachment && (
              <p className="mt-1.5 text-xs text-blue-500">📎 {entry.attachment_name ?? 'attachment'}</p>
            )}
          </div>
        ))}
      </div>

      {visible < entries.length && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-6 py-2 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Load more ({entries.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
