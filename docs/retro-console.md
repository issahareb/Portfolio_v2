# Retro portfolio console

The portfolio now opens with `RetroConsole` instead of the cinematic video,
loading overlay and separate hero. The existing LUKAS, projects, about,
technology, process and contact sections remain accessible without powering on.

## Design and interaction

- Manrope and Hareb Digital's actual paper `#f3f1eb`, ink `#20211e` and lime
  `#d4ed8a` tokens, sampled from `Harebdigital`.
- CSS perspective cabinet, recessed CRT, physical power switch, speaker grille,
  screw heads, vents, feet and a folding module deck. No WebGL runtime or video
  download is needed for the opening screen.
- Standby → booting → ready lifecycle. Powering off cancels a pending boot timer.
- Three project previews use existing local assets. Each links to the matching
  portfolio section; About, System and Contact expose their own content/actions.
- Browser language and the existing DE/EN switch drive the copy.
- Touch controls, keyboard focus, arrow/Home/End navigation between module keys,
  `aria-pressed`, boot status and direct anchors. Section jumps transfer focus.
- Reduced motion disables tilt and CSS animation and skips the timed boot.

The legacy blue/purple color tokens now resolve to lime shades to keep the
existing sections consistent. The standalone affiliate component retains its
Spanish option locally: the global portfolio language type only supports DE/EN.
This resolves a pre-existing TypeScript build error.

## Verification

- `corepack pnpm@10.30.3 install --frozen-lockfile`
- `corepack pnpm@10.30.3 exec tsc --noEmit`
- `corepack pnpm@10.30.3 build`
- Isolated DOM interaction check: standby, disabled keys, interrupted boot,
  successful boot, forward/back/wrapping project selection, all modules, mail
  link, anchor routing and focus, shutdown, local assets, DE/EN, reduced-motion
  startup and keyboard module focus. Motion and CSS were adapted for this check;
  this does not verify rendering or animation.

Browser visual QA is still required on a phone and desktop. The managed preview
launcher supplied Vite-only `--host` and `--strictPort` arguments to `next dev`,
so the browser preview could not start in the implementation environment.
Check the folded/expanded deck, screen copy fit, language switch, focus rings,
320/390/768/1440px widths, landscape mode and reduced-motion mode before release.
