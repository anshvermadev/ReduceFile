import { useState } from 'react'
import { useSettingsStore } from './store/settings'
import { SettingsPanel } from './components/SettingsPanel'
import { UploadZone } from './components/UploadZone'
import { FileQueue } from './components/FileQueue'
import { QueueProcessor } from './components/QueueProcessor'
import './style.css'
import { cn } from './lib/utils'

function IndexPopup() {
  const [activeTab, setActiveTab] = useState<'compress' | 'settings'>('compress')
  const { theme } = useSettingsStore()

  // Apply dark mode globally
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <div className={cn("w-[400px] h-[550px] flex flex-col transition-colors", isDark ? 'dark bg-background text-foreground' : 'bg-background text-foreground')}>
      <QueueProcessor />
      <div className="flex mx-4 mt-4 p-1 rounded-2xl shadow-neu-pressed bg-background">
        <button
          className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300", activeTab === 'compress' ? 'shadow-[0_0_15px_rgba(249,115,22,0.5)] text-white bg-primary scale-[1.02]' : 'text-muted-foreground hover:text-foreground hover:scale-[1.01]')}
          onClick={() => setActiveTab('compress')}
        >
          Compress
        </button>
        <button
          className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300", activeTab === 'settings' ? 'shadow-[0_0_15px_rgba(249,115,22,0.5)] text-white bg-primary scale-[1.02]' : 'text-muted-foreground hover:text-foreground hover:scale-[1.01]')}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'compress' ? (
          <div className="space-y-4">
            <div className="text-center mb-4 mt-2">
              <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                ReduceFile
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">
                Smart Image & Document Compression
              </p>
            </div>
            <UploadZone />
            <FileQueue />
          </div>
        ) : (
          <SettingsPanel />
        )}
      </div>
    </div>
  )
}

export default IndexPopup
