import { useCallback, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { useFilesStore } from '../store/files'
import { cn } from '../lib/utils'

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const addFiles = useFilesStore(state => state.addFiles)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }, [addFiles])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files))
    }
  }, [addFiles])

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer bg-background",
        isDragging ? "shadow-neu-pressed-strong" : "shadow-neu-pressed"
      )}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="w-16 h-16 mx-auto mb-4 rounded-full shadow-neu flex items-center justify-center bg-background">
        <UploadCloud className="w-8 h-8 text-primary" />
      </div>
      <p className="text-sm font-bold text-foreground">Click or drag images to compress</p>
      
      <div className="flex justify-center gap-3 mt-4">
        <span className="px-3 py-1 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-orange-500 to-amber-500">JPG</span>
        <span className="px-3 py-1 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-red-500 to-rose-500">PNG</span>
        <span className="px-3 py-1 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-emerald-500 to-teal-500">WEBP</span>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-4 font-bold">Image Formats Only</p>
    </div>
  )
}
