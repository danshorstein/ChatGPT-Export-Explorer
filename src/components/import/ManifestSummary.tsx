import type { ImportManifest } from '../../types/index.js'

interface ManifestSummaryProps {
  manifest: ImportManifest
  duplicateCount: number
  onContinue: () => void
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function ManifestSummary({ manifest, duplicateCount, onContinue }: ManifestSummaryProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 max-w-xl mx-auto">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Import complete</h2>
        <p className="text-sm text-gray-500">Your data is stored locally in your browser.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="Conversations" value={manifest.total_conversations.toLocaleString()} />
        <Stat label="Messages" value={manifest.total_messages.toLocaleString()} />
        <Stat label="Earliest" value={manifest.date_range.earliest ? formatDate(manifest.date_range.earliest) : '—'} />
        <Stat label="Latest" value={manifest.date_range.latest ? formatDate(manifest.date_range.latest) : '—'} />
      </div>

      {duplicateCount > 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          {duplicateCount} duplicate conversation{duplicateCount !== 1 ? 's' : ''} detected and updated.
        </p>
      )}

      {manifest.warnings.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            {manifest.warnings.length} parsing warning{manifest.warnings.length !== 1 ? 's' : ''}
          </summary>
          <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto text-xs text-gray-400">
            {manifest.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </details>
      )}

      <button
        onClick={onContinue}
        className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Browse conversations →
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  )
}
