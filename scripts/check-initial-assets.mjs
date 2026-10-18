import assert from 'node:assert/strict'
import fs from 'node:fs'

// Check the production output, not just the source configuration: Next can
// combine font declarations from distinct root layouts into one stylesheet.
for (const lang of ['de', 'en', 'es']) {
  const html = fs.readFileSync(`.next/server/app/${lang}.html`, 'utf8')
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(match => match[0])
  const preloads = links.filter(link => link.includes('rel="preload"'))
  assert.equal(preloads.filter(link => link.includes('as="font"')).length, 2,
    `${lang}: only reading and heading fonts should be preloaded`)
  assert.ok(!preloads.some(link => link.includes('hero-robot-poster')),
    `${lang}: the below-the-fold robot must not compete with the intro`)
  const robot = [...html.matchAll(/<img\b[^>]*>/g)]
    .map(match => match[0]).find(tag => tag.includes('hero-robot-poster'))
  assert.ok(robot?.includes('loading="lazy"'), `${lang}: robot poster must load lazily`)
  assert.ok(robot?.includes('srcSet="/_next/image?'), `${lang}: robot uses responsive optimized images`)
  const cssPaths = [...new Set(links.filter(link => link.includes('rel="stylesheet"'))
    .map(link => link.match(/href="([^"]+)"/)[1]))]
  const css = cssPaths.map(path => fs.readFileSync(path.replace('/_next/', '.next/'), 'utf8')).join('\n')
  const headingFaces = [...css.matchAll(/@font-face\{[^}]*\}/g)]
    .map(match => match[0]).filter(face => /font-family:"?League Spartan"?;/.test(face))
  assert.ok(headingFaces.length > 0, `${lang}: heading font exists`)
  assert.ok(headingFaces.every(face => face.includes('font-display:optional')),
    `${lang}: no other layout may overwrite the heading font-display strategy`)
}
console.log('Initial assets: all languages have two font preloads, optional heading faces and a lazy responsive robot poster.')
