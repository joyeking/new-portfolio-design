> Historical note: this document records the v13 reference study. The active design system is documented in `DESIGN.md` §12.

# ANALYSIS.md — reading the reference before drawing anything

The brief: rebuild the landing page from the supplied reference image, then carry
that design language through every page. This file records *how* the direction was
derived, so the decisions can be argued with rather than guessed at.

Reference: a solo UI/UX & brand designer portfolio. Warm greige paper, black pill
chrome, an arch-cropped portrait, a right-hand stat rail, hairline service strip,
bordered "trusted by" logo wall, and an asymmetric editorial statement section.

---

## 1. The display face, measured rather than guessed

The whole design hangs on one face: a very heavy, very *condensed* all-caps
grotesque interrupted by an italic serif. Candidates were loaded and their width
for the same string (`DESIGNER`) measured at a fixed 100px, then compared against
the width-per-em read off the reference (≈3.2em).

| Candidate | `DESIGNER` @100px | Verdict |
|---|---|---|
| **Anton 400** | **3.46em** | matches the reference's condensation |
| Oswald 700 | 4.04em | too light in the stroke, too wide |
| Manrope 800 | 4.91em | far too wide |
| Archivo 800 | 5.53em | wrong family — reads American-grotesque |
| Archivo Black | 5.78em | wrong family entirely |

**Chosen: Anton.** It is the only face in the set whose condensation and stroke
weight land together. Archivo/Archivo Black were the first instinct (they read
"modern grotesque") but at reference size they overflow the column by ~70%.

## 2. The counter-voice

The reference's second face is an **italic serif** used for `Hey. I'm Solt,` and
`& Brand` — set at the same optical size as the caps beside it, never smaller.
`Newsreader` italic is already in the project (it was v12's display face), is not
on the "faces that no longer feel distinctive" list, and its italic has the
old-style warmth the reference wants. It also does the **reading** text: in the
reference every paragraph — hero copy, service descriptions, stat labels, the
whole about column — is serif, not sans.

So the roles invert from v12:

| | v12 | v13 |
|---|---|---|
| display | Newsreader (serif, roman) | **Anton** (condensed caps) |
| accent voice | one italic word | **Newsreader italic**, at caps size |
| reading | Manrope | **Newsreader** (roman) |
| controls | Manrope | Manrope (unchanged) |
| data/labels | DM Mono | DM Mono (unchanged) |

## 3. Colour — sampled, then checked

The reference has **no accent colour at all**: warm paper, near-black ink, warm
grey text, and photography supplying every other hue. Samples read off it:

```
paper   #e7e5df    raised  #eeece6    cell    #dedcd4
ink     #151412    muted   #63615a    hairline #cbc8bf
```

WCAG was computed rather than assumed:

| Pair | Ratio | Gate |
|---|---|---|
| ink `#151412` / paper `#e7e5df` | **14.61:1** | AAA ✓ |
| muted `#63615a` / paper | **4.92:1** | AA body ✓ |
| accent `#9d4227` / paper | **5.14:1** | AA links ✓ |
| paper / ink pill | **14.61:1** | AAA ✓ |
| ink `#eae7df` / dark `#101114` | **15.28:1** | AAA ✓ |
| muted `#9b978d` / dark | **6.15:1** | AA ✓ |
| accent `#d98a63` / dark | **6.63:1** | AA ✓ |

`#6b6960` was tested first and **rejected at 4.37:1** — under AA for body copy.

The one addition the reference doesn't have is an accent. A hue has to come from
somewhere deliberate, so it is **clay `#9d4227`** (warm, sits inside the greige
family, echoes the reference's tan) and it is used *only* as a mark: the
availability dot, the focus ring, link hover, the active-nav underline. Never a
fill — the primary button is ink, as in the reference.

## 4. Layout read (proportions from the reference)

- **Header**: no bar. `● brand` top-left, black `MENU ≡` pill top-right, floating
  over the paper.
- **Hero**: three parts — copy left, **arch portrait centre rising to the very top
  edge of the page**, stat rail right and right-aligned. The portrait breaks the
  header line, which only works because the header has no background.
- **Arch**: top corners barely radiused, bottom corners a deep ellipse
  (`14px 14px 44% 44%`) — a tombstone, not a rounded rectangle.
- **Service strip**: four hairline-divided columns directly under the hero, bold
  caps title over a small serif description.
- **Trusted by**: display heading left / note right, then a bordered 4×2 cell grid.
- **Statement**: giant caps heading left, serif lead + muted serif body right.
- **Portfolio**: display heading left / note right, then the work.

Mapped onto the existing page, that reorders the home page to:
hero → capabilities strip → trusted-by grid → statement → selected work →
process → client notes → FAQ → contact. Content is unchanged; only its clothes
and its order are.

## 5. What is deliberately *not* taken

- **The fictional copy** (`Solt`, `DOMINIC`, 15+/280+/*99%) — every number on
  this site stays real and verifiable.
- **The marquee** — the reference's proof is a static bordered logo wall, so the
  one marquee is retired in favour of it (DESIGN.md §11).
- **Hamburger-only on desktop** was considered and rejected: the reference shows
  a MENU pill, and it is kept — but the panel carries `aria-current`, is Escape-
  dismissable, and every page still ends with a contact section and a footer nav.

## 6. Tooling note

Screenshots were attempted (`browser.screenshot`) and are unavailable in this
environment — no visible desktop window. Verification therefore runs on
measurements: WCAG ratios above, font metrics above, plus console-error and
layout checks after each rebuild.
