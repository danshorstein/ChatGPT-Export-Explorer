import type { Message } from '../../types/index.js'

interface MessageBubbleProps {
  message: Message
}

function formatTime(ts: number) {
  return new Date(ts * 1000).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export function MessageBubble({ message: msg }: MessageBubbleProps) {
  const isUser = msg.role === 'user'
  const isAssistant = msg.role === 'assistant'
  const isSystemOrTool = msg.role === 'system' || msg.role === 'tool'

  if (isSystemOrTool) {
    return (
      <div className="flex justify-center my-2">
        <div className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1 max-w-prose">
          <span className="font-medium capitalize">{msg.role}</span>
          {msg.content && <span>: {msg.content.slice(0, 120)}{msg.content.length > 120 ? '…' : ''}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-2xl w-full ${isUser ? 'ml-12' : 'mr-12'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words
          ${isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
          }
        `}>
          {msg.is_null_content ? (
            <span className="italic opacity-60">[empty message]</span>
          ) : (
            msg.content
          )}
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {isAssistant && (
            <span className="text-xs font-medium text-gray-400">ChatGPT</span>
          )}
          <span className="text-xs text-gray-400">{formatTime(msg.created_at)}</span>
          {msg.has_attachment && (
            <span className="text-xs text-blue-500" title={msg.attachment_name}>
              📎 {msg.attachment_name ?? 'attachment'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
