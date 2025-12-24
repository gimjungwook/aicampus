'use client'

import { useTheme } from '@/components/ThemeProvider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const themes = [
  { value: 'system', icon: Monitor, label: '시스템' },
  { value: 'light', icon: Sun, label: '라이트' },
  { value: 'dark', icon: Moon, label: '다크' },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 rounded bg-muted p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'flex items-center justify-center rounded-md p-2 transition-colors',
            theme === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          title={label}
          aria-label={`${label} 모드`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
