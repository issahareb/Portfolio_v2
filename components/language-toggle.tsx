'use client'

import { useLanguage } from './language-context'

/** Small, always-present DE/EN switch, top-right — language is auto-detected
 *  from the browser on first visit (see language-context.tsx), but this
 *  stays reachable at any time to override that pick. */
export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  if (!lang) return null

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-0.5 rounded-full border border-[#20211e]/15 bg-[#f3f1eb]/95 p-0.5 font-mono text-[10px] uppercase tracking-[0.1em] backdrop-blur-sm">
      {(['de', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === 'de' ? 'Deutsch' : 'English'}
          className={`min-h-9 min-w-9 rounded-full px-2 py-1 transition-colors ${
            lang === l
              ? 'bg-[#d4ed8a] text-[#20211e]'
              : 'text-[#62645c] hover:text-[#20211e]'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
