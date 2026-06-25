import { create } from 'zustand'

export type FileStatus = 'queued' | 'compressing' | 'completed' | 'error'

export interface CompressionResult {
  originalSize: number
  compressedSize: number
  blob: Blob
}

export interface FileItem {
  id: string
  file: File
  status: FileStatus
  progress: number
  result?: CompressionResult
  error?: string
}

interface FilesState {
  queue: FileItem[]
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  clearQueue: () => void
  updateFileProgress: (id: string, progress: number) => void
  setFileCompleted: (id: string, result: CompressionResult) => void
  setFileError: (id: string, error: string) => void
}

export const useFilesStore = create<FilesState>((set) => ({
  queue: [],
  addFiles: (files) => set((state) => {
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'queued' as FileStatus,
      progress: 0
    }))
    return { queue: [...state.queue, ...newItems] }
  }),
  removeFile: (id) => set((state) => ({
    queue: state.queue.filter(item => item.id !== id)
  })),
  clearQueue: () => set({ queue: [] }),
  updateFileProgress: (id, progress) => set((state) => ({
    queue: state.queue.map(item => 
      item.id === id ? { ...item, progress, status: 'compressing' } : item
    )
  })),
  setFileCompleted: (id, result) => set((state) => ({
    queue: state.queue.map(item => 
      item.id === id ? { ...item, result, status: 'completed', progress: 100 } : item
    )
  })),
  setFileError: (id, error) => set((state) => ({
    queue: state.queue.map(item => 
      item.id === id ? { ...item, error, status: 'error' } : item
    )
  }))
}))
