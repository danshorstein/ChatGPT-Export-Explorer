import { useState, useEffect } from 'react'
import { getAllConversations } from '../db/conversationStore.js'
import type { Conversation } from '../types/index.js'

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllConversations()
      .then(setConversations)
      .finally(() => setLoading(false))
  }, [])

  return { conversations, loading }
}
