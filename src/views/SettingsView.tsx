import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useManifest } from '../hooks/useManifest.js'
import { useImport } from '../hooks/useImport.js'
import { DropZone } from '../components/import/DropZone.js'
import { ImportProgress } from '../components/import/ImportProgress.js'
import { ManifestSummary } from '../components/import/ManifestSummary.js'

function formatDate(ts: number) {
  return new Date(ts).toLocaleString()
}

export function SettingsView() {
  const navigate = useNavigate()
  const { manifest, clearAll } = useManifest()
  const { status, progress, manifest: newManifest, duplicateCount, error, run } = useImport()
  const [confirmClear, setConfirmClear] = useState(false)

  async function handleClear() {
    await clearAll()
    navigate('/')
  }

  if (status === 'done' && newManifest) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <ManifestSummary
          manifest={newManifest}
          duplicateCount={duplicateCount}
          onContinue={() => navigate('/library')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>

      {/* Current data summary */}
      {manifest && (
        <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 text-sm">Stored data</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{manifest.total_conversations.toLocaleString()} conversations · {manifest.total_messages.toLocaleString()} messages</p>
            <p>Last imported: {formatDate(manifest.imported_at)}</p>
          </div>
        </section>
      )}

      {/* Re-import */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Import new export</h2>
        <p className="text-xs text-gray-500">
          Importing a newer export will merge with existing data. Duplicate conversations are updated.
        </p>

        {(status === 'idle' || status === 'error') && (
          <DropZone onFiles={run} />
        )}
        {status === 'running' && progress && (
          <ImportProgress progress={progress} />
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </section>

      {/* Clear data */}
      <section className="bg-white border border-red-100 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-red-700 text-sm">Clear all data</h2>
        <p className="text-xs text-gray-500">
          Removes all conversations and the search index from your browser. This cannot be undone.
        </p>

        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear all data…
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, clear everything
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* Privacy note */}
      <section className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h2 className="font-semibold text-green-800 text-sm mb-2">Privacy</h2>
        <p className="text-xs text-green-700 leading-relaxed">
          This application stores all data exclusively in your browser's IndexedDB.
          No data is ever transmitted to any server. There is no backend, no account, and no telemetry.
          You can verify this by inspecting the Network tab in your browser's developer tools.
        </p>
      </section>
    </div>
  )
}
