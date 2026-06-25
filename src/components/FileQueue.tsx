import { useFilesStore } from '../store/files'
import { Trash2, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function FileQueue() {
  const { queue, removeFile } = useFilesStore()

  if (queue.length === 0) return null

  return (
    <div className="space-y-3 mt-4">
      {queue.map(item => (
        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-background text-foreground shadow-neu">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="flex-shrink-0">
              {item.status === 'queued' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">...</div>}
              {item.status === 'compressing' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
              {item.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {item.status === 'error' && <AlertCircle className="w-5 h-5 text-destructive" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{item.file.name}</p>
              <div className="text-xs text-muted-foreground flex gap-2">
                <span>{formatBytes(item.file.size)}</span>
                {item.result && (
                  <>
                    <span>→</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {formatBytes(item.result.compressedSize)}
                      {' '}({Math.round((1 - item.result.compressedSize / item.result.originalSize) * 100)}%)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {item.status === 'completed' && item.result && (
              <button 
                onClick={() => {
                  const url = URL.createObjectURL(item.result!.blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `compressed_${item.file.name}`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="p-2 ml-2 rounded-full shadow-neu text-primary hover:shadow-neu-pressed transition-all"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => removeFile(item.id)}
              className="p-2 ml-2 rounded-full shadow-neu text-destructive hover:shadow-neu-pressed transition-all"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
