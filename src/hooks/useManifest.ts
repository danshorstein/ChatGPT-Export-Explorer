import { useState, useEffect, useContext, useCallback } from 'react'
import { loadManifest, clearManifest } from '../db/manifestStore.js'
import { clearAllConversations } from '../db/conversationStore.js'
import { AppContext } from '../state/AppContext.js'
import type { ImportManifest } from '../types/index.js'

export function useManifest() {
  const [manifest, setManifest] = useState<ImportManifest | null>(null)
  const [loading, setLoading] = useState(true)
  const { setHasData, setSearchIndex } = useContext(AppContext)

  useEffect(() => {
    loadManifest().then((m) => {
      setManifest(m)
      setLoading(false)
    })
  }, [])

  const clearAll = useCallback(async () => {
    await clearAllConversations()
    await clearManifest()
    setManifest(null)
    setHasData(false)
    setSearchIndex(null)
  }, [setHasData, setSearchIndex])

  return { manifest, loading, clearAll }
}
