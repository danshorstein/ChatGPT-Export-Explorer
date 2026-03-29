import Dexie, { type Table } from 'dexie'
import type { Conversation, ImportManifest } from '../types/index.js'

interface StoredManifest extends ImportManifest {
  _key: string
}

class AppDB extends Dexie {
  conversations!: Table<Conversation>
  manifests!: Table<StoredManifest>

  constructor() {
    super('ChatGPTExplorer')
    this.version(1).stores({
      conversations: 'id, created_at, updated_at, title',
      manifests: '_key',
    })
  }
}

export const db = new AppDB()
export type { StoredManifest }
