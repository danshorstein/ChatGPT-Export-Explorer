import { db } from './db.js'
import type { ImportManifest } from '../types/index.js'

const MANIFEST_KEY = 'latest'

export async function saveManifest(manifest: ImportManifest): Promise<void> {
  await db.manifests.put({ ...manifest, _key: MANIFEST_KEY })
}

export async function loadManifest(): Promise<ImportManifest | null> {
  const stored = await db.manifests.get(MANIFEST_KEY)
  if (!stored) return null
  const { _key: _k, ...manifest } = stored
  return manifest
}

export async function clearManifest(): Promise<void> {
  await db.manifests.delete(MANIFEST_KEY)
}
