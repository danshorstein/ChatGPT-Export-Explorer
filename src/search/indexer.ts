import MiniSearch from 'minisearch'
import type { Conversation, SearchResult } from '../types/index.js'

export interface SearchDocument {
  id: string
  conversation_id: string
  conversation_title: string
  role: string
  content: string
  created_at: number
}

export function createSearchIndex(): MiniSearch<SearchDocument> {
  return new MiniSearch<SearchDocument>({
    fields: ['content', 'conversation_title'],
    storeFields: ['id', 'conversation_id', 'conversation_title', 'role', 'content', 'created_at'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
    },
  })
}

export function buildIndex(conversations: Conversation[]): MiniSearch<SearchDocument> {
  const index = createSearchIndex()
  const docs: SearchDocument[] = []

  for (const conv of conversations) {
    for (const msg of conv.canonical_messages) {
      if (msg.content) {
        docs.push({
          id: msg.id,
          conversation_id: conv.id,
          conversation_title: conv.title,
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at,
        })
      }
    }
  }

  index.addAll(docs)
  return index
}

export function mapToSearchResults(
  rawResults: ReturnType<MiniSearch['search']>,
): SearchResult[] {
  return rawResults.map((r) => ({
    id: r.id as string,
    conversation_id: r.conversation_id as string,
    conversation_title: r.conversation_title as string,
    role: r.role as SearchResult['role'],
    content: r.content as string,
    created_at: r.created_at as number,
    score: r.score,
  }))
}
