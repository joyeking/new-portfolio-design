# Yohannes Assefa Portfolio

A static, multi-page portfolio shaped around the problem each design solves and
the approach that led to it.

**Live:** https://joyeking.github.io/new-portfolio-design/

## Pages

| Path | Page |
|---|---|
| `/` | Problem-led introduction, working method, selected work, client notes, contact |
| `/about/` | Background, tools, and design method |
| `/projects/` | Digital case studies and visual studies |
| `/projects/<slug>/` | Challenge, approach, decisions, outcomes, and project media |
| `/blogs/` | Field notes on visual systems and design decisions |
| `/blogs/<slug>/` | Individual notes |

## Design system

`DESIGN.md` documents the active system. Cool drafting paper, deep blue-grey ink,
and a cobalt accent frame an image-led layout with asymmetric work previews. The
case studies explain the human challenge, the system built in response, and the
choices that shape the finished experience. Portfolio-wide project totals and
ornamental project numbering are intentionally omitted.

## Stack

- Static HTML, CSS, and JavaScript
- `build_site.mjs` generates the pages from the project records
- `site.css` and `site.js` implement the portfolio’s design and interactions
- `engine/scrollcraft.css` and `engine/scrollcraft.js` are used unmodified

## Rebuild

```bash
node build_site.mjs
```

## Preview locally

```bash
node dev-server.mjs
```

The development server defaults to `http://localhost:4321/`.
