# Console entrance and preserved portfolio

The entrance now follows the supplied two-state device reference: a compact
cream case with its introduction on the display and a large glowing lime power
button, followed by one taller case containing a display and four physical keys.
There is no separate heading, split landing-page layout, fixed site navigation,
or voice widget around the entrance. Material, glass, scan lines, recessed
speakers, screws and pressed key states provide the visual detail.

## Navigation

- Portfolio: the homepage from immediately before PR #18, restored at
  `/portfolio`, `/en/portfolio` and `/es/portfolio`. This preserves TopScrim,
  AboutIntro's original cinematic film/name scroll sequence, all subsequent
  project/LUKAS/about/stack/contact sections and their components unchanged.
- Projects: native modal with category filters for the existing website work,
  independent applications including GuardianGrid and L.U.K.A.S., the actual
  motion/video assets and archived social account captures in the repository.
  No unverified launch URLs, client claims or current social metrics are added.
- Contact: native modal using the existing enquiry form and `/api/anfrage`,
  including its validation, error handling and email fallback. Direct public
  email and telephone links are present. Form styles are scoped to the cream
  entrance and its code is loaded only when opened.
- Studio: direct localized Hareb Digital URL.

A real portfolio link remains available before power-on and without JavaScript.
Existing home-page hashes still open Projects/Contact or route to the restored
portfolio section. Each portfolio page has its own canonical/hreflang metadata
and appears in the sitemap. The original Open Graph fields are preserved.
Cookie preferences remain accessible from the entrance footer.

## Verification

- Frozen pnpm 10.30.3 install; TypeScript and production Next.js build.
- Existing check scripts, with production asset assertions moved to the restored
  portfolio route and additional entrance checks (no mounted video before entry).
- Production Chromium preview: standby introduction, power-on, interrupted boot,
  four menu actions/targets, project category filtering, native modal closing and
  focus restoration, contact validation without submitting an enquiry, project
  type chooser and Escape, English rendering and localized portfolio target.
- The restored portfolio was entered through its actual key: original intro and
  name were present; scrolling advanced `/videos/intro.mp4` to 3.8 seconds.
- Responsive Chromium at 340 CSS px: no horizontal overflow; all four keys
  measured over 118px high. Contact modal fits this width and retains scrolling.
  This is desktop Chromium with browser zoom, not physical iPhone/Safari testing.
- No test enquiry was sent to production. Successful email delivery is not
  established by UI validation or reuse of the existing backend.

The managed preview's Vite-specific launcher arguments do not match Next.js.
QA used a scratch-only adapter launching the production build under the managed
preview daemon. No package-script or deployment configuration change is needed.
