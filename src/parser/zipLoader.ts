import JSZip from 'jszip'
import type { RawConversation } from '../types/index.js'

export interface LoadedFile {
  filename: string
  conversations: RawConversation[]
}

const CONVERSATIONS_PATTERN = /conversations(-\d+)?\.json$/i

/**
 * Accepts a File which may be a ZIP archive or a single JSON file.
 * Returns parsed conversation arrays from each matched file.
 */
export async function loadFiles(files: File[]): Promise<{ loaded: LoadedFile[]; warnings: string[] }> {
  const loaded: LoadedFile[] = []
  const warnings: string[] = []

  for (const file of files) {
    if (file.name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file)
      const matchingFiles = Object.values(zip.files).filter(
        (f) => !f.dir && CONVERSATIONS_PATTERN.test(f.name),
      )

      if (matchingFiles.length === 0) {
        warnings.push(`No conversations JSON files found in ${file.name}`)
        continue
      }

      for (const zipFile of matchingFiles) {
        const text = await zipFile.async('text')
        const parsed = parseJSON(text, zipFile.name, warnings)
        if (parsed) {
          loaded.push({ filename: zipFile.name, conversations: parsed })
        }
      }
    } else if (file.name.endsWith('.json')) {
      const text = await file.text()
      const parsed = parseJSON(text, file.name, warnings)
      if (parsed) {
        loaded.push({ filename: file.name, conversations: parsed })
      }
    } else {
      warnings.push(`Skipping unsupported file type: ${file.name}`)
    }
  }

  return { loaded, warnings }
}

function parseJSON(
  text: string,
  filename: string,
  warnings: string[],
): RawConversation[] | null {
  try {
    const data = JSON.parse(text) as unknown
    if (!Array.isArray(data)) {
      warnings.push(`${filename}: expected an array of conversations, got ${typeof data}`)
      return null
    }
    return data as RawConversation[]
  } catch (e) {
    warnings.push(`${filename}: JSON parse error — ${e instanceof Error ? e.message : String(e)}`)
    return null
  }
}
