import React, { useState, useRef } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  imageFile: File
  onComplete: (croppedFile: File) => void
  onSkip: () => void
}

export function ImageCropper({ imageFile, onComplete, onSkip }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(imageFile)
    setImgSrc(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageFile])

  const handleApply = async () => {
    if (!completedCrop || !imgRef.current || completedCrop.width === 0 || completedCrop.height === 0) {
      onSkip()
      return
    }

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = completedCrop.width
    canvas.height = completedCrop.height

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    canvas.toBlob((blob) => {
      if (!blob) {
        onSkip()
        return
      }
      const newFile = new File([blob], imageFile.name, {
        type: imageFile.type,
        lastModified: Date.now(),
      })
      onComplete(newFile)
    }, imageFile.type)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-foreground">Crop Image</h2>
        <p className="text-sm text-muted-foreground truncate max-w-[300px]">{imageFile.name}</p>
      </div>
      
      <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden rounded-xl border border-border bg-black/20 p-2 shadow-neu-pressed">
        {imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            className="max-h-full max-w-full"
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Crop preview"
              style={{ maxHeight: '60vh', objectFit: 'contain' }}
            />
          </ReactCrop>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={onSkip}
          className="px-6 py-2 rounded-xl font-bold text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5"
        >
          Skip
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 rounded-xl font-bold text-white bg-primary shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105 transition-all"
        >
          Apply Crop
        </button>
      </div>
    </div>
  )
}
