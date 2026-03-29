import { useNavigate } from 'react-router-dom'
import { DropZone } from '../components/import/DropZone.js'
import { ImportProgress } from '../components/import/ImportProgress.js'
import { ManifestSummary } from '../components/import/ManifestSummary.js'
import { useImport } from '../hooks/useImport.js'

export function WelcomeView() {
  const navigate = useNavigate()
  const { status, progress, manifest, duplicateCount, error, run } = useImport()

  if (status === 'done' && manifest) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <ManifestSummary
          manifest={manifest}
          duplicateCount={duplicateCount}
          onContinue={() => navigate('/library')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">ChatGPT Export Explorer</h1>
        <p className="text-gray-600">
          Browse and search your ChatGPT conversation history — entirely in your browser.
        </p>
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm rounded-full px-4 py-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" />
          </svg>
          Your data never leaves your device
        </div>
      </div>

      {/* Drop zone */}
      {status === 'idle' || status === 'error' ? (
        <DropZone onFiles={run} />
      ) : null}

      {/* Progress */}
      {status === 'running' && progress && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <ImportProgress progress={progress} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* How to export instructions */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-gray-900 text-sm">How to export your ChatGPT data</h2>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Go to <strong>ChatGPT → Settings → Data controls</strong></li>
          <li>Click <strong>Export data</strong> and confirm</li>
          <li>Wait for the email from OpenAI (usually a few minutes)</li>
          <li>Download the ZIP file and drop it above</li>
        </ol>
      </div>
    </div>
  )
}
