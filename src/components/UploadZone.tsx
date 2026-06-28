import { useCallback, useState } from 'react'
import { UploadCloud, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react'
import { useFilesStore } from '../store/files'
import { cn } from '../lib/utils'
import { ImageCropper } from './ImageCropper'

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const addFiles = useFilesStore(state => state.addFiles)

  // Cropping state
  const [pendingImages, setPendingImages] = useState<File[]>([])
  const [processedFiles, setProcessedFiles] = useState<File[]>([])
  const [showPrompt, setShowPrompt] = useState(false)
  const [showCropper, setShowCropper] = useState(false)

  const handleFiles = useCallback((files: File[]) => {
    const images = files.filter(f => f.type.startsWith('image/'))
    const others = files.filter(f => !f.type.startsWith('image/'))
    
    if (images.length > 0) {
      setPendingImages(images)
      setProcessedFiles(others)
      setShowPrompt(true)
    } else {
      addFiles(others)
    }
  }, [addFiles])

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
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [handleFiles])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }, [handleFiles])

  const handleCropComplete = (croppedFile: File) => {
    const newProcessed = [...processedFiles, croppedFile]
    const remaining = pendingImages.slice(1)
    
    if (remaining.length > 0) {
      setPendingImages(remaining)
      setProcessedFiles(newProcessed)
    } else {
      addFiles(newProcessed)
      setShowCropper(false)
    }
  }

  const handleCropSkip = () => {
    const newProcessed = [...processedFiles, pendingImages[0]]
    const remaining = pendingImages.slice(1)
    
    if (remaining.length > 0) {
      setPendingImages(remaining)
      setProcessedFiles(newProcessed)
    } else {
      addFiles(newProcessed)
      setShowCropper(false)
    }
  }

  const handlePromptYes = () => {
    setShowPrompt(false)
    setShowCropper(true)
  }

  const handlePromptNo = () => {
    addFiles([...processedFiles, ...pendingImages])
    setShowPrompt(false)
    setPendingImages([])
    setProcessedFiles([])
  }

  return (
    <>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative p-8 border-2 border-dashed rounded-[2rem] text-center cursor-pointer transition-all duration-300 shadow-neu overflow-hidden group",
          isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-border/50 bg-gradient-to-b from-background to-background/80 hover:scale-[1.01] hover:shadow-neu-strong hover:border-primary/50"
        )}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={onFileChange}
        />
        <div className="relative mx-auto w-20 h-20 mb-6 rounded-full shadow-neu-pressed bg-background flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <UploadCloud className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
        </div>
        <p className="relative text-lg font-black text-foreground mb-2">Drag & Drop files here</p>
        <p className="relative text-sm font-medium text-muted-foreground mb-6">or click to browse from your computer</p>

        <div className="relative flex justify-center gap-3 mt-6">
          <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-orange-500 to-amber-500">JPG</span>
          <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-red-500 to-rose-500">PNG</span>
          <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-emerald-500 to-teal-500">WEBP</span>
          <span className="px-4 py-1.5 text-xs font-bold tracking-wider rounded-full shadow-neu text-white bg-gradient-to-r from-blue-500 to-cyan-500">DOCX</span>
        </div>
      </div>

      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background rounded-3xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-border">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Crop Images?</h3>
            <p className="text-center text-sm text-muted-foreground mb-6">
              You've selected {pendingImages.length} image(s). Would you like to crop them before compressing?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handlePromptNo}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 transition-colors"
              >
                <XCircle className="w-4 h-4" /> No, Skip
              </button>
              <button
                onClick={handlePromptYes}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-primary shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:scale-105 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Yes, Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {showCropper && pendingImages.length > 0 && (
        <ImageCropper
          imageFile={pendingImages[0]}
          onComplete={handleCropComplete}
          onSkip={handleCropSkip}
        />
      )}
    </>
  )
}
