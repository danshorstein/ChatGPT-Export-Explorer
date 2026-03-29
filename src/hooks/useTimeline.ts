import { useState, useEffect } from 'react'
import { getAllConversations } from '../db/conversationStore.js'
import type { Message } from '../types/index.js'

export interface TimelineEntry extends Message {
  conversation_title: string
}

export function useTimeline() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllConversations().then((conversations) => {
      const all: TimelineEntry[] = []
      for (const conv of conversations) {
        for (const msg of conv.canonical_messages) {
          if (msg.role === 'user') {
            all.push({ ...msg, conversation_title: conv.title })
          }
        }
      }
      all.sort((a, b) => a.created_at - b.created_at)
      setEntries(all)
      setLoading(false)
    })
  }, [])

  return { entries, loading }
}
