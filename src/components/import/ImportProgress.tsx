import type { ParseProgress } from '../../types/index.js'

interface ImportProgressProps {
  progress: ParseProgress
}

export function ImportProgress({ progress }: ImportProgressProps) {
  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">{progress.message}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {progress.total > 0 && (
        <p className="text-xs text-gray-400 text-right">{progress.current} / {progress.total}</p>
      )}
    </div>
  )
}
