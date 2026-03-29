import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'

interface DropZoneProps {
  onFiles: (files: File[]) => void
  disabled?: boolean
}

export function DropZone({ onFiles, disabled }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) onFiles(files)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onFiles(files)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors select-none
        ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="text-5xl mb-4">📂</div>
      <p className="text-lg font-medium text-gray-700 mb-1">
        Drop your ChatGPT export here
      </p>
      <p className="text-sm text-gray-500">
        Accepts <code className="bg-gray-100 px-1 rounded">.zip</code> or <code className="bg-gray-100 px-1 rounded">.json</code> files — multiple files supported
      </p>
      <button
        type="button"
        disabled={disabled}
        className="mt-5 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
      >
        Choose files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".zip,.json"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
