import { useSettingsStore, CompressionMode } from '../store/settings'
import { cn } from '../lib/utils'

export function SettingsPanel() {
  const { theme, setTheme, compressionMode, setCompressionMode, autoDownload, setAutoDownload } = useSettingsStore()

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-bold text-sm tracking-wide text-foreground">Theme</h3>
        <div className="flex gap-4">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t as 'light' | 'dark' | 'system')}
              className={cn(
                "flex-1 px-3 py-2 text-xs font-bold rounded-xl capitalize transition-all duration-300 bg-background",
                theme === t ? "shadow-neu-pressed text-primary" : "shadow-neu text-muted-foreground hover:text-foreground hover:shadow-neu-strong"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm tracking-wide text-foreground mt-6">Compression Mode</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'smart', label: 'Smart', desc: 'Auto settings' },
            { id: 'balanced', label: 'Balanced', desc: 'Best ratio' },
            { id: 'max', label: 'Maximum', desc: 'Smallest size' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCompressionMode(mode.id as CompressionMode)}
              className={cn(
                "p-4 text-left rounded-2xl text-sm transition-all duration-300 bg-background",
                compressionMode === mode.id ? "shadow-neu-pressed border-none" : "shadow-neu hover:shadow-neu-strong"
              )}
            >
              <div className={cn("font-bold", compressionMode === mode.id ? "text-primary" : "text-foreground")}>{mode.label}</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm tracking-wide text-foreground mt-6">Preferences</h3>
        <label className="flex items-center justify-between p-4 rounded-2xl bg-background shadow-neu cursor-pointer transition-all duration-300 hover:shadow-neu-strong">
          <div>
            <div className="text-sm font-bold text-foreground">Auto-Download</div>
            <div className="text-xs text-muted-foreground font-medium mt-1">Download files when finished</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-xs font-bold w-6 text-right transition-colors",
              autoDownload ? "text-primary" : "text-muted-foreground"
            )}>
              {autoDownload ? "ON" : "OFF"}
            </span>
            <div className={cn(
              "relative inline-flex h-6 w-12 items-center rounded-full shadow-neu-pressed transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              autoDownload ? "bg-primary" : "bg-black/5 dark:bg-black/40"
            )}>
              <input 
                type="checkbox" 
                name="toggle" 
                checked={autoDownload}
                onChange={(e) => setAutoDownload(e.target.checked)}
                className="peer sr-only"
              />
              <div className={cn(
                "pointer-events-none absolute left-[2px] h-5 w-5 rounded-full shadow-neu transition-transform",
                autoDownload ? "translate-x-6 bg-white" : "bg-white dark:bg-neutral-300"
              )}></div>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}
