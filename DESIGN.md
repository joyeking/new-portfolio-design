# Portfolio visual system

`build_site.mjs` generates the pages, `site.css` defines the visual system, and
`engine/scrollcraft.css` plus `engine/scrollcraft.js` remain unmodified.

## Design read

A designer’s portfolio for prospective clients and collaborators. The pages should
show the artifact, then make the problem and reasoning behind it easy to follow.
The interface uses the visual grammar of working diagrams: structured, precise,
and composed around the task rather than a generic project-card template.

- Variance: 7 — deliberately staggered image layouts, with a consistent grid.
- Motion: 3 — restrained reveals and useful interaction feedback.
- Density: 3 — spacious case-study reading with concise metadata.

## Visual language

- **Canvas:** warm greige `#e7e5df`; dark alternative `#181714`.
- **Ink:** charcoal `#151412`; muted `#63615a`.
- **Accent:** clay `#9d4227` on light and warm clay `#d98a63` on dark. It marks
  emphasis, focus, and active states.
- **Type:** Anton for display, Newsreader for reading, Manrope for controls, and DM Mono
  for compact metadata. Headings are condensed and uppercase; italic Newsreader
  supplies the counter-voice.
- **Geometry:** square image and content edges, hairline dividers, and a broad
  editorial grid. No ornamental project numbers or default card shadows.
- **Imagery:** project work supplies colour and texture. Crop according to each
  image’s composition, and vary image spans to give the page a natural rhythm.

## Page structure

- **Home:** a problem-led statement paired with a portrait; a short working method;
  selected work; client comments; practical next steps.
- **Work index:** case studies and visual studies with a direct problem statement.
- **Digital case studies:** challenge and project image; brief and shipped response;
  approach; design decisions; outcome; gallery and live build where available.
- **Visual studies:** challenge and design response, followed by the artifact.
- **About and field notes:** the same visual language, paced for reading.

## Content rules

- Do not show portfolio-wide project totals or decorative project indices.
- Explain what was difficult for the visitor or client before describing the visual
  treatment.
- Connect layout, type, navigation, and interaction choices to that problem.
- Preserve verifiable scope details, timelines, interface counts, testimonials, and
  outcomes where they explain the work. Do not invent business performance claims.

## Accessibility and motion

Keep keyboard focus visible, contrast readable in both themes, images meaningfully
labeled, and every layout responsive. Respect reduced-motion preferences. Motion
supports transitions and feedback; it does not loop for decoration.

## Rebuild and engine boundary

```bash
node build_site.mjs
```

Do not edit files in `engine/`; the portfolio consumes the scroll-craft engine as
provided.
