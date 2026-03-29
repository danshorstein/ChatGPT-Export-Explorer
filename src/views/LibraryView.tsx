import { useConversations } from '../hooks/useConversations.js'
import { ConversationCard } from '../components/library/ConversationCard.js'

export function LibraryView() {
  const { conversations, loading } = useConversations()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Loading conversations…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Thread Library</h1>
        <span className="text-sm text-gray-500">{conversations.length.toLocaleString()} conversations</span>
      </div>

      {conversations.length === 0 ? (
        <p className="text-gray-500 py-10 text-center">No conversations found.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conv) => (
            <ConversationCard key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
    </div>
  )
}
