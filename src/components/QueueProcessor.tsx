import { useEffect, useRef } from 'react'
import { useFilesStore } from '../store/files'
import { useSettingsStore } from '../store/settings'
import { compressFile } from '../lib/compression'

export function QueueProcessor() {
  const { queue, updateFileProgress, setFileCompleted, setFileError } = useFilesStore()
  const { compressionMode, customQuality, autoDownload } = useSettingsStore()
  const processingRef = useRef(new Set<string>())

  useEffect(() => {
    const processQueue = async () => {
      const queuedItems = queue.filter(item => item.status === 'queued')
      
      for (const item of queuedItems) {
        if (processingRef.current.has(item.id)) continue
        
        processingRef.current.add(item.id)
        updateFileProgress(item.id, 10)
        
        try {
          const result = await compressFile(
            item.id, 
            item.file, 
            compressionMode, 
            customQuality,
            (progress) => updateFileProgress(item.id, progress)
          )
          
          setFileCompleted(item.id, result)
          processingRef.current.delete(item.id)

          if (autoDownload) {
            const url = URL.createObjectURL(result.blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `compressed_${item.file.name}`
            a.click()
            URL.revokeObjectURL(url)
          }
        } catch (error: any) {
          setFileError(item.id, error.message || 'Compression failed')
          processingRef.current.delete(item.id)
        }
      }
    }

    processQueue()
  }, [queue, compressionMode, customQuality, autoDownload, updateFileProgress, setFileCompleted, setFileError])

  return null
}
