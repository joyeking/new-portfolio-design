# DESIGN.md — the portfolio's visual system

The single source of truth for how this site looks, and why. Written for the next
person (or agent) who touches it. `build_site.mjs` renders every page; `site.css`
carries this system; `engine/scrollcraft.css` + `engine/scrollcraft.js` are
**unmodified** and must stay that way.

---

## 0. The design read

> Solo designer portfolio for prospective clients and recruiters, with a quiet
> editorial language, leaning toward native CSS on the engine's own vocabulary
> (`.sc-display`, `.sc-label`, `.sc-body`, tokens, `data-sc-*` devices).

Three dials, held deliberately low:

| Dial | Value | Meaning here |
|---|---|---|
| `DESIGN_VARIANCE` | 4 | Offset rhythm and an editorial grid — never rotated cards or tilted collage |
| `MOTION_INTENSITY` | 4 | Engine reveals, one pinned act. No bounce, no tilt, no spotlight confetti |
| `VISUAL_DENSITY` | 2 | Airy. Space and hairlines carry structure instead of boxes and shadows |

## 1. The five rules (read these before adding anything)

1. **One shout per page.** The hero owns the display face. Every other heading is
   set in the text face. A page with six 100px headlines has no hierarchy left.
2. **The accent is a state, not a decoration.** Blue marks exactly one thing per
   viewport: the primary action. Labels, borders, numbers and headings are ink or
   muted. Links turn accent on hover.
3. **Rows and hairlines before cards.** Structure comes from alignment and 1px
   rules. A card earns its border only when the whole thing is clickable.
4. **One radius scale.** `10px` for anything you click or that holds content;
   `999px` only for pills/tracks/dots. Never mix.
5. **Nothing invented.** Numbers on this site are structure and timeline, never
   invented business results.

## 2. Type

Two families, one mono — unchanged from the brand:

- **Display:** Bebas Neue — the poster voice. Hero `<h1>` only, plus the
  three-digit result figures on case studies.
- **Text:** Manrope — all headings and prose. Weights 400/500/600/700 (500 and 600
  do the hierarchy work that 400↔700 used to shout).
- **Mono:** DM Mono — labels, meta, counts, chips. Always uppercase, always tracked.

| Token | Value | Used for |
|---|---|---|
| `--t-display` | `clamp(52px, 7.6vw, 118px)` | hero `<h1>` |
| `--t-h2` | `clamp(26px, 3vw, 40px)` | section headings |
| `--t-h3` | `clamp(19px, 1.6vw, 23px)` | entry titles, step titles |
| `--t-body` | `clamp(15px, 1.1vw, 16.5px)` | prose |
| `--t-small` | `13.5px` | secondary prose, card copy |
| `--t-label` | `12px` | labels, meta, chips |

Rules: display leading `.88`, headings `1.12`, body `1.68`. Display tracking `0`
(Bebas is already condensed); headings `-.02em`; labels `+.14em`. Prose measure
`62ch`. Headings get `text-wrap: balance`, paragraphs `text-wrap: pretty`.
Numbers are DM Mono with `font-variant-numeric: tabular-nums` — never proportional.

Labels carry a 22px hairline tick (`.kicker`) so a label reads as a deliberate
marker rather than a floating word.

## 3. Colour

| Role | Dark | Light | Notes |
|---|---|---|---|
| canvas | `#151515` | `#f3f1ea` | never flat: 26px dot field + `.noise` grain |
| surface | `#202020` | `#ffffff` | only for clickable containers |
| ink | `#f5f3ee` | `#191b20` | |
| muted | `#a5a7aa` | `#63666d` | ≥4.5:1 on canvas |
| accent | `#09aef4` | `#09aef4` | state only |
| hairline | `color-mix(in srgb, var(--ink) 14%, transparent)` | | 26% for interactive edges |

One accent. Hairlines are mixed from ink so they invert correctly with the theme.
Shadows run in a single direction (light from above) and are used at most once per
screen; depth is otherwise carried by the grain and the dot field. No pure black,
no pure white.

## 4. Space, grid, radius

`--sec: clamp(72px, 9vw, 132px)` vertical section rhythm, `--gap: 24px` row gap.
Container: `min(1180px, 100% - 48px)`. Editorial rows use
`38px | 160–220px | 1fr | 150px` (index, image, body, meta) and collapse to a stack
below 900px. Radius: `10px` / `999px` only. Nothing is rotated.

