import { CompressionMode } from '../store/settings'
import { CompressionResult } from '../store/files'

export async function compressFile(
  id: string, 
  file: File, 
  mode: CompressionMode, 
  customQuality: number,
  onProgress: (progress: number) => void
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/compression.worker.ts', import.meta.url), { type: 'module' })

    worker.onmessage = (e) => {
      const { type, progress, result, error } = e.data

      if (type === 'progress') {
        onProgress(progress)
      } else if (type === 'complete') {
        worker.terminate()
        resolve(result)
      } else if (type === 'error') {
        worker.terminate()
        reject(new Error(error))
      }
    }

    worker.onerror = (error) => {
      worker.terminate()
      reject(error)
    }

    worker.postMessage({ id, file, mode, quality: customQuality })
  })
}
