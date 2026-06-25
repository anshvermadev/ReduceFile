import * as jpeg from '@jsquash/jpeg'
import * as png from '@jsquash/png'
import * as webp from '@jsquash/webp'

self.onmessage = async (e) => {
  const { id, file, mode, quality } = e.data

  try {
    const arrayBuffer = await file.arrayBuffer()
    let imageData: ImageData

    // Decode
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      imageData = await jpeg.decode(arrayBuffer)
    } else if (file.type === 'image/png') {
      imageData = await png.decode(arrayBuffer)
    } else if (file.type === 'image/webp') {
      imageData = await webp.decode(arrayBuffer)
    } else {
      throw new Error('Unsupported file type')
    }

    self.postMessage({ id, progress: 50, type: 'progress' })

    // Compress
    let compressedBuffer: ArrayBuffer
    let q = quality || 80
    if (mode === 'max') q = 40
    else if (mode === 'balanced') q = 75
    else if (mode === 'smart') q = 85

    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      compressedBuffer = await jpeg.encode(imageData, { quality: q })
    } else if (file.type === 'image/png') {
      compressedBuffer = await png.encode(imageData) // PNG is mostly lossless
    } else if (file.type === 'image/webp') {
      compressedBuffer = await webp.encode(imageData, { quality: q })
    }

    self.postMessage({ id, progress: 100, type: 'progress' })

    const blob = new Blob([compressedBuffer!], { type: file.type })

    self.postMessage({ 
      id, 
      type: 'complete',
      result: {
        originalSize: file.size,
        compressedSize: blob.size,
        blob
      }
    })

  } catch (error: any) {
    self.postMessage({ id, type: 'error', error: error.message })
  }
}
