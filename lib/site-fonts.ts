import { Anton, League_Spartan, Oswald, Source_Sans_3 } from 'next/font/google'

// Both root layouts share these exact instances. Separate declarations were
// merged into the same generated CSS, where the legacy `swap` face overrode
// the portfolio's `optional` face and restored two unnecessary font preloads.
export const bodyFace = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body-face',
})

export const headingFace = League_Spartan({
  display: 'optional',
  subsets: ['latin'],
  variable: '--font-heading-face',
})

export const posterFace = Anton({
  preload: false,
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-poster-face',
})

export const labelFace = Oswald({
  preload: false,
  subsets: ['latin'],
  variable: '--font-label-face',
})
