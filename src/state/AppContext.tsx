import { createContext, useState, useEffect, type ReactNode } from 'react'
import type MiniSearch from 'minisearch'
import { getConversationCount } from '../db/conversationStore.js'
import { getAllConversations } from '../db/conversationStore.js'
import { buildIndex } from '../search/indexer.js'
import type { SearchDocument } from '../search/indexer.js'

interface AppContextValue {
  hasData: boolean
  setHasData: (v: boolean) => void
  searchIndex: MiniSearch<SearchDocument> | null
  setSearchIndex: (index: MiniSearch<SearchDocument> | null) => void
  initializing: boolean
}

export const AppContext = createContext<AppContextValue>({
  hasData: false,
  setHasData: () => {},
  searchIndex: null,
  setSearchIndex: () => {},
  initializing: true,
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasData, setHasData] = useState(false)
  const [searchIndex, setSearchIndex] = useState<MiniSearch<SearchDocument> | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // Check if data exists in IndexedDB on startup
    getConversationCount().then(async (count) => {
      if (count > 0) {
        setHasData(true)
        // Rebuild search index from stored conversations
        const conversations = await getAllConversations()
        const index = buildIndex(conversations)
        setSearchIndex(index)
      }
      setInitializing(false)
    })
  }, [])

  return (
    <AppContext.Provider value={{ hasData, setHasData, searchIndex, setSearchIndex, initializing }}>
      {children}
    </AppContext.Provider>
  )
}
