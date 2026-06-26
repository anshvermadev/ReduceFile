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
        "p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 shadow-neu",
        isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-border bg-background hover:scale-[1.01] hover:shadow-neu-strong"
      )}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/jpeg, image/png, image/webp, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="mx-auto w-16 h-16 mb-6 rounded-full shadow-neu-pressed bg-background flex items-center justify-center transition-transform duration-500 hover:rotate-12">
        <UploadCloud className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
      </div>
      <p className="text-base font-bold text-foreground">Click or drag files to compress</p>

      <div className="flex justify-center gap-3 mt-6">
        <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-shadow">JPG</span>
        <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-shadow">PNG</span>
        <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-shadow">WEBP</span>
        <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-shadow">DOCX</span>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-6 font-bold opacity-70">Images & DOCX Supported</p>
    </div>
  )
}