## 5. Icons

One inline SVG sprite in `build_site.mjs` (`SPRITE`), 24px viewBox, **1.5px stroke,
round caps, `currentColor`, no fills**. Use `<svg class="ic"><use href="#i-…"/></svg>`.
Available: arrow-right, arrow-up-right, mail, phone, pin, clock, search, layers,
target, chevron-down, menu, close, up, check, quote.

Rules: icons replace characters (`↗`, `→`, `+`) everywhere; always `aria-hidden`
with a text label beside them; never the only label; one size per context (18px
default, 16px inside buttons, 20px in step markers).

## 6. Motion

Inherited from the engine, deliberately narrow:

- `[data-sc-in]` / `[data-sc-stagger]` reveals — 620ms, opacity + 14px rise, once.
- One pinned act per page (`data-sc-act="pin"` + `data-sc-cue` plateaus).
- No marquee remains. The client strip was replaced in v13 by a bordered
  `.logo-grid` (static, crawlable, no `aria-hidden` trickery needed).
- Numbers use the engine's `data-sc-count` bloom (no bespoke odometer).
- Hover feedback 180–350ms `--sc-ease-out`; reveals 620ms; nothing loops.

Banned by this system: card rotation, 3D tilt, cursor spotlight on text blocks,
infinite micro-animations, bounce easing, coloured zero-offset glows.

## 7. States every interactive thing owes the user

Default → hover → `:focus-visible` (2px accent ring, 3px offset) → active →
disabled. The theme switch keeps `aria-pressed`; nav carries `aria-current="page"`;
the mobile menu button carries `aria-expanded` + `aria-controls`; the form has real
`<label>`s, `required`, `type=email`, and an `aria-live="polite"` status region; a
skip link jumps to `#main`; every page has one clear way forward and back.

## 8. Accessibility gates (never bypass)

WCAG AA body / AAA hero contrast in both themes · focus visible everywhere ·
`prefers-reduced-motion` honoured · real labels and headings in order · icons
decorative · navigation reachable at every breakpoint (the mobile menu is not
optional) · `lang`, `title`, description, OG/Twitter/canonical present.

## 9. Verification

```bash
node build_site.mjs          # regenerate every page from the data at the top
npx impeccable detect .      # 61-rule design detector, findings on stderr
```

Engine files must stay byte-identical: `git diff --stat engine/` returns nothing.

---

## 10. v12 — Editorial Paper (the current art direction)

Sections 0–9 describe v11, which disciplined the old design but kept its look.
v12 replaces the art direction. A cleaner version of the same idea is still the
same idea, so these are deliberate replacements, not refinements.

| | v11 | v12 |
|---|---|---|
| canvas | dark `#151515` first, dot grid | **cool neutral paper `#f1f2f2`** first, grain only; ink `#101114` is the alternate |
| display face | Bebas Neue (condensed sans) | **Newsreader** — editorial serif, used at 3 sizes |
| reading face | Manrope | Manrope (unchanged) |
| labels | DM Mono | DM Mono (unchanged) |
| accent | filled the primary button | **a mark only** — availability dot, focus ring, hover, links |
| primary action | accent fill | **inverts the canvas**: ink on paper, paper on ink |
| contact band | cream slab | **always inverts**, so it reads as a printed page break |
| nav | floating blurred pill | **full-width printed bar**, one hairline, no radius |
| radii | 10px / 14px | 6px / 8px — closer to print than app chrome |
| theme attribute | `data-theme=light` | `data-theme=dark` (paper is the default) |

**Type scale (serif):** `--t-display` `clamp(50px,8.2vw,124px)` hero only ·
`--t-h2` `clamp(30px,3.4vw,50px)` section headings · `clamp(23px,2.4vw,33px)`
project titles · pull quotes `clamp(21px,2.4vw,32px)/1.3`. Index numbers and one
word per hero are set **italic** — the only ornament in the system.

**Numbers stay mono** (`DM Mono`, tabular) in every context, so figures never
shift or pick up the serif's character.

**Rules added in v12**

1. The accent is never a fill. If something needs to be the loudest thing on
   screen, it is ink, not blue.
2. The contact band always inverts relative to the page.
3. One italic word per headline, never more.
4. Serif for meaning (headlines, titles, quotes), Manrope for reading and
   controls, DM Mono for data. No exceptions.
