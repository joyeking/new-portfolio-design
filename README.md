# Yohannes Assefa — Portfolio Recreation

A multi-page recreation and upgrade of the [Framer portfolio](https://appreciative-methods-876869.framer.app), built as a static site on the unmodified [scroll-craft](https://github.com/nateherkai/scroll-craft) engine.

**Live:** https://joyeking.github.io/portfolio-recreation/

## Pages

| Path | Page |
|---|---|
| `/` | Home: hero, client strip, the six case studies as an editorial list, pinned process, capabilities, about + numbers, two client notes, FAQ, contact |
| `/about/` | Story, career timeline, toolkit, 5-step process |
| `/projects/` | Six case studies + nine graphic-design archive entries |
| `/projects/<slug>/` | Fifteen detail pages (challenge / approach / outcome, gallery) — archive entries add a poster stage or device showcase |
| `/blogs/` | Insights list |
| `/blogs/<slug>/` | Two article pages |

## Signature interactions

Deliberately few. The site uses the scroll-craft engine's devices and almost nothing else.

- **Blue circle cursor** that grows over interactive elements (pointer-fine only)
- **One pinned act per page** — the home page pins the "how I work" section, the About
  page pins the five-step process. Everything else is an ordinary scroll-through.
- **Editorial case list** — the home page's selected work is six hairline rows, each a
  link into its own case study, with real duration/scope facts instead of decorative cards
- **Engine count bloom** (`data-sc-count`) for the year/project/client figures
- **Bordered logo grid** — the home page's trusted-by section is hairline cells (8 real
  projects + one full-width "your project here" CTA row); the old marquee is retired, so nothing
  on the site moves on its own
- **Mobile menu** — one `<nav>` that is a row on desktop and a panel under 860px,
  driven by `data-open` so CSS owns the layout and JS owns no geometry
- **View Transitions** between pages, plus `prefers-reduced-motion` handled by the engine

## Design system

`DESIGN.md` is the source of truth: the type ramp, colour roles, spacing, the one
radius scale, the icon rules, the motion budget and the accessibility gates. Five rules
carry it:

1. One display shout per page (the hero) — every other heading is set in the text face
2. The accent is a state, never decoration
3. Rows and hairlines carry structure before boxes do
4. One radius scale: `999px` for pills/tracks, `0` for structure
5. Nothing invented — the numbers are structure and timeline, never invented results

Sections 0–9 describe the craft floor; §11 (v13) is the current art direction — a
warm greige editorial page rebuilt from a supplied reference, with the measurements
in `ANALYSIS.md`. Its look: **Anton** ultra-condensed caps for the shout, **Newsreader**
serif for reading and the italic counter-voice, **Manrope** controls, **DM Mono** data;
paper `#e7e5df` / ink `#151412` / clay `#9d4227` (dark `#181714` / `#eceae3` /
`#d98a63`); black pill buttons with a circled arrow orb; an arch-cropped portrait beside
a right-hand stat rail; a bordered hairline logo grid. The old marquee strip is retired —
nothing on the site moves on its own.

The design work is implemented as `v11`–`v13` blocks at the end of `site.css`
(the `v13 — Reference Editorial` block is current; earlier `v2`–`v12` blocks are
history). Retired components were deleted rather than
overridden: the odometer counters, the sticky project stack, the rotated process cards,
the second grain overlay, the marquee strip and their JS.
`_analysis/specimen.html` is the type/palette proofing board behind `ANALYSIS.md`
(open it directly in a browser; it is not linked from the site).

## Design skills

Installed into `.agents/skills/` (the location Cline scans):

| Skill | Source | What it is for |
|---|---|---|
| `impeccable` | `pbakaus/impeccable` | Design vocabulary + a 61-rule detector (`npx impeccable detect .`) |
| `design-taste-frontend` | `Leonxlnx/taste-skill` | Anti-slop design system: brief inference, dials, layout/type/color/motion rules |
| `redesign-existing-projects` | `Leonxlnx/taste-skill` | Audit-first upgrades for an existing codebase |

```bash
npx skills update                       # refresh what is installed
npx skills add Leonxlnx/taste-skill -s minimalist-ui   # the taste repo has more variants
```

## Stack

- Static HTML/CSS/JS — no framework, no build step required to view
- `engine/scrollcraft.css` + `engine/scrollcraft.js` used unmodified per the engine's rules
- `site.css` / `site.js` carry the portfolio's own design system and bespoke interactions
- `build_site.py` regenerates all pages from the project data at its top

## Rebuild

```bash
node build_site.mjs          # every page is generated; never hand-edit page bodies
npx impeccable detect .      # 61-rule design scan (findings on stderr, --json for CI)
```

## Preview locally

```bash
node dev-server.mjs          # http://localhost:4321/  (or: node dev-server.mjs 5173)
```

Dependency-free static server in the repo root; it only serves this folder and
404s anything else. Stop it with `Ctrl+C` in that terminal, or
`Get-Process node | Where-Object { $_.CommandLine -like '*dev-server*' } | Stop-Process`.

`engine/scrollcraft.css` and `engine/scrollcraft.js` must stay byte-identical — check
with `git diff --stat engine/`, which should print nothing.

## Credits

- Original design & content: Yohannes Assefa (Johnny A.Deme)
- Scroll engine: [nateherkai/scroll-craft](https://github.com/nateherkai/scroll-craft) (MIT)
