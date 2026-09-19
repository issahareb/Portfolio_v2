'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import styles from './site-navigation.module.css'

export type BubbleItem = { label: string; href: string; ariaLabel?: string }
type Props = {
  logo: ReactNode
  items: BubbleItem[]
  controls?: ReactNode
  menuAriaLabel?: string
  closeAriaLabel?: string
  navAriaLabel?: string
  onLogoClick?: (e: React.MouseEvent) => void
  onItemClick?: (e: React.MouseEvent, href: string) => void
}

/** Native modal navigation: browser focus containment, independent touch
 * scrolling and a synchronous scroll unlock before an anchor is followed. */
export function BubbleMenu({ logo, items, controls, menuAriaLabel = 'Menü öffnen', closeAriaLabel = 'Menü schließen', navAriaLabel = 'Navigation', onLogoClick, onItemClick }: Props) {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const restore = useRef<(() => void) | null>(null)
  const id = useId()

  const release = () => {
    restore.current?.()
    restore.current = null
  }
  useEffect(() => () => { restore.current?.() }, [])

  const closeMenu = () => {
    dialog.current?.close()
    release()
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }
  const openMenu = () => {
    const element = dialog.current
    if (!element || element.open) return
    const body = document.body
    const html = document.documentElement
    const saved = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: html.style.overflow }
    const scrollY = window.scrollY
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis
    lenis?.stop()
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'
    restore.current = () => {
      body.style.position = saved.position
      body.style.top = saved.top
      body.style.width = saved.width
      html.style.overflow = saved.overflow
      window.scrollTo({ top: scrollY, behavior: 'instant' })
      lenis?.start()
    }
    element.showModal()
    setOpen(true)
  }

  return <>
    <header className={styles.header} data-page-chrome>
      <a href="#top" onClick={onLogoClick} className={styles.brand}>{logo}</a>
      <div className={styles.controls}>
        {controls}
        <button ref={trigger} type="button" className={styles.toggle} aria-label={menuAriaLabel} aria-expanded={open} aria-controls={id} onClick={openMenu}><Menu size={23} strokeWidth={1.5} aria-hidden /></button>
      </div>
    </header>
    <dialog ref={dialog} id={id} className={styles.dialog} aria-label={navAriaLabel}
      onCancel={(event) => { event.preventDefault(); closeMenu() }}
      onClose={() => { if (!dialog.current?.open) { release(); setOpen(false) } }}>
      <div className={styles.dialogHeader}>
        <span className={styles.brand}>{logo}</span>
        <button type="button" className={styles.toggle} aria-label={closeAriaLabel} onClick={closeMenu} autoFocus><X size={23} strokeWidth={1.5} aria-hidden /></button>
      </div>
      <div className={styles.scrollArea} data-lenis-prevent>
        <nav aria-label={navAriaLabel}>
          <ul className={styles.links}>
            {items.map(item => <li key={item.href}>
              <a href={item.href} aria-label={item.ariaLabel} onClick={(event) => { closeMenu(); onItemClick?.(event, item.href) }}>
                {item.label}<ArrowUpRight size={22} strokeWidth={1.5} aria-hidden />
              </a>
            </li>)}
          </ul>
        </nav>
        <a href="mailto:info@hareb.org" className={styles.email}>info@hareb.org<ArrowUpRight size={17} aria-hidden /></a>
      </div>
    </dialog>
  </>
}
