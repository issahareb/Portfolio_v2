'use client'

import { BubbleMenu, type BubbleItem } from './bubble-menu'
import { useLanguage, useT } from './language-context'
import { LanguageToggle } from './language-toggle'
import { handleAnchorClick } from '@/lib/scroll-to'
import { langPath } from '@/lib/i18n'

export function SiteNav() {
  const t = useT()
  const { lang } = useLanguage()
  const items: BubbleItem[] = [
    { label: t.nav.lukas, href: '#lukas' },
    { label: t.nav.work, href: '#work' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.stack, href: '#stack' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.contact, href: '#contact' },
    { label: lang === 'de' ? 'Partnerprogramm' : lang === 'es' ? 'Programa de socios' : 'Partner programme', href: langPath(lang, '/affiliate') },
  ]
  return <BubbleMenu
    logo={<>Issa Hareb<span className="text-accent-soft">.</span></>}
    controls={<LanguageToggle inline />}
    items={items}
    menuAriaLabel={t.nav.openMenu}
    closeAriaLabel={t.nav.closeMenu}
    navAriaLabel={lang === 'de' ? 'Hauptnavigation' : lang === 'es' ? 'Navegación principal' : 'Main navigation'}
    onLogoClick={event => handleAnchorClick(event, '#top', -90)}
    onItemClick={(event, href) => { if (href.startsWith('#')) handleAnchorClick(event, href, -90) }}
  />
}
