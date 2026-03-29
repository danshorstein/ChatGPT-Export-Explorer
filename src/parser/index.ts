import type { Conversation, ImportManifest, ParseProgress, RawConversation } from '../types/index.js'
import { loadFiles } from './zipLoader.js'
import { resolveTree } from './treeResolver.js'
import { buildManifest } from './manifestBuilder.js'

export interface ParseResult {
  conversations: Conversation[]
  manifest: ImportManifest
}

/**
 * Full parse pipeline: ZIP/JSON → raw conversations → resolved conversations + manifest.
 * Calls onProgress with status updates throughout.
 */
export async function parseExport(
  files: File[],
  onProgress: (p: ParseProgress) => void,
): Promise<ParseResult> {
  onProgress({ phase: 'loading', current: 0, total: files.length, message: 'Loading files…' })

  const { loaded, warnings: loadWarnings } = await loadFiles(files)
  const allWarnings = [...loadWarnings]

  const rawConversations: Array<{ raw: RawConversation; sourceFile: string }> = []
  for (const loadedFile of loaded) {
    for (const raw of loadedFile.conversations) {
      rawConversations.push({ raw, sourceFile: loadedFile.filename })
    }
  }

  const total = rawConversations.length
  const conversations: Conversation[] = []

  onProgress({ phase: 'parsing', current: 0, total, message: `Parsing ${total} conversations…` })

  for (let i = 0; i < rawConversations.length; i++) {
    const { raw } = rawConversations[i]

    if (i % 100 === 0) {
      onProgress({
        phase: 'parsing',
        current: i,
        total,
        message: `Parsing conversation ${i + 1} of ${total}…`,
      })
      // Yield to keep UI responsive
      await new Promise((r) => setTimeout(r, 0))
    }

    const { messages, branchCount, warnings: treeWarnings } = resolveTree(raw.mapping ?? {}, raw.id)
    allWarnings.push(...treeWarnings.map((w) => `[${raw.id}] ${w}`))

    const hasAttachments = messages.some((m) => m.has_attachment)

    conversations.push({
      id: raw.id,
      title: raw.title || 'Untitled',
      created_at: raw.create_time,
      updated_at: raw.update_time,
      message_count: messages.length,
      branch_count: branchCount,
      has_attachments: hasAttachments,
      canonical_messages: messages,
      raw_mapping: raw.mapping ?? {},
    })
  }

  const sourceFiles = [...new Set(loaded.map((f) => f.filename))]
  const manifest = buildManifest(conversations, sourceFiles, allWarnings)

  onProgress({
    phase: 'done',
    current: total,
    total,
    message: `Parsed ${conversations.length} conversations`,
  })

  return { conversations, manifest }
}
