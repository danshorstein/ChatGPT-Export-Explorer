import { useParams, useNavigate } from 'react-router-dom'
import { useConversation } from '../hooks/useConversation.js'
import { MessageBubble } from '../components/thread/MessageBubble.js'

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function ThreadView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { conversation, loading, notFound } = useConversation(id)

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading…</div>
  }

  if (notFound || !conversation) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-gray-500">Conversation not found.</p>
        <button onClick={() => navigate('/library')} className="text-indigo-600 text-sm hover:underline">
          ← Back to library
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate('/library')} className="mt-1 text-gray-400 hover:text-gray-600 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-snug">{conversation.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDate(conversation.created_at)} · {conversation.message_count} messages
            {conversation.branch_count > 0 && ` · ${conversation.branch_count} branch${conversation.branch_count !== 1 ? 'es' : ''}`}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-1 py-4">
        {conversation.canonical_messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  )
}
