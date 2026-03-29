import { useState, useEffect } from 'react'
import { getConversationById } from '../db/conversationStore.js'
import type { Conversation } from '../types/index.js'

export function useConversation(id: string | undefined) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setNotFound(true)
      return
    }
    setLoading(true)
    setNotFound(false)
    getConversationById(id).then((conv) => {
      if (conv) {
        setConversation(conv)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    })
  }, [id])

  return { conversation, loading, notFound }
}
