'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NameSequence, type NameSequenceHandle } from './name-sequence'
import { ScrubVideo, type ScrubVideoHandle } from './scrub-video'
import { useNearViewport } from './use-near-viewport'
import { followProgress } from '@/lib/lukas-motion'

gsap.registerPlugin(ScrollTrigger)

/**
 * The name, with the flythrough running behind it.
 *
 * Film and typography are driven by one ScrollTrigger. Keeping one source of
 * truth matters here: the old name animation waited for a separate 50%
 * IntersectionObserver, so jump navigation and short viewports could leave
 * the film and the title in unrelated states. Both now advance and reverse
 * together on every scroll update.
 */
const SRC = '/videos/intro.mp4'
const SRC_MOBILE = '/videos/intro-mobile.mp4'
const POSTER = '/intro/cinematic-poster.jpg'

export function AboutIntro({ hero = false }: { hero?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const videoRef = useRef<ScrubVideoHandle>(null)
  // The film is the largest asset on the site. Mounted with the section it
  // began downloading the moment the page loaded, in parallel with the
  // hero's own footage — two files competing for the connection before the
  // visitor had scrolled a pixel, which is what left the hero on its poster
  // and this film with nothing buffered to seek into. It is fetched when it
  // is nearly in view instead.
  const { ref: filmRef, near: filmNear } = useNearViewport<HTMLDivElement>('400px')
  const nameRef = useRef<NameSequenceHandle>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (reduced) {
      videoRef.current?.seek(0)
      nameRef.current?.setProgress(1)
      return
    }

    const apply = (progress: number) => {
      videoRef.current?.seek(progress)
      nameRef.current?.setProgress(progress)
    }

    let current = progressRef.current, target = current
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      // Both elements use svh. Safari toolbar resizing must not change the
      // film clock by substituting the transient viewport height here.
      end: () => `+=${Math.max(1, root.offsetHeight - (stageRef.current?.offsetHeight ?? root.offsetHeight))}`,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: self => { target = self.progress },
      onRefresh: self => { target = self.progress },
    })

    target = trigger.progress
    current = target
    progressRef.current = current
    apply(current)
    const tick = (_time: number, delta: number) => {
      if (document.hidden || (!trigger.isActive && Math.abs(current - target) < .00005)) return
      current = followProgress(current, target, delta / 1000)
      progressRef.current = current
      apply(current)
    }
    gsap.ticker.add(tick)

    // Fonts, decoded posters and the sections above can all settle after the
    // first paint. One refresh on the next frame gives this late section its
    // real document position instead of keeping hydration-time measurements.
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      gsap.ticker.remove(tick)
      trigger.kill()
    }
  }, [reduced, filmNear])

  return (
    /* Die Hoehe ist die Geschwindigkeit.
     *
     * Der Film ist 7,6 Sekunden lang, und diese Strecke bestimmt, ueber wie
     * viel Scrollen er ablaeuft — 190vh waren auf einem Telefon rund 1600
     * Pixel, also eine einzige Wischbewegung fuer den ganzen Film samt
     * Namenszug. 300vh geben derselben Sequenz gut die Haelfte mehr Weg.
     *
     * Es gibt hier keinen zweiten Regler: Film und Typografie haengen an
     * einem einzigen ScrollTrigger, und `seek(progress)` bekommt den
     * Fortschritt der Strecke. Wer langsamer will, macht die Strecke laenger.
     */
    <div id={hero ? 'top' : undefined} data-personal-intro ref={rootRef} className={`relative ${reduced ? '' : 'h-[300svh]'}`}>
      <div ref={stageRef} data-intro-stage className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6">
        <div ref={filmRef} data-intro-film aria-hidden className="absolute inset-0">
          {filmNear ? (
            <ScrubVideo
              ref={videoRef}
              src={SRC}
              srcMobile={SRC_MOBILE}
              poster={POSTER}
              fit="cover"
              className="h-full w-full opacity-[0.9]"
            />
          ) : (
            // The poster alone until then: same picture, no 29 MB.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={POSTER}
              alt="Blick über die Dächer von Essen bei Nacht, ein einzelnes Fenster violett beleuchtet"
              className="h-full w-full object-cover opacity-[0.9]"
            />
          )}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              // The scrim is a reading band, not a lid. It used to darken
              // the whole frame from 88% at the centre outwards, on top of a
              // film already held at 55% — together that left a night city
              // barely distinguishable from the page's own black. The film
              // runs at 90% now and only the strip the name occupies is
              // held down.
              'radial-gradient(120% 26% at 50% 46%, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0) 100%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(8,12,21,.35) 0%, transparent 22%, transparent 74%, rgba(8,12,21,.35) 100%)',
          }}
        />
        <div className="relative z-10 w-full">
          <NameSequence ref={nameRef} hero={hero} />
        </div>
      </div>
    </div>
  )
}
