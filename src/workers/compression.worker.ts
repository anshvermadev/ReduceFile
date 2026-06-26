import * as jpeg from '@jsquash/jpeg'
import * as png from '@jsquash/png'
import * as webp from '@jsquash/webp'
import JSZip from 'jszip'

self.onmessage = async (e) => {
  const { id, file, mode, quality } = e.data

  try {
    let q = quality || 80
    if (mode === 'max') q = 40
    else if (mode === 'balanced') q = 75
    else if (mode === 'smart') q = 85

    // Handle DOCX files natively
    if (file.type.includes('wordprocessingml.document') || file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer()
      const zip = new JSZip()
      await zip.loadAsync(arrayBuffer)
      
      const fileNames = Object.keys(zip.files)
      
      for (let i = 0; i < fileNames.length; i++) {
        const filename = fileNames[i]
        if (filename.startsWith('word/media/') && !zip.files[filename].dir) {
           const imgData = await zip.files[filename].async('arraybuffer')
           let decodedImageData: ImageData | null = null
           let compressedImgBuffer: ArrayBuffer | null = null

           try {
             const lowerName = filename.toLowerCase()
             if (lowerName.endsWith('.jpeg') || lowerName.endsWith('.jpg')) {
               decodedImageData = await jpeg.decode(imgData)
               compressedImgBuffer = await jpeg.encode(decodedImageData, { quality: q })
             } else if (lowerName.endsWith('.png')) {
               decodedImageData = await png.decode(imgData)
               compressedImgBuffer = await png.encode(decodedImageData)
             } else if (lowerName.endsWith('.webp')) {
               decodedImageData = await webp.decode(imgData)
               compressedImgBuffer = await webp.encode(decodedImageData, { quality: q })
             }

             if (compressedImgBuffer && compressedImgBuffer.byteLength < imgData.byteLength) {
               zip.file(filename, compressedImgBuffer)
             }
           } catch (imgError) {
             console.warn('Could not compress image inside DOCX:', filename, imgError)
           }
        }
      }

      self.postMessage({ id, progress: 80, type: 'progress' })

      const newDocxBuffer = await zip.generateAsync({ 
        type: 'arraybuffer', 
        compression: "DEFLATE", 
        compressionOptions: { level: 9 } 
      })
      const blob = new Blob([newDocxBuffer], { type: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

      self.postMessage({ id, progress: 100, type: 'progress' })

      self.postMessage({ 
        id, 
        type: 'complete',
        result: {
          originalSize: file.size,
          compressedSize: blob.size,
          blob
        }
      })
      return
    }

    // Handle normal Images
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
      throw new Error('Unsupported file format (Only JPG, PNG, WEBP, DOCX allowed)')
    }

    self.postMessage({ id, progress: 50, type: 'progress' })

    // Compress
    let compressedBuffer: ArrayBuffer

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
