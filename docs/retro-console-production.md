# Retro console on the production portfolio

The console from PR #17 is now integrated on top of production `main` (starting
at `89d501a`), rather than merging its outdated parent branch. The localized
`app/[lang]/page.tsx` replaces the cinematic opening with `RetroConsole`.
The current project sections, LUKAS components, navigation, consent, activity
tracking, localized URLs and metadata stay in place.

## Integration

- Scoped cream `#f3f1eb`, ink `#20211e` and lime `#d4ed8a` cabinet with Manrope.
  The font is scoped and does not add another font preload to the document.
- Existing `#top`, `#work`, `#lukas`, `#about`, `#stack` and `#contact` anchors,
  header spacing and the current `kontakt@hareb.digital` address.
- German, English and Spanish copy follows the existing URL-driven language
  provider. The existing Spanish support is preserved.
- Standby, cancellable startup, shutdown, project selection and four modules.
  Reduced motion skips the startup delay; touch does not trigger pointer tilt.
- The cabinet uses a flat transform context. Browser testing found that the
  original preserved 3D context caused the machine layer to intercept the
  power button's clicks while tilted. Flat hit testing keeps the cabinet
  perspective and folding deck, and restores working controls.

## Verification

- Frozen install with pnpm 10.30.3, `tsc --noEmit`, production Next.js build.
- All existing `scripts/check-*.mjs`, including production initial-asset checks.
- Real Chromium checks against the production build: power on, project switch,
  About/System/Contact modules, email target, shutdown and interrupted startup.
- German/English/Spanish navigation and Spanish module copy.
- Contact anchor navigation keeps the localized URL and transfers focus to
  `#contact`.
- Desktop and approximately 340 CSS-pixel viewport inspection with browser zoom;
  no document horizontal overflow, and physical controls remain about 44px or
  taller. This is responsive desktop Chromium, not a physical iPhone/Safari run.

The managed preview launcher passes Vite options to `scripts.dev`. Local QA used
an uncommitted adapter that starts the production Next server with the supplied
port. The original package scripts and lockfile are unchanged.
