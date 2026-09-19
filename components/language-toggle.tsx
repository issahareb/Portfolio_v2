'use client'

import { useLanguage, type Lang } from './language-context'

const LANGUAGE_LABELS: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
}

/** Always-present language switch. The browser language is detected on the
 * first visit, while this control stays available as a manual override. */
export function LanguageToggle({ inline = false }: { inline?: boolean }) {
  const { lang, setLang } = useLanguage()
  if (!lang) return null

  if (inline) return (
    <select aria-label="Language" value={lang}
      onChange={event => setLang(event.target.value as Lang)}
      className="min-h-11 w-[64px] rounded-none border-0 bg-transparent px-1 text-base text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
      {(['de', 'en', 'es'] as const).map(language => <option key={language} value={language} className="bg-[#101115]">{language.toUpperCase()}</option>)}
    </select>
  )

  return (
    <div
      data-page-chrome
      data-language-toggle
      /* Links neben der Schalterblase des Menues und auf deren Mitte
         ausgerichtet. Die Blase sitzt bei 2em vom rechten Rand und ist 48
         Pixel breit (ab 768 dann 56), der Umschalter muss also davor
         beginnen; die Hoehen unterscheiden sich, deshalb der eigene obere
         Abstand statt eines gemeinsamen. */
      className={`${inline ? 'relative' : 'fixed right-[92px] top-[42px] md:right-[100px] md:top-[46px]'} z-50 flex items-center gap-0.5 rounded-full border border-white/10 bg-black/30 p-0.5 font-label text-[13px] uppercase tracking-[0.08em] backdrop-blur-sm`}
    >
      {(['de', 'en', 'es'] as const).map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => setLang(language)}
          aria-pressed={lang === language}
          aria-label={LANGUAGE_LABELS[language]}
          className={`min-h-11 min-w-11 rounded-full px-1.5 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:px-2 ${
            lang === language
              ? 'bg-purple/20 text-accent-tint'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {language}
        </button>
      ))}
    </div>
  )
}
