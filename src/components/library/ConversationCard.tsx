import { useNavigate } from 'react-router-dom'
import type { Conversation } from '../../types/index.js'

interface ConversationCardProps {
  conversation: Conversation
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function firstUserPreview(conv: Conversation): string {
  const msg = conv.canonical_messages.find((m) => m.role === 'user' && m.content)
  if (!msg?.content) return ''
  return msg.content.length > 120 ? msg.content.slice(0, 120) + '…' : msg.content
}

export function ConversationCard({ conversation: conv }: ConversationCardProps) {
  const navigate = useNavigate()
  const preview = firstUserPreview(conv)

  return (
    <button
      onClick={() => navigate(`/library/${conv.id}`)}
      className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-medium text-gray-900 text-sm leading-snug group-hover:text-indigo-700 line-clamp-2">
          {conv.title}
        </h3>
        {conv.has_attachments && (
          <span className="shrink-0 text-xs bg-blue-50 text-blue-600 rounded px-1.5 py-0.5">📎</span>
        )}
      </div>

      {preview && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{preview}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>{formatDate(conv.created_at)}</span>
        <span>{conv.message_count} messages</span>
        {conv.branch_count > 0 && (
          <span className="text-amber-500">{conv.branch_count} branch{conv.branch_count !== 1 ? 'es' : ''}</span>
        )}
      </div>
    </button>
  )
}
