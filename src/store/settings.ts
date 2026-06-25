import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CompressionMode = 'smart' | 'balanced' | 'max' | 'custom'

interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  compressionMode: CompressionMode
  customQuality: number
  autoDownload: boolean
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setCompressionMode: (mode: CompressionMode) => void
  setCustomQuality: (quality: number) => void
  setAutoDownload: (auto: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      compressionMode: 'smart',
      customQuality: 80,
      autoDownload: true,
      setTheme: (theme) => set({ theme }),
      setCompressionMode: (compressionMode) => set({ compressionMode }),
      setCustomQuality: (customQuality) => set({ customQuality }),
      setAutoDownload: (autoDownload) => set({ autoDownload }),
    }),
    {
      name: 'compressx-settings',
    }
  )
)
