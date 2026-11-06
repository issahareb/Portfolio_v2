import assert from 'node:assert/strict'
import fs from 'node:fs'

// Check the production output, not just the source configuration: Next can
// combine font declarations from distinct root layouts into one stylesheet.
for (const lang of ['de', 'en', 'es']) {
  const html = fs.readFileSync(
    `.next/server/app/${lang}/portfolio.html`,
    'utf8',
  )
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => match[0])
  const preloads = links.filter((link) => link.includes('rel="preload"'))
  assert.equal(
    preloads.filter((link) => link.includes('as="font"')).length,
    2,
    `${lang}: only reading and heading fonts should be preloaded`,
  )
  assert.ok(
    !preloads.some((link) => link.includes('hero-robot-poster')),
    `${lang}: the below-the-fold robot must not compete with the intro`,
  )
  const robot = [...html.matchAll(/<img\b[^>]*>/g)]
    .map((match) => match[0])
    .find((tag) => tag.includes('hero-robot-poster'))
  assert.ok(
    robot?.includes('loading="lazy"'),
    `${lang}: robot poster must load lazily`,
  )
  assert.ok(
    robot?.includes('srcSet="/_next/image?'),
    `${lang}: robot uses responsive optimized images`,
  )
  const cssPaths = [
    ...new Set(
      links
        .filter((link) => link.includes('rel="stylesheet"'))
        .map((link) => link.match(/href="([^"]+)"/)[1]),
    ),
  ]
  const css = cssPaths
    .map((path) => fs.readFileSync(path.replace('/_next/', '.next/'), 'utf8'))
    .join('\n')
  assert.ok(
    !css.includes('.hd-kartenmenue'),
    `${lang}: legacy landing-page styles stay off the portfolio`,
  )
  assert.ok(
    !css.includes('.enquiry-row'),
    `${lang}: enquiry styles load only with the form`,
  )
  const headingFaces = [...css.matchAll(/@font-face\{[^}]*\}/g)]
    .map((match) => match[0])
    .filter((face) => /font-family:"?League Spartan"?;/.test(face))
  assert.ok(headingFaces.length > 0, `${lang}: heading font exists`)
  assert.ok(
    headingFaces.every((face) => face.includes('font-display:optional')),
    `${lang}: no other layout may overwrite the heading font-display strategy`,
  )
}
// The entrance must not fetch the portfolio films before it is entered.
for (const lang of ['de', 'en', 'es']) {
  const html = fs.readFileSync(`.next/server/app/${lang}.html`, 'utf8')
  assert.ok(
    !/<video\b/.test(html),
    `${lang}: entrance must not mount portfolio videos`,
  )
  assert.ok(
    html.includes('data-console-phase="standby"'),
    `${lang}: entrance starts before power-on`,
  )
  const portfolio = fs.readFileSync(
    `.next/server/app/${lang}/portfolio.html`,
    'utf8',
  )
  assert.ok(
    portfolio.includes('data-personal-intro'),
    `${lang}: original cinematic intro is restored`,
  )
  assert.ok(
    portfolio.includes(
      `https://issahareb.me/${lang === 'de' ? '' : lang + '/'}portfolio`,
    ),
    `${lang}: portfolio has its own localized URL`,
  )
}
for (const [page, required] of [
  ['de/anfrage', '.enquiry-row'],
  ['en/anfrage', '.enquiry-row'],
  ['es/anfrage', '.enquiry-row'],
  ['start-alt', '.hd2'],
]) {
  const html = fs.readFileSync(`.next/server/app/${page}.html`, 'utf8')
  const paths = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map(
    (match) => match[0].match(/href="([^"]+)"/)[1],
  )
  const css = paths
    .map((path) => fs.readFileSync(path.replace('/_next/', '.next/'), 'utf8'))
    .join('\n')
  assert.ok(
    css.includes(required),
    `${page}: its dedicated styles must still be included`,
  )
}
console.log(
  'Portfolio initial assets: fonts, lazy responsive poster and route-specific CSS verified in all languages.',
)
