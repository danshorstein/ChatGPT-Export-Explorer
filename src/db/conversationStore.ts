import { db } from './db.js'
import type { Conversation } from '../types/index.js'

export async function bulkUpsertConversations(conversations: Conversation[]): Promise<void> {
  await db.conversations.bulkPut(conversations)
}

export async function getAllConversations(): Promise<Conversation[]> {
  return db.conversations.orderBy('created_at').reverse().toArray()
}

export async function getConversationById(id: string): Promise<Conversation | undefined> {
  return db.conversations.get(id)
}

export async function getConversationCount(): Promise<number> {
  return db.conversations.count()
}

export async function getExistingIds(ids: string[]): Promise<Set<string>> {
  const found = await db.conversations.where('id').anyOf(ids).primaryKeys()
  return new Set(found as string[])
}

export async function clearAllConversations(): Promise<void> {
  await db.conversations.clear()
}
