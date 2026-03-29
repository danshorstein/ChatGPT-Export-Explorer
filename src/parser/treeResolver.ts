import type { RawNode, Message, MessageRole } from '../types/index.js'

export interface TreeResolverResult {
  messages: Message[]
  branchCount: number
  warnings: string[]
}

function extractContent(node: RawNode): { content: string | null; isNull: boolean } {
  const msg = node.message
  if (!msg || !msg.content) return { content: null, isNull: true }

  const parts = msg.content.parts
  if (!parts || parts.length === 0) return { content: null, isNull: true }

  const text = parts
    .filter((p): p is string => typeof p === 'string')
    .join('')

  if (text.trim() === '') {
    // Check for non-text content types that might have text
    if (msg.content.text) return { content: msg.content.text, isNull: false }
    return { content: null, isNull: true }
  }

  return { content: text, isNull: false }
}

function extractAttachment(node: RawNode): {
  has_attachment: boolean
  attachment_name?: string
  attachment_type?: string
} {
  const attachments = node.message?.metadata?.attachments
  if (!attachments || attachments.length === 0) return { has_attachment: false }
  const first = attachments[0]
  return {
    has_attachment: true,
    attachment_name: first.name,
    attachment_type: first.mime_type,
  }
}

/**
 * Resolves a ChatGPT conversation mapping (DAG) into a canonical linear
 * message sequence by following the last child at each branching node.
 */
export function resolveTree(
  mapping: Record<string, RawNode>,
  conversationId: string,
): TreeResolverResult {
  const warnings: string[] = []
  const messages: Message[] = []
  let branchCount = 0

  if (!mapping || Object.keys(mapping).length === 0) {
    return { messages, branchCount, warnings }
  }

  // Find root node: parent is null or parent id not in mapping
  const allIds = new Set(Object.keys(mapping))
  let rootId: string | null = null

  for (const [id, node] of Object.entries(mapping)) {
    if (node.parent === null || !allIds.has(node.parent)) {
      rootId = id
      break
    }
  }

  if (!rootId) {
    warnings.push('Could not find root node in conversation mapping')
    return { messages, branchCount, warnings }
  }

  // Iterative canonical path walk: always follow the last child
  let currentId: string | null = rootId
  let lastTimestamp = 0

  while (currentId !== null) {
    const node: RawNode | undefined = mapping[currentId]
    if (!node) break

    // Count branching nodes
    if (node.children.length > 1) {
      branchCount++
    }

    // Process message if present
    if (node.message !== null) {
      const msg = node.message
      const role = msg.author?.role as MessageRole | undefined

      if (!role) {
        warnings.push(`Node ${currentId} has a message with no author role`)
      } else {
        let timestamp = msg.create_time ?? null
        if (timestamp === null) {
          timestamp = lastTimestamp + 1
          warnings.push(`Node ${currentId} has null create_time; using estimated timestamp`)
        }
        lastTimestamp = timestamp

        const { content, isNull } = extractContent(node)
        const attachment = extractAttachment(node)

        if (isNull) {
          warnings.push(`Node ${currentId} has null/empty content`)
        }

        messages.push({
          id: msg.id,
          conversation_id: conversationId,
          role,
          content,
          created_at: timestamp,
          is_null_content: isNull,
          ...attachment,
        })
      }
    }

    // Follow last child as canonical path
    if (node.children.length === 0) {
      currentId = null
    } else {
      currentId = node.children[node.children.length - 1]
    }
  }

  return { messages, branchCount, warnings }
}
