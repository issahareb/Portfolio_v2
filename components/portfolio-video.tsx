'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from './language-context'
import styles from './portfolio-video.module.css'

const LABELS = {
  de: { play: 'Abspielen', pause: 'Pause', sound: 'Ton an', mute: 'Stumm' },
  en: { play: 'Play', pause: 'Pause', sound: 'Sound on', mute: 'Mute' },
  es: { play: 'Reproducir', pause: 'Pausa', sound: 'Activar sonido', mute: 'Silenciar' },
}

/** A visible preview plays quietly; user pause and system preferences take priority. */
export function PortfolioVideo({ src, poster, label, active = true, playbackRate = 1, width, height }: {
  src: string; poster?: string; label: string; active?: boolean; playbackRate?: number; width?: number; height?: number;
}) {
  const { lang } = useLanguage()
  const t = LABELS[lang]
  const silentPreviews = ['taxibb', 'guardiangrid', 'schau-1', 'schau-2', 'schau-3', 'lukas-interface']
  const previewKey = src.split('/').pop()?.replace(/\.mp4$/, '') ?? ''
  const silentPreview = silentPreviews.includes(previewKey)
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [enhanced, setEnhanced] = useState(false)
  const [restricted, setRestricted] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [focusElsewhere, setFocusElsewhere] = useState(false)
  const frameCallback = useRef<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [requested, setRequested] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [decoded, setDecoded] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!frame.current) return
    const element = video.current
    setEnhanced(true)
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; addEventListener?: Function; removeEventListener?: Function } }).connection
    const preferences = () => setRestricted(preference.matches || !!connection?.saveData)
    const visibility = () => setHidden(document.hidden)
    const focus = () => setFocusElsewhere(document.documentElement.dataset.workFocus === 'true' && !frame.current?.closest('#hareb-designarchiv'))
    preferences(); visibility(); focus()
    preference.addEventListener('change', preferences)
    connection?.addEventListener?.('change', preferences)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('portfolio-focus-change', focus)
    const prepare = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true) }, { rootMargin: '320px' })
    const observe = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3), { threshold: [0, 0.3] })
    prepare.observe(frame.current); observe.observe(frame.current)
    return () => {
      prepare.disconnect(); observe.disconnect()
      preference.removeEventListener('change', preferences)
      connection?.removeEventListener?.('change', preferences)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('portfolio-focus-change', focus)
      if (frameCallback.current !== null) element?.cancelVideoFrameCallback?.(frameCallback.current)
      element?.pause()
    }
  }, [])

  const allowed = active && visible && !hidden && !focusElsewhere && !paused && (!restricted || requested)
  useEffect(() => {
    const element = video.current
    if (!element) return
    let cancelled = false
    element.playbackRate = playbackRate
    if (near && allowed) element.play().then(() => { if (!cancelled) setBlocked(false) }).catch(() => { if (!cancelled) setBlocked(true) })
    else element.pause()
    return () => { cancelled = true }
  }, [near, allowed, playbackRate])

  const toggle = () => {
    const element = video.current
    if (!element || !active || focusElsewhere || hidden) return
    if (playing) { setPaused(true); element.pause() }
    else {
      setNear(true); setPaused(false); setRequested(true)
      // Keep play in the user gesture for browsers that reject automatic playback.
      if (element.getAttribute('src')) element.play().then(() => setBlocked(false)).catch(() => setBlocked(true))
    }
  }
  return (
    <div ref={frame} className={styles.player} data-video-player data-video-active={active} data-playing={playing} data-decoded={decoded}>
      {poster && <Image fill sizes="(min-width: 1024px) 1100px, 100vw" className={styles.poster} src={poster} alt="" aria-hidden loading="lazy" />}
      {/* Keep the source mounted: playback changes must never reload or blank the preview. */}
      <video ref={video} src={src} aria-label={label} width={width} height={height}
        controls={!enhanced} autoPlay={near && allowed} muted={silentPreview || muted} loop playsInline preload="none"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onPlaying={event => {
          const element = event.currentTarget
          if (typeof element.requestVideoFrameCallback === 'function') frameCallback.current = element.requestVideoFrameCallback(() => { frameCallback.current = null; setDecoded(true) })
          else requestAnimationFrame(() => { if (element.readyState >= 2) setDecoded(true) })
        }} >
        {silentPreview && <track kind="captions" src={`/captions/${previewKey}-${lang}.vtt`} srcLang={lang} label={lang === 'de' ? 'Deutsch' : lang === 'es' ? 'Español' : 'English'} />}
      </video>
      {enhanced && <div className={styles.controls}>
        <button type="button" disabled={!active} tabIndex={active ? undefined : -1} onClick={toggle} aria-label={`${playing && !blocked ? t.pause : t.play}: ${label}`} aria-pressed={paused}>
          {playing && !blocked ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}<span>{playing && !blocked ? t.pause : t.play}</span>
        </button>
        {!silentPreview && <button type="button" disabled={!active} tabIndex={active ? undefined : -1} onClick={() => setMuted(value => !value)} aria-label={`${muted ? t.sound : t.mute}: ${label}`} aria-pressed={!muted}>
          {muted ? <VolumeX size={14} aria-hidden /> : <Volume2 size={14} aria-hidden />}<span>{muted ? t.sound : t.mute}</span>
        </button>}
      </div>}
    </div>
  )
}
