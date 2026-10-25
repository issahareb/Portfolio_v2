'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { onConsentChange } from '@/lib/consent'
import { startActivityTracker } from '@/lib/activity-tracker'

export function Analytics() {
  const path = usePathname()
  useEffect(() => {
    let stop: ((revoked?: boolean) => void) | undefined
    const unsubscribe = onConsentChange(state => {
      if (state?.analytics === true) { if (!stop) stop = startActivityTracker(path) }
      else { stop?.(true); stop = undefined }
    })
    return () => { unsubscribe(); stop?.() }
  }, [path])
  return null
}
