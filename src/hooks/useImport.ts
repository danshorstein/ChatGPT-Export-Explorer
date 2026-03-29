import { useState, useCallback, useContext } from 'react'
import { parseExport } from '../parser/index.js'
import { bulkUpsertConversations, getExistingIds } from '../db/conversationStore.js'
import { saveManifest } from '../db/manifestStore.js'
import { buildIndex } from '../search/indexer.js'
import { AppContext } from '../state/AppContext.js'
import type { ParseProgress, ImportManifest } from '../types/index.js'

export type ImportStatus = 'idle' | 'running' | 'done' | 'error'

export interface UseImportReturn {
  status: ImportStatus
  progress: ParseProgress | null
  manifest: ImportManifest | null
  duplicateCount: number
  error: string | null
  run: (files: File[]) => Promise<void>
}

export function useImport(): UseImportReturn {
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [progress, setProgress] = useState<ParseProgress | null>(null)
  const [manifest, setManifest] = useState<ImportManifest | null>(null)
  const [duplicateCount, setDuplicateCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { setSearchIndex, setHasData } = useContext(AppContext)

  const run = useCallback(async (files: File[]) => {
    setStatus('running')
    setError(null)
    setDuplicateCount(0)

    try {
      const { conversations, manifest: parsedManifest } = await parseExport(files, (p) => {
        setProgress(p)
      })

      // Detect duplicates
      const incomingIds = conversations.map((c) => c.id)
      const existingIds = await getExistingIds(incomingIds)
      const dupes = incomingIds.filter((id) => existingIds.has(id)).length
      setDuplicateCount(dupes)

      // Store all (upsert handles duplicates)
      setProgress({ phase: 'indexing', current: 0, total: 1, message: 'Saving to local storage…' })
      await bulkUpsertConversations(conversations)
      await saveManifest(parsedManifest)

      // Build search index
      setProgress({ phase: 'indexing', current: 0, total: 1, message: 'Building search index…' })
      const index = buildIndex(conversations)
      setSearchIndex(index)
      setHasData(true)

      setManifest(parsedManifest)
      setStatus('done')
      setProgress({ phase: 'done', current: conversations.length, total: conversations.length, message: 'Import complete' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setStatus('error')
      setProgress({ phase: 'error', current: 0, total: 0, message: `Error: ${msg}` })
    }
  }, [setSearchIndex, setHasData])

  return { status, progress, manifest, duplicateCount, error, run }
}
