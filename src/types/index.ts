// Raw ChatGPT export types

export interface RawContentPart {
  content_type: string
  parts?: (string | null)[]
  text?: string
}

export interface RawAttachment {
  name: string
  mime_type: string
  id?: string
}

export interface RawMessageMetadata {
  attachments?: RawAttachment[]
  [key: string]: unknown
}

export interface RawMessage {
  id: string
  author: { role: 'user' | 'assistant' | 'system' | 'tool' }
  create_time: number | null
  content: RawContentPart | null
  metadata: RawMessageMetadata
}

export interface RawNode {
  id: string
  message: RawMessage | null
  parent: string | null
  children: string[]
}

export interface RawConversation {
  id: string
  title: string
  create_time: number
  update_time: number
  mapping: Record<string, RawNode>
}

// Parsed / resolved types

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

export interface Message {
  id: string
  conversation_id: string
  role: MessageRole
  content: string | null
  created_at: number
  has_attachment: boolean
  attachment_name?: string
  attachment_type?: string
  is_null_content: boolean
}

export interface Conversation {
  id: string
  title: string
  created_at: number
  updated_at: number
  message_count: number
  branch_count: number
  has_attachments: boolean
  canonical_messages: Message[]
  raw_mapping: Record<string, RawNode>
}

export interface ImportManifest {
  imported_at: number
  source_files: string[]
  total_conversations: number
  total_messages: number
  date_range: { earliest: number; latest: number }
  conversations: Array<{
    id: string
    title: string
    message_count: number
    created_at: number
    has_attachments: boolean
    branch_count: number
  }>
  warnings: string[]
}

export interface ParseProgress {
  phase: 'loading' | 'parsing' | 'indexing' | 'done' | 'error'
  current: number
  total: number
  message: string
}

export interface SearchResult {
  id: string
  conversation_id: string
  conversation_title: string
  role: MessageRole
  content: string
  created_at: number
  score: number
}
