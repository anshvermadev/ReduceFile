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
          className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300", activeTab === 'compress' ? 'shadow-neu text-white bg-primary' : 'text-muted-foreground hover:text-foreground')}
          onClick={() => setActiveTab('compress')}
        >
          Compress
        </button>
        <button
          className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300", activeTab === 'settings' ? 'shadow-neu text-white bg-primary' : 'text-muted-foreground hover:text-foreground')}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'compress' ? (
          <div className="space-y-4">
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
