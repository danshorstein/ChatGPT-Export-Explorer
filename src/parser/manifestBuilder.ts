import type { Conversation, ImportManifest } from '../types/index.js'

export function buildManifest(
  conversations: Conversation[],
  sourceFiles: string[],
  warnings: string[],
): ImportManifest {
  let earliest = Infinity
  let latest = -Infinity
  let totalMessages = 0

  const convSummaries = conversations.map((conv) => {
    totalMessages += conv.message_count
    if (conv.created_at < earliest) earliest = conv.created_at
    if (conv.created_at > latest) latest = conv.created_at
    return {
      id: conv.id,
      title: conv.title,
      message_count: conv.message_count,
      created_at: conv.created_at,
      has_attachments: conv.has_attachments,
      branch_count: conv.branch_count,
    }
  })

  return {
    imported_at: Date.now(),
    source_files: sourceFiles,
    total_conversations: conversations.length,
    total_messages: totalMessages,
    date_range: {
      earliest: isFinite(earliest) ? earliest : 0,
      latest: isFinite(latest) ? latest : 0,
    },
    conversations: convSummaries,
    warnings,
  }
}