5. `data-sc-drift` is gone: the engine's colour drift cannot be themed, and a
   fixed dark drift fought the paper canvas. The scroll progress line keeps its
   device and is lifted above the bar instead.

**Two palette/font decisions came from the detector, not from taste alone**

- The first paper pass used a warm cream (`#f6f4ef`) and the detector flagged it
  13 times as "cream / beige — the safe tasteful AI default". It was right: the
  hue had to come from somewhere deliberate. The paper is now a **cool neutral**
  (`#f1f2f2`) against a **cool ink** (`#14161a`), which reads Swiss rather than
  cozy. Cream is not banned by this system; *unexamined* warmth is.
- The first serif was Instrument Serif, which the detector lists among faces that
  "no longer feel distinctive" because every generated UI converges on them.
  **Newsreader** replaced it.

**Known engine-owned findings (26, not fixable here).** The detector reports
`Primary font: geist` and `Primary font: instrument sans` 13× each. Those strings
come from the *default token values inside `engine/scrollcraft.css`*, which the
engine's own rules forbid editing. This site overrides them in `site.css`; the
detector reads the engine file, not the cascade. Left deliberately.

---

## 11. v13 — Reference Editorial (the current art direction)

v12's rules (0–9) still stand: one shout, accent-as-state, hairlines before
cards, real numbers, the accessibility gates. v13 replaces the *face and palette*
again, this time from a supplied reference composition rather than from taste
alone. The full read — measurements, contrast maths, what was deliberately not
taken — lives in `ANALYSIS.md`; this section is what the system now permits.

| | v12 | v13 |
|---|---|---|
| canvas | cool neutral paper `#f1f2f2` | **warm greige paper `#e7e5df`** with grain; ink alternate `#181714` |
| display face | Newsreader (editorial serif) | **Anton** — ultra-condensed grotesque caps |
| reading face | Manrope | **Newsreader** — serif body + italic counter-voice |
| controls | Manrope | **Manrope** (unchanged) |
| labels / data | DM Mono | DM Mono (unchanged) |
| accent | blue, a mark only | **clay `#9d4227`** (dark: `#d98a63`) — still a mark, never a fill |
| nav | full-width printed bar | **no bar** — wordmark left, black `MENU` pill right, floats and gains a hairline `.is-stuck` |
| primary action | invert the canvas | **black pill + circled arrow orb** |
| radii | 6px / 8px | pill (`999px`) for actions, 0 for structure |
| trusted-by | one marquee | **bordered `.logo-grid`**, 7 cells + one "your project here" CTA cell |

**Type roles.** Anton is a display face with one job: the hero h1, the page-head
titles, and section numbers — always caps, `--t-display: clamp(44px,7.9vw,114px)`,
line-height under 1. Newsreader carries everything that is *read*: body, leads,
pull quotes, and one `<em>` italic word per headline as the system's only
ornament. Manrope owns buttons and fields; DM Mono owns stats and labels with
tabular figures. Anton never sets a paragraph, a label, or a button.

**Palette.** Light: paper `#e7e5df`, ink `#151412`, muted `#63615a`, clay
`#9d4227`. Dark: `#181714` / `#eceae3` / `#9b978d` / `#d98a63`. All combinations
AA-or-better; the muted tones clear 4.5:1 on their paper. Clay remains a *state*
colour (focus ring, hover, availability dot) exactly as blue was in v12.

**Layout signatures permitted in v13**

1. The **arch-cropped portrait** (rounded top, flat base) — the only image mask.
2. The **stat rail**: a right-hand column of mono figures with hairline dividers,
   beside the hero, not below it.
3. The **hairline strip / bordered logo grid**: structure from 1px rules, never
   from cards or shadows.
4. The **asymmetric statement** section: one oversized display line + an italic
   serif paragraph, deliberately off-centre.

**Rules carried forward unchanged:** one shout per page; the accent is a state;
hairlines before cards; one radius scale (`999px` pills, `0` structure); nothing
invented — the numbers stay Yohannes Assefa's real ones, and the reference's
fictional copy ("Solt", "DOMINIC", 15+/280+/*99%) was never adopted.

**Font proofing.** Anton was chosen by measurement, not vibe: for the same
reference cap-height it renders "DESIGNER" at 3.46em versus the reference's
~3.2em — the closest of four candidates (Archivo Black 5.78, Archivo 800 5.53,
Oswald 4.04 were rejected). The display clamp was then tuned until the hero h1
fills its column without overflowing at 1440/820/390.



