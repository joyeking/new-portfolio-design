// Rebuild the portfolio from the real Framer site content + images (assets/site/).
//
// Craft model: every flagship case study is told as
//   the brief -> what shipped -> design decisions -> the result -> client note -> live site.
// Run: node build_site.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const A = 'assets/site';
// Work imagery re-cut from the source exports (paper files) and generated art — see IMAGES.md.
const W = 'assets/work';
// Canonical origin for OG/canonical tags.
const SITE = 'https://joyeking.github.io/new-portfolio-design';
// Site-wide OG image — the ETtravel cover from the work set.
const OG_IMAGE = 'assets/work/et-cover.jpg';

// One icon set for the whole site: 24px box, 1.5px stroke, round caps, currentColor, no fills.
// Defined once here and mounted into every page's <body> (DESIGN.md §5).
const SPRITE = `<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
<symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M4.5 12h15"/><path d="M13 5.5l6.5 6.5-6.5 6.5"/></symbol>
<symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/></symbol>
<symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m6 9.5 6 6 6-6"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 8h16"/><path d="M4 16h16"/></symbol>
<symbol id="i-up" viewBox="0 0 24 24"><path d="M12 19.5V4.5"/><path d="M5.5 11 12 4.5 18.5 11"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 8 8 5.5L20 8"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M7 3.5h3l1.6 4-2 1.3a11.5 11.5 0 0 0 5.6 5.6l1.3-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5 5.7 2 2 0 0 1 7 3.5z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 13 4.5 4.5L19 7"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></symbol>
<symbol id="i-layers" viewBox="0 0 24 24"><path d="m12 3.5 8.5 4.7-8.5 4.7-8.5-4.7L12 3.5z"/><path d="m3.5 13 8.5 4.7 8.5-4.7"/></symbol>
<symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/></symbol>
<symbol id="i-quote" viewBox="0 0 24 24"><path d="M7.5 7.5H11v3.5a4 4 0 0 1-4 4"/><path d="M15 7.5h3.5v3.5a4 4 0 0 1-4 4"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.953-7.981zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"/></symbol>
<symbol id="i-instagram" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1 0 2.881 1.44 1.44 0 0 1 0-2.881z"/></symbol>
<symbol id="i-framer" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M4 0h16v8h-8V0zm0 8h8l8 8H4V8zm0 8h8v8l-8-8z"/></symbol>
<symbol id="i-github" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></symbol>
</svg>`;
// Client marks for the trusted-by wall (v13). Same box and stroke rules as the
// icon sprite — they are decorative, always set beside the client's name.
const MARKS = `<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
<symbol id="m-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5"/></symbol>
<symbol id="m-half" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" stroke="none"/></symbol>
<symbol id="m-square" viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="15" height="15" rx="3"/></symbol>
<symbol id="m-triangle" viewBox="0 0 24 24"><path d="M12 4.5 20 19.5H4z"/></symbol>
<symbol id="m-ring" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.75"/></symbol>
<symbol id="m-bars" viewBox="0 0 24 24"><path d="M4.5 8.5h15"/><path d="M4.5 15.5h9.5"/></symbol>
<symbol id="m-diamond" viewBox="0 0 24 24"><path d="M12 4 20 12l-8 8-8-8z"/></symbol>
<symbol id="m-arc" viewBox="0 0 24 24"><path d="M4.5 18.5a7.5 7.5 0 0 1 15 0"/><path d="M8.5 18.5a3.5 3.5 0 0 1 7 0"/></symbol>
<symbol id="m-page" viewBox="0 0 24 24"><path d="M12 6.5c-1.8-1.4-4-2-6.5-2H4v13h1.5c2.5 0 4.7.6 6.5 2 1.8-1.4 4-2 6.5-2H20v-13h-1.5c-2.5 0-4.7.6-6.5 2z"/><path d="M12 6.5v13"/></symbol>
</svg>`;

const ic = (name, cls = 'ic') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
// Decorative client mark — always paired with the client's name as real text.
const mk = (name) => `<svg class="mk" aria-hidden="true" focusable="false"><use href="#${name}"/></svg>`;


const PROJECTS = [
  {
    slug: 'https-ettravel-framer-website', cat: 'Web Design', title: 'ETtravel Travel Agency',
    kind: 'Travel platform · Framer',
    problem_line: 'Travelers had to picture Ethiopia, compare regions, and start planning without getting lost in dense destination information.',
    desc: 'ETtravel needed one place to inspire visitors, help them compare destinations, and turn interest into a real itinerary with the agency team.',
    year: '2025', industry: 'Travel & Tourism', client: 'ETtravel', duration: '8 weeks',
    visit: 'https://ettravel.framer.website/', domain: 'ettravel.framer.website',
    pages: '6 pages + blog', stack: 'A place-led browsing system that turns discovery into an itinerary conversation.',
    cover: `${W}/et-cover.jpg`,
    gallery: [`${W}/et-1.jpg`, `${W}/et-2.jpg`, `${W}/et-3.jpg`, `${W}/et-4.jpg`, `${W}/et-5.jpg`],
    brief: '“More than a booking site — show the beauty of Ethiopia to global visitors, and let travelers plan real itineraries together with the agency’s staff.”',
    shipped: 'A six-page Framer site: a photography-led home, Explore and Destinations pages, a regional blog system, and itinerary booking handled with agency employees — all fully responsive.',
    approach: 'The work began by separating two visitor jobs: imagine a trip, then plan one. Destination stories lead with photography and concise context; regional navigation gives the growing catalogue a shape; itinerary requests bring the agency into the final planning step. That sequence keeps exploration open while making the next action clear.',
    challenges: ['Balancing aesthetic storytelling with functional booking tools.',
      'Keeping the site fast despite high-resolution destination photography.',
      'Designing a structure that could absorb blogs and itinerary planning without redesign.'],
    decisions: [
      ['Let the place lead', 'Large destination images set the emotional context before practical details arrive, so visitors can picture the trip they are weighing.'],
      ['Give the catalogue a map', 'Grouping destinations by region gives travelers a useful first choice, then lets each place carry its own detail instead of competing in one long list.'],
      ['Keep proof beside the decision', 'Partner references and destination detail support the booking invitation, giving visitors context before they contact the agency.'],
      ['Make planning collaborative', 'The request path connects visitors with agency staff, who can turn an early idea into a practical itinerary.'],
    ],
    results: [['8', 'weeks from brief to launch'], ['6', 'pages plus a regional blog system'], ['6', 'destination regions structured'], ['100%', 'responsive, built in Framer']],
    outcome: 'The final site balances storytelling and function: visitors explore Ethiopia visually, learn the destinations, and book through the agency — a digital home with room to grow its content library.',
    testimonial: ['Sarah Yared', 'Owner, ETtravel',
      'His design transformed my travel agency business. He converted my ideas into a high-performing, visually striking website.'],
  },
  {
    slug: 'https-foolish-checkbox-044906-framer-app', cat: 'UI / UX Design', title: 'John’s Photography Portfolio',
    kind: 'Photography portfolio · Framer',
    problem_line: 'The portfolio needed to show photography and digital craft together while keeping the photographs in charge.',
    desc: 'What feels unclear right now called for a portfolio where photography could stand on its own and the interface still revealed the maker’s eye for digital design.',
    year: '2025', industry: 'Photography', client: 'VisualForms Studio', duration: '3 weeks',
    visit: 'https://foolish-checkbox-044906.framer.app/', domain: 'foolish-checkbox-044906.framer.app',
    pages: '5 pages', stack: 'A gallery-like structure that gives each body of work its own pace.',
    cover: `${W}/photo-cover.jpg`,
    gallery: [`${W}/photo-1.jpg`, `${W}/photo-2.jpg`, `${W}/photo-3.jpg`, `${W}/photo-4.jpg`, `${W}/photo-5.jpg`],
    brief: '“One portfolio that shows both the photographs and the design sense — the images must lead, but the site has to feel designed.”',
    shipped: 'A five-page dark portfolio: pixel-serif identity, album chapters by discipline (branding, communication, travel, events), a bilingual Amharic editorial post, and a single-field enquiry on the contact page.',
    approach: 'The central tension was visibility: the images had to dominate, but the interface still needed a recognizable point of view. A restrained dark canvas protects image contrast; albums group work by discipline; a pixel-serif identity adds authorship without turning every page into another showcase.',
    challenges: ['Giving photography and web design equal billing without visual noise.',
      'Keeping the viewer’s attention on the images, not the interface.',
      'Balancing minimalism with enough personality to be memorable.'],
    decisions: [
      ['Treat images like the content', 'A dark, low-noise surface protects the photographs’ tonal range and lets a visitor stay with each image.'],
      ['Make the identity carry authorship', 'A pixel-serif wordmark adds a personal signature, while its limited use keeps the photographs as the loudest element.'],
      ['Curate by discipline', 'Albums give visitors clear entry points and make each collection read as an intentional body of work rather than an endless feed.'],
      ['Keep contact lightweight', 'A single-field enquiry lowers the barrier after someone has spent time with the work.'],
    ],
    results: [['3', 'weeks from brief to launch'], ['5', 'pages, gallery and album system'], ['2', 'languages — English and Amharic'], ['100%', 'responsive, built in Framer']],
    outcome: 'The final portfolio communicates both a creative eye and technical skill in one experience — a gallery that is contemporary, engaging, and unmistakably his.',
    testimonial: ['Anteneh Demese', 'Marketing Director',
      'Johnny redesigned a few of our pages. The results were beyond expectation. He understood my vision and turned it into impactful designs.'],
  },
  {
    slug: 'https-joyinterior-framer-website', cat: 'Web Design', title: 'JoyInterior',
    kind: 'Interior design studio · Framer',
    problem_line: 'Interior projects and furniture shared one brand, but visitors needed a clear way to tell the services and products apart.',
    desc: 'JoyInterior needed its spaces and furniture to feel part of one considered practice without forcing visitors through the same browsing path.',
    year: '2025', industry: 'Interior Design', client: 'JoyInterior', duration: '5 weeks',
    visit: 'https://joyinterior.framer.website/', domain: 'joyinterior.framer.website',
    pages: '4 pages', stack: 'Two browsing paths under one visual language: completed spaces and furniture.',
    cover: `${W}/interior-cover.jpg`,
    gallery: [`${W}/interior-1.jpg`, `${W}/interior-2.jpg`, `${W}/interior-3.jpg`, `${W}/interior-4.jpg`],
    brief: '“A sleek site for high-end interior design and custom furniture — it should feel as considered as the rooms themselves.”',
    shipped: 'A site that separates completed spaces from furniture, explains the studio’s services in plain language, and pairs consultation with answers to common questions.',
    approach: 'The structure separates the two ways clients arrive: some want to see finished rooms, others want to browse furniture. Distinct paths make that intent legible, while shared typography, spacing, and photography keep the studio’s identity coherent. The consultation step follows the relevant work, so enquiry feels like a continuation of browsing.',
    challenges: ['Serving two business focuses — interior design and furniture — without overwhelming visitors.',
      'Designing a structure that feels luxurious yet minimal, true to the brand.',
      'Creating a gallery format that is interactive but easy to navigate.'],
    decisions: [
      ['Let material do the work', 'A quiet interface leaves wood, fabric, light, and spatial detail to communicate the quality of the work.'],
      ['Separate the visitor intents', 'Completed spaces and furniture receive their own destinations, helping each visitor reach relevant work without splitting the brand.'],
      ['Make the offer easy to compare', 'Plain-language service descriptions let visitors understand the scope before they reach the consultation form.'],
      ['Answer questions at the point of enquiry', 'The FAQ sits beside the consultation path, giving visitors practical reassurance when they are deciding whether to get in touch.'],
    ],
    results: [['5', 'weeks from brief to launch'], ['4', 'pages, portfolio + storefront'], ['4', 'services structured for enquiry'], ['100%', 'responsive, built in Framer']],
    outcome: 'A polished portfolio that makes the work and materials the central story — sophistication communicated through clarity rather than decoration.',
    testimonial: ['Liya Woldu', 'Product Manager',
      'He took the time to understand our goals and delivered a design that resonated perfectly with our audience.'],
  },
  {
    slug: 'https-gwarinparealestate-framer-website', cat: 'Web Design', title: 'Gwarinpa Real Estate',
    kind: 'Real estate platform · Framer',
    problem_line: 'Property imagery set a premium tone, but buyers still needed fast access to development facts, unit options, and a clear enquiry path.',
    desc: 'The site had to make several developments feel desirable while helping buyers compare what was available and request a conversation.',
    year: '2025', industry: 'Real Estate', client: 'Gwarinpa Real Estate', duration: '8 weeks',
    visit: 'https://gwarinparealestate.framer.website/', domain: 'gwarinparealestate.framer.website',
    pages: '5 pages', stack: 'A property discovery flow that pairs development context with practical comparison.',
    cover: `${W}/estate-cover.jpg`,
    gallery: [`${W}/estate-1.jpg`, `${W}/estate-2.jpg`, `${W}/estate-3.jpg`],
    brief: '“Showcase luxury properties with elegance — but keep property information quick to reach and easy to understand.”',
    shipped: 'A five-page platform: a numbers-first home, listings that open with the development’s design concept, a project index (Green Heights, Maplewood Villas, Palm Residences, Harbor View Tower), about, and a direct get-a-quote flow.',
    approach: 'The layout pairs the atmosphere of each development with information buyers need to evaluate it. Development stories and renders establish context; unit details and verified figures make comparison possible; the quote path stays direct for a high-consideration decision. The visual treatment earns attention, while the information structure helps visitors act on it.',
    challenges: ['Balancing a luxury visual experience with quick, understandable access to property information.',
      'Presenting developments and individual units without burying either.',
      'Keeping enquiry effort low for a high-consideration purchase.'],
    decisions: [
      ['Use a distinct property language', 'Deep navy and restrained metallic details signal permanence, while large images establish the character of each development.'],
      ['Put verifiable facts near the promise', 'Development and unit information appears early, so buyers can test the brand story against concrete details while they browse.'],
      ['Explain the place before the unit', 'A development story and render give buyers context before they compare apartment layouts.'],
      ['Keep the first conversation direct', 'A focused quote form asks for enough to begin a useful conversation without making buyers complete a long process.'],
    ],
    results: [['8', 'weeks from brief to launch'], ['5', 'pages across home to quote'], ['163', 'apartment units presented'], ['100%', 'responsive, built in Framer']],
    outcome: 'A more premium property presentation that stays usable across devices — elegance that helps buyers decide, not just admire.',
    testimonial: ['James Igbo', 'Gwarinpa Real Estate',
      'The website is easy to use and made it simple to showcase our buildings and information.'],
  },
  {
    slug: 'museum-of-art-in-addis', cat: 'Web Design', title: 'Museum of Art in Addis',
    kind: 'Arts institution · Framer',
    problem_line: 'The museum needed a first online home for its artists, exhibitions, story, and visits that felt like an extension of the gallery.',
    desc: 'EYETA needed to introduce its collection and visiting experience online while leaving room for the institution’s story to grow.',
    year: '2025', industry: 'Art & Culture', client: 'Art in Addis (EYETA)', duration: '6 weeks',
    visit: 'https://glad-building-777797.framer.app/', domain: 'glad-building-777797.framer.app',
    pages: '4 pages', stack: 'A digital gallery where art, artists, and visits share one calm route.',
    cover: `${W}/museum-cover.jpg`,
    gallery: [`${W}/museum-1.jpg`, `${W}/museum-2.jpg`, `${W}/museum-3.jpg`, `${W}/museum-4.jpg`],
    brief: '“Introduce the museum and its artists online — a first presence that feels like the institution and can grow with it.”',
    shipped: 'A four-page site: an art-led home, a split-screen menu pairing a painting with the artist index (Artist / Art Work / Exhibitions tabs), an about page with the institution’s story, and a book-a-tour reservation flow.',
    approach: 'The experience borrows its hierarchy from a visit: encounter the work, explore artists and exhibitions, understand the institution, then plan a tour. A quiet dark interface keeps attention on the artwork; a split catalogue and focused reservation flow make the collection and visit easy to navigate.',
    challenges: ['Introducing an institution with no existing digital footprint.',
      'Presenting a dense artist catalogue without flattening it into a grid.',
      'Keeping the reservation step feeling cultural rather than transactional.'],
    decisions: [
      ['Give the collection visual authority', 'A dark, quiet surface lets the colour and texture of Ethiopian modernist work shape the experience.'],
      ['Browse beside the work', 'The artist index shares the screen with a painting, keeping the collection present while visitors move through it.'],
      ['Offer distinct ways into one collection', 'Artist, artwork, and exhibition views match how visitors look for cultural work while keeping the collection connected.'],
      ['Make a visit feel like part of the story', 'The tour invitation sits alongside artwork and a welcome, so planning a visit feels connected to the gallery rather than detached from it.'],
    ],
    results: [['6', 'weeks from brief to launch'], ['4', 'pages, home to reservation'], ['3', 'ways into the collection'], ['100%', 'responsive, built in Framer']],
    outcome: 'A professional first impression with a durable foundation — a digital presence the institution can extend into a richer ecosystem.',
    testimonial: null,
    phoneHead: 'The visit starts in the hand.',
    phoneNote: 'Welcome, sign-up, log-in, home, and the artist index — the same catalogue order as the site, set for one thumb.',
    phoneShots: [['Welcome', `${W}/museum-phone-1.jpg`], ['Sign up', `${W}/museum-phone-2.jpg`], ['Visit', `${W}/museum-phone-3.jpg`], ['Log in', `${W}/museum-phone-4.jpg`], ['Menu', `${W}/museum-phone-5.jpg`], ['Home', `${W}/museum-phone-6.jpg`], ['Explore', `${W}/museum-phone-7.jpg`], ['Artists', `${W}/museum-phone-8.jpg`]],
  },
  {
    slug: 'readbible-reading-app', cat: 'UI / UX Design', title: 'ReadBible',
    kind: 'Reading app · iPhone, desktop &amp; web',
    problem_line: 'Reading, study, saved passages, and prayer needed to live together without turning the scripture view into a crowded dashboard.',
    desc: 'ReadBible brings reading, plans, saved passages, notes, prayer, and study tools into one system for phone, desktop, and browser.',
    year: '2026', industry: 'Faith & spirituality', client: 'ReadBible', duration: 'Ongoing',
    pages: 'Web · desktop · iPhone', stack: 'A reading-centred system that adapts its tools to phone, desktop, and browser.',
    cover: `${W}/readbible-main.jpg`,
    gallery: [`${W}/bible-1.jpg`, `${W}/bible-3.jpg`, `${W}/bible-desktop.jpg`],
    brief: 'A Bible reader that had to feel like a quiet place in the word — not a database with verses inside it. Reading, plans, saved passages and prayer designed as one calm habit, on every device the reader owns.',
    shipped: 'A reading app on three surfaces — a web reader, a desktop app and an iPhone app — with the verse of the day, reading plans, a Bible reader, bookmarks, highlights, notes, a prayer list, study tools and settings, in light and dark themes, plus a reading streak.',
    approach: 'Reading is the anchor, and each supporting tool is placed according to how it is used. On a phone, the day’s reading and thumb-ready navigation come first. On desktop, a persistent sidebar keeps study tools close without narrowing the text. Saved passages and notes reconnect to the reader, so the app supports a routine instead of fragmenting it.',
    challenges: ['Keeping study tools close without letting them crowd the reading view.',
      'One system across three postures — a phone in one hand, a desktop window, a browser tab.',
      'Making saved scripture scannable once highlights and bookmarks run into the hundreds.'],
    decisions: [
      ['Start with today’s reading', 'The phone opens on the verse of the day, with the core destinations reachable by thumb so the reader can begin without navigating a menu.'],
      ['Give study its own space', 'The Bible Blueprint has a dedicated surface for exploring scripture, with passages and notes linked back to the reading view.'],
      ['Make saved passages retrievable', 'Bookmarks and highlights share one saved view, and desktop readers can open a passage alongside the current text.'],
      ['Keep the reading surface calm', 'A light theme and dark alternative support longer sessions while preserving the same hierarchy across both.'],
    ],
    results: [['3', 'platforms — web, desktop and phone'], ['5', 'tabs in the phone app'], ['9', 'sections in the desktop sidebar'], ['5', 'movements in the Bible Blueprint']],
    outcome: 'A reading habit with a home on every device — the same app on the phone at night, the desktop in the morning, and the web wherever a browser is open.',
    testimonial: null,
    shots: [['Home · light', `${W}/bible-app-1.jpg`, '390px'], ['Reader · light', `${W}/bible-app-2.jpg`, '390px'], ['Library · light', `${W}/bible-app-3.jpg`, '390px'], ['Saved · dark', `${W}/bible-app-4.jpg`, '390px'], ['Plan · dark', `${W}/bible-app-5.jpg`, '390px']],
    shotsHead: 'App UI/UX Design',
    shotsNote: 'A quiet reading system in both themes: the day’s passage stays central, with saved scripture, the library, and plans within thumb reach.',
  },
];

// brand & editorial archive entries (no live site — captured designs)
const ARCHIVE = [
  { slug: 'afri-buna-packed-coffee', cat: 'Branding', title: 'Afri Buna Coffee Packaging',
    kind: 'Brand & packaging', year: '2024', tag: 'Brand · Package',
    problem_line: 'Create a recognizable coffee identity that holds together from a quick shelf read to the packaging details.',
    desc: 'A clear wordmark, warm coffee cues, and an ingredient hierarchy give the pack a consistent voice while keeping product details easy to find.',
    image: `${W}/afribuna-cover.jpg`, pages: 'Identity · pack · guidelines', duration: '4 weeks' },
  { slug: 'dream-faith-journey-book', cat: 'Graphic Design', title: 'Dream, Faith, Journey',
    kind: 'Editorial · cover series', year: '2024', tag: 'Editorial · Cover',
    problem_line: 'Give an abstract story a visual language that feels both hopeful and grounded.',
    desc: 'A restrained cover system pairs symbolic forms with a confident type hierarchy, making the themes of belief and change visible without illustrating them literally.',
    image: `${W}/dreambook-cover.jpg`, pages: '3 covers · system', duration: '6 weeks' },

  // poster & app work — portrait artwork, shown whole (figure: poster / phone)
  { slug: 'habesha-beer-poster', cat: 'Graphic Design', title: 'Habesha Beer — Rooftop Night',
    kind: 'Poster · Campaign', year: '2026', tag: 'Poster · Event', figure: 'poster',
    problem_line: 'Make event, venue, and brand legible at a glance in a crowded social feed.',
    desc: 'Oversized yellow lettering anchors the composition against an Addis rooftop at night; Amharic brand details and the date sit in supporting positions.',
    image: `${W}/poster-habesha.jpg` },
  { slug: 'ethiopian-great-run-poster', cat: 'Graphic Design', title: 'Ethiopian Great Run',
    kind: 'Poster · Event', year: '2025', tag: 'Poster · Event', figure: 'poster',
    problem_line: 'Carry an event invitation from a street poster to a phone screen without losing its message.',
    desc: 'A runner in motion and the line “For a Brighter Tomorrow” create one clear visual anchor, with date and supporting information kept secondary.',
    image: `${W}/poster-greatrun.jpg` },
  { slug: 'buna-tetu-poster', cat: 'Graphic Design', title: 'Buna Tetu — Coffee Ceremony',
    kind: 'Poster · Brand', tag: 'Poster · Culture', figure: 'poster',
    problem_line: 'Invite people to a coffee ceremony by showing its character, not by relying on generic event graphics.',
    desc: 'The jebena pour becomes the central image; Amharic lettering and a direct invitation keep the composition rooted in the ceremony.',
    image: `${W}/poster-bunatetu.jpg` },
  { slug: 'clash-football-poster', cat: 'Graphic Design', title: 'CLASH — Football Tournament',
    kind: 'Poster · Event', year: '2025', tag: 'Poster · Sports', figure: 'poster',
    problem_line: 'Help a football tournament announcement survive a fast-moving feed and make the date easy to catch.',
    desc: 'The tournament name is set over match action, with the event date held in a consistent corner position for a fast scan.',
    image: `${W}/poster-clash.jpg` },
  { slug: 'enkutatash-new-year-poster', cat: 'Graphic Design', title: 'Enkutatash — A Table of Tradition',
    kind: 'Poster · Culture', year: '2019', tag: 'Poster · Culture', figure: 'poster',
    problem_line: 'Represent Ethiopian New Year through a lived cultural scene rather than a familiar national symbol.',
    desc: 'A shared mesob table and seasonal daisies make gathering the focus, while the date sits clearly within the composition.',
    image: `${W}/poster-enkutatash.jpg` },
  { slug: 'focus-editorial-poster', cat: 'Graphic Design', title: 'FOCUS — Editorial Portrait',
    kind: 'Poster · Editorial', tag: 'Poster · Personal', figure: 'poster',
    problem_line: 'Make a personal statement feel specific without burying it in copy.',
    desc: 'A portrait, oversized “FOCUS” lettering, and two short marginal phrases create a direct visual hierarchy around the idea.',
    image: `${W}/poster-focus.jpg` },
  { slug: 'limitless-finance-app', cat: 'UI / UX Design', title: 'Limitless — Finance App',
    kind: 'Product · Mobile app', tag: 'App · Fintech', figure: 'phone',
    problem_line: 'Make the everyday money actions visible before they disappear inside account menus.',
    desc: 'A balance-led home screen brings Send and Request forward, while Home, Payments, and Wallet keep the main destinations easy to reach.',
    image: `${W}/limitless-3.jpg`,
    shots: [['Splash', `${W}/limitless-1.jpg`, '390px'], ['Onboarding', `${W}/limitless-2.jpg`, '390px'], ['Home', `${W}/limitless-3.jpg`, '390px'], ['Payments', `${W}/limitless-4.jpg`, '390px'], ['Wallet', `${W}/limitless-5.jpg`, '390px']],
    shotsHead: 'A focused payment flow.', shotsNote: 'Follow the transition from first-use onboarding to a clear balance, payment actions, and wallet details.' },
];

const rel = (depth, path) => '../'.repeat(depth) + path;
const socialProfiles = [
  { label: 'X / Twitter', icon: 'x', href: null },
  { label: 'Instagram', icon: 'instagram', href: null },
  { label: 'Framer', icon: 'framer', href: null },
  { label: 'GitHub', icon: 'github', href: 'https://github.com/joyeking' },
];
const socialLinks = () => socialProfiles.map(({ label, href }) => href
  ? `<a href="${href}" target="_blank" rel="me noopener noreferrer">${label}<span aria-hidden="true">${ic('arrow-up-right')}</span></a>`
  : `<span class="social-placeholder" aria-disabled="true">${label}<small>Link coming soon</small></span>`).join('');
// The same four profiles as brand logos — the About contact strip (§ logo row).
const socialLogos = () => socialProfiles.map(({ label, icon, href }) => href
  ? `<a class="logo-chip" href="${href}" target="_blank" rel="me noopener noreferrer" aria-label="${label} — opens in a new tab">${ic(icon)}<span>${label}</span></a>`
  : `<span class="logo-chip is-pending" aria-disabled="true" title="Link coming soon">${ic(icon)}<span>${label}</span></span>`).join('');

const NAV_ITEMS = [['home', 'Home', 'index.html'], ['about', 'About', 'about/index.html'], ['projects', 'Projects', 'projects/index.html'], ['blogs', 'Blogs', 'blogs/index.html']];
const navLinks = (depth, active) => NAV_ITEMS.map(([key, label, href]) =>
  `<a data-route href="${rel(depth, href)}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('');

function doc(title, depth, body, desc = 'Yohannes Assefa — Digital Designer', active = '', path = '', image = OG_IMAGE) {
  // v13 chrome: the reference floats its header — a mark top-left, one MENU pill
  // top-right, no bar. The panel carries every link, including Contact, and keeps
  // aria-current so the active page is still visible (see DESIGN.md §11).
  const nav = `<a class="skip" href="#main">Skip to content</a><div data-sc-progress aria-hidden="true"></div><button class="mode-switch" type="button" data-mode-switch aria-label="Switch between dark and light mode" aria-pressed="false"><span class="ms-opt ms-dark">&#9789;</span><span class="ms-track"><span class="ms-knob"></span></span><span class="ms-opt ms-light">&#9728;</span></button><div class="cursor"></div><div class="noise" aria-hidden="true"></div>${SPRITE}${MARKS}<header class="site-nav" data-nav><a data-route class="brand" href="${rel(depth, 'index.html')}"><i></i>Yohannes Assefa</a><button class="menu-btn" type="button" data-menu-btn aria-expanded="false" aria-controls="site-menu" aria-label="Open menu"><span class="menu-label">Menu</span>${ic('menu')}</button><nav class="nav-links" id="site-menu" aria-label="Primary">${navLinks(depth, active)}<a href="#contact">Contact</a></nav></header>`;
  const motionScripts = active === 'home' ? '<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>' : '';
  const foot = `<footer class="footer"><div class="wrap"><div><span class="footer-brand">Yohannes Assefa — digital designer &amp; Framer developer</span><span>Addis Ababa, Ethiopia · © 2026</span></div><nav class="footer-links" aria-label="Contact"><a href="mailto:yohannesassefa17@gmail.com">yohannesassefa17@gmail.com</a><a href="tel:+251921244796">+251 92 124 4796</a><a class="to-top" href="#main">${ic('up')}Back to top</a></nav></div></footer>${motionScripts}<script src="${rel(depth, 'engine/scrollcraft.js')}"></script><script src="${rel(depth, 'site.js')}"></script>`;
  const canonical = `${SITE}/${path}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${title}</title><meta name="description" content="${desc}"><meta name="theme-color" content="#f3f1ea"><script>(function(){var k="portfolio-theme",s;try{s=localStorage.getItem(k)||localStorage.getItem("theme")}catch(e){}var t=s==="dark"||s==="light"?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="dark"?"#101114":"#f3f1ea"})();</script><link rel="icon" href="${rel(depth, 'assets/site/PIox6BmuKN0gwD010F1NhwXvEIE.png')}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&display=swap"><link rel="canonical" href="${canonical}"><meta name="author" content="Yohannes Assefa"><meta property="og:type" content="website"><meta property="og:site_name" content="Yohannes Assefa Portfolio"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE}/${image}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="${rel(depth, 'engine/scrollcraft.css')}"><link rel="stylesheet" href="${rel(depth, 'site.css')}"></head><body>${nav}<main id="main" tabindex="-1">${body}</main>${foot}</body></html>`;
}

const contact = (heading = 'Start with the thing that feels stuck.') => `<section class="contact-band" id="contact"><div class="wrap contact-grid"><div><h2 class="section-heading">${heading}</h2><p class="section-copy">Tell me who the experience is for, what is getting in their way, and what needs to become easier. I’ll reply within one working day with a useful next step and a written scope before work begins.</p><ul class="contact-list"><li><a href="mailto:yohannesassefa17@gmail.com">${ic('mail')}yohannesassefa17@gmail.com</a></li><li><a href="tel:+251921244796">${ic('phone')}+251 92 124 4796</a></li><li><span>${ic('pin')}Addis Ababa, Ethiopia · GMT+3</span></li></ul><nav class="contact-socials" aria-label="Social profiles">${socialLinks()}</nav></div><form class="form" data-demo-form><div class="field"><label for="cf-name">Your name</label><input id="cf-name" name="name" required autocomplete="name" placeholder="Jane Bekele"></div><div class="field"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" required autocomplete="email" placeholder="jane@company.com"></div><div class="field"><label for="cf-service">What do you need</label><select id="cf-service" name="service"><option>Website design &amp; build</option><option>UI / UX design</option><option>Brand &amp; identity</option><option>Graphic design</option></select></div><div class="field"><label for="cf-brief">What feels unclear right now</label><textarea id="cf-brief" name="brief" placeholder="What are you building, and what does success look like?"></textarea></div><button class="submit" type="submit">Send a note <span class="orb">${ic('arrow-right')}</span></button><p class="form-status" role="status" aria-live="polite" data-form-status></p></form></div></section>`;

// Compact contact strip for the About page: the footer's details plus the four brand logos.
const contactStrip = () => `<section class="contact-strip"><div class="wrap contact-strip-grid"><div class="contact-strip-lead"><p class="kicker">Contact details</p><h2>Or reach me directly.</h2></div><ul class="contact-strip-list"><li><a href="mailto:yohannesassefa17@gmail.com">${ic('mail')}yohannesassefa17@gmail.com</a></li><li><a href="tel:+251921244796">${ic('phone')}+251 92 124 4796</a></li><li><span>${ic('pin')}Addis Ababa, Ethiopia · GMT+3</span></li></ul><nav class="contact-strip-logos" aria-label="Social profiles">${socialLogos()}</nav></div></section>`;

function livePreview(p, depth) {
  const frame = `<div class="browser-frame" data-frame data-sc-in data-sc-spotlight>
<div class="frame-bar">
<span class="dots"><i></i><i></i><i></i></span>
<span class="frame-url">${p.domain}</span>
<a class="frame-open" href="${p.visit}" target="_blank" rel="noopener" aria-label="Open full site (opens in a new tab)">Open full site ${ic('arrow-up-right')}</a>
</div>
<div class="device-row" role="group" aria-label="Device size">
<button class="device is-active" data-w="100%" type="button" aria-pressed="true">Desktop</button>
<button class="device" data-w="768px" type="button" aria-pressed="false">Tablet</button>
<button class="device" data-w="390px" type="button" aria-pressed="false">Mobile</button>
</div>
<div class="frame-stage"><div class="frame-screen" style="width:100%">
<button class="frame-load" data-src="${p.visit}" data-title="${p.title}" type="button">
<img src="${rel(depth, p.cover)}" alt="${p.title} cover" loading="lazy">
<span>Load the live experience</span>
</button>
</div></div></div>`;
  return `<section class="section section-line" data-sc-act="flow"><div class="wrap">
${secHead('Live preview', 'Explore the real site.', 'Explore how the page structure, image hierarchy, navigation, and responsive decisions work together in the live build.')}
${frame}</div></section>`;
}

function staticScreens(p, depth) {
  // Per-entry shots when the entry supplies them (ReadBible desktop/phone);
  // otherwise the legacy presentation mockups keyed off the slug.
  const shots = p.shots || (p.slug === 'afri-buna-packed-coffee'
    ? [['Desktop', `${W}/afribuna-desktop.jpg`, '100%'], ['Phone', `${W}/afribuna-phone.jpg`, '390px']]
    : [['Desktop', `${W}/dreambook-desktop.jpg`, '100%'], ['Phone', `${W}/dreambook-phone.jpg`, '390px']]);
  const buttons = shots.map(([label, src, w], i) =>
    `<button class="device${i === 0 ? ' is-active' : ''}" data-img="${rel(depth, src)}" data-w="${w}" type="button" aria-pressed="${i === 0}">${label}</button>`).join('');
  const frame = `<div class="browser-frame" data-sc-in data-sc-spotlight>
<div class="frame-bar">
<span class="dots"><i></i><i></i><i></i></span>
<span class="frame-url">${p.slug} — captured designs</span>
</div>
<div class="device-row showcase-toggle" role="group" aria-label="Device size">
${buttons}
</div>
<div class="frame-stage"><div class="frame-screen" style="width:min(${shots[0][2]}, 100%)">
<img class="showcase-img" src="${rel(depth, shots[0][1])}" alt="${p.title} — ${shots[0][0].toLowerCase()}" loading="lazy" style="width:100%;height:100%;object-fit:contain;object-position:top;display:block">
</div></div></div>`;
  const script = `<script>
document.querySelectorAll('.showcase-toggle .device').forEach(function(btn){
  btn.addEventListener('click',function(){
     document.querySelectorAll('.showcase-toggle .device').forEach(function(b){b.classList.toggle('is-active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});
    var img=document.querySelector('.showcase-img');
    img.src=btn.dataset.img;
    img.alt=img.alt.replace(/— .*$/,'— '+btn.textContent.trim().toLowerCase());
    var screen=img.closest('.frame-screen');
     screen.style.width='min('+btn.dataset.w+', 100%)';screen.style.maxWidth='100%';
  });
});
</script>`;
  return `<section class="section section-line" data-sc-act="flow"><div class="wrap">
${secHead(p.slug === 'readbible-reading-app' ? '' : 'Selected screens', p.shotsHead || 'Design across screens.', p.shotsNote || 'The same design system adapts to different screen sizes. Switch views to compare the layout and reading experience.')}
${frame}</div></section>${script}`;
}

// A wall of phone screens for projects that also shipped a phone design (EYETA).
function phoneShowcase(p, depth) {
  const screens = p.phoneShots.map(([label, src]) =>
    `<a class="app-uiux-screen" href="${rel(depth, src)}" target="_blank" rel="noopener" aria-label="Open ${p.title} — ${label} screen"><img src="${rel(depth, src)}" alt="${p.title} — ${label} screen" loading="lazy"><span>${label}</span></a>`).join('');
  return `<section class="section section-line app-uiux-section" data-sc-act="flow"><div class="wrap">
${secHead('App UI/UX Design', p.phoneHead || 'The same system in the hand.', p.phoneNote || 'The phone layouts follow the same order as the site: one clear route, with the collection close behind.')}
<div class="app-uiux-screens phone-wall">${screens}</div></div></section>`;
}

function caseStudySections(p) {
  const duo = `<div class="cs-duo" data-sc-in data-sc-stagger="90">
<article class="before"><span class="kicker">The brief</span><p>${p.brief}</p></article>
<article class="after"><span class="kicker">What shipped</span><p>${p.shipped}</p></article>
</div>`;
  const challenges = p.challenges.map(c => `<li data-sc-in>${c}</li>`).join('');
  const approach = `<div class="case-study" data-sc-in><h2>The system behind the screen.</h2><div><p>${p.approach}</p><p><b>The tensions to resolve</b></p><ul>${challenges}</ul></div></div>`;
  const decisions = p.decisions.map(([t, why]) =>
    `<article data-sc-in><div><h3>${t}</h3><p>${why}</p></div></article>`).join('');
  const decisionsHtml = `<div class="cs-decisions-wrap"><h2 class="section-heading" data-sc-in>Why the interface works this way.</h2><div class="cs-decisions" data-sc-in data-sc-stagger="90">${decisions}</div></div>`;
  const nums = p.results.map(([v, label]) => `<div data-sc-in><b${/^\d+$/.test(v) ? ` data-sc-count="0 ${v}"` : ''}>${v}</b><small>${label}</small></div>`).join('');
  const resultsHtml = `<div class="cs-results-wrap" data-sc-act="flow"><h2 class="section-heading" data-sc-in>What became easier.</h2><p class="section-copy" data-sc-in>${p.outcome}</p><div class="cs-results">${nums}</div></div>`;
  return duo + approach + decisionsHtml + resultsHtml;
}

function testimonialHtml(p) {
  if (!p.testimonial) return '';
  const [name, role, quote] = p.testimonial;
  return `<div class="cs-quote" data-sc-in><p>“${quote}”</p><b>${name}</b><small>${role}</small></div>`;
}

function detailPage(p, all) {
  const meta = '';
  const gallery = p.gallery || [p.cover];
  const images = gallery.map(x => `<img src="${rel(2, x)}" alt="${p.title} — project image" loading="lazy">`).join('');
  const i = all.indexOf(p);
  const nxt = all[(i + 1) % all.length];
  const prv = all[(i - 1 + all.length) % all.length];
  const hero = `<section class="project-detail-hero"><div class="wrap case-hero"><div class="case-hero-copy"><h1 data-sc-kinetic="words">${p.title}</h1><p class="cs-problem"><b>The challenge</b>${p.problem_line}</p></div><img class="detail-hero-image" src="${rel(2, p.cover)}" alt="${p.title} — opening view"><div class="detail-meta" data-sc-in><div><b>Client</b><span>${p.client}</span></div><div><b>Industry</b><span>${p.industry}</span></div><div><b>Type</b><span>${p.kind}</span></div><div><b>Year</b><span>${p.year}</span></div><div><b>Timeline</b><span>${p.duration}</span></div></div></div></section>`;
  const body = `${hero}
<section class="section case-body"><div class="wrap"><h2 class="section-heading" data-sc-in>From the first question to the finished system.</h2>${caseStudySections(p)}
<div class="gallery" data-sc-in data-sc-stagger="90">${images}</div></div></section>
${testimonialHtml(p)}
${p.visit ? livePreview(p, 2) : staticScreens(p, 2)}
${p.phoneShots ? phoneShowcase(p, 2) : ''}
<section class="section section-line"><div class="wrap"><p class="kicker">Keep exploring</p><div class="cs-next">
<a data-route class="cs-next-card" data-sc-in href="${rel(2, 'projects/' + prv.slug + '/index.html')}"><span class="kicker">Previous story</span><h3>${prv.title}</h3></a>
<a data-route class="cs-next-card" href="${rel(2, 'projects/' + nxt.slug + '/index.html')}"><span class="kicker">Next story →</span><h3>${nxt.title}</h3></a>
</div></div></section>${contact()}`;
  return doc(p.title + ' — Case Study · Yohannes Assefa', 2, body, p.problem_line, 'projects', 'projects/' + p.slug + '/', p.cover);
}

const indexCard = (p, depth) =>
  `<a data-route class="index-card" href="${rel(depth, 'projects/' + p.slug + '/index.html')}"><span class="ic-img"><img src="${rel(depth, p.cover)}" alt="${p.title} — cover" loading="lazy"></span><div class="body"><span class="tag">${p.cat}</span><h3>${p.title}</h3><p>${p.problem_line}</p><span class="go">Read the case ${ic('arrow-right')}</span></div></a>`;

// ---------------- HOME ----------------
// The reference proves its work with a bordered wall, not a marquee — so the one
// marquee is retired (DESIGN.md §11) in favour of these cells.
// The split header the reference repeats: display heading left, small note right.
const secHead = (_label, heading, note) => `<div class="sec-head" data-sc-in><h2 class="section-heading">${heading}</h2>${note ? `<p class="section-note">${note}</p>` : ''}</div>`;

const prismSlides = PROJECTS.map((p, i) =>
  `<a data-route class="prism-slide${i === 0 ? ' is-active' : ''}" data-prism-slide href="projects/${p.slug}/index.html" aria-label="Open ${p.title}">
    <figure class="prism-visual"><img src="${p.cover}" alt="${p.title} project design" loading="lazy"></figure>
    <span class="prism-copy"><span class="kind">${p.kind}</span><strong>${p.title}</strong><span class="prism-challenge"><b>The challenge</b>${p.problem_line}</span></span>
  </a>`).join('');
const prismProgress = PROJECTS.map((p, i) =>
  `<button type="button" class="prism-tick${i === 0 ? ' is-active' : ''}" data-prism-tick="${i}" aria-label="Show ${p.title}" aria-current="${i === 0}"><span></span></button>`).join('');
const home = `<section class="hero" data-sc-act="flow"><div class="wrap hero-grid"><div class="hero-copy"><h1 data-home-title><span>Make the</span><em>complex</em><span>clear.</span></h1><p class="hero-desc" data-home-copy>I help people understand what matters and what to do next. That starts with the problem behind the brief, then becomes a clear information system, a visual language, and an experience that works across screens.</p><div class="hero-actions"><a data-route class="button" href="projects/index.html">Explore the work <span class="orb">${ic('arrow-right')}</span></a><a class="button alt" href="#contact">Talk through a brief <span class="orb">${ic('arrow-right')}</span></a></div><p class="meta-row" data-home-meta><span class="dot-live">Available for new work</span><span>${ic('pin')}Addis Ababa, Ethiopia</span><span>${ic('clock')}Replies within a working day</span></p></div><div class="hero-media" data-home-portrait><img class="hero-portrait" src="assets/work/portrait-reference.jpg" alt="Yohannes Assefa" fetchpriority="high" decoding="async"><p class="portrait-cap">${ic('check')}Research · Structure · Interaction · Delivery</p></div><aside class="hero-stats" data-home-stats aria-label="Design principles"><span>Find what is getting in the way</span><span>Give information a useful order</span><span>Make the next action feel natural</span></aside></div></section>
<section class="section section-line friction-map"><div class="wrap"><div class="sec-head" data-sc-in><h2 class="section-heading">Clarity is a design outcome.</h2><p class="section-note">A better interface is not decoration added to a problem. It is a route through the problem, made visible.</p></div><div class="friction-list" data-sc-in><article><b>When information is dense</b><p>Group it around the questions people actually ask.</p></article><article><b>When choices compete</b><p>Show what matters first, then give each decision room.</p></article><article><b>When the next step is uncertain</b><p>Connect discovery to an action people can complete.</p></article></div></div></section>
<section class="section section-line"><div class="wrap process-stage"><div class="sec-head"><div><h2 class="section-heading">Design starts with people.</h2></div><p class="section-note">I listen to the client’s goals, learn what the audience needs, and find where the current experience falls short. That shared understanding guides the structure and visual decisions.</p></div><div class="steps"><article>${ic('search')}<h3>Understand the moment</h3><p>Who is here? What are they trying to do? Where does the current experience lose them?</p></article><article>${ic('layers')}<h3>Shape the route</h3><p>Give content, controls, and choices an order that matches the way people make sense of the task.</p></article><article>${ic('target')}<h3>Test the decisions</h3><p>Review real screens with real content, then refine the details that make the next step easier.</p></article></div></div></section>
<section class="section section-line"><div class="wrap statement"><h2 class="section-heading" data-sc-in>Structure makes room for feeling.</h2><div class="statement-body" data-sc-in data-sc-stagger="90"><p class="lede">My background in architecture changed how I see a screen. It is a place people move through: a sequence of attention, decisions, and small moments of confidence.</p><p class="about-copy">I bring that spatial thinking to digital products, websites, and visual identities — using the character of each subject to shape a system that feels coherent and works in practice.</p><p class="case-more"><a data-route class="button" href="about/index.html">How I work <span class="orb">${ic('arrow-right')}</span></a></p></div></div></section>
<section class="section section-line featured-prism" id="featured" data-sc-act="pin" data-sc-span="${Math.max(1.5, (PROJECTS.length - 1) * .55)}" data-carousel-pin><div data-sc-stage class="wrap prism-pin-stage">${secHead('Selected work', 'Design, with the problem in view.', 'Each story follows the challenge through the choices that shaped the finished experience.')}<div class="prism-carousel" data-prism-carousel><div class="prism-stage" data-prism-stage tabindex="0" role="region" aria-label="Featured projects. Scroll to move through the work, or use the controls.">${prismSlides}</div><div class="prism-navigation"><button type="button" class="prism-arrow" data-prism-prev aria-label="Previous project">${ic('arrow-left')}</button><div class="prism-progress" role="group" aria-label="Choose a featured project">${prismProgress}</div><button type="button" class="prism-arrow" data-prism-next aria-label="Next project">${ic('arrow-right')}</button></div><p class="sr-only" data-prism-status aria-live="polite"></p><a data-route class="text-link prism-all-work" href="projects/index.html">Browse all work ${ic('arrow-right')}</a></div></div></section>
<section class="section section-line"><div class="wrap">${secHead('In their words', 'Good work starts with listening.')}<div class="proof" data-sc-in data-sc-stagger="90"><blockquote>${ic('quote')}<p>“His design transformed my travel agency business. He converted my ideas into a high-performing, visually striking website.”</p><cite><b>Sarah Yared</b><small>Owner, ETtravel</small></cite></blockquote><blockquote>${ic('quote')}<p>“He took the time to understand our goals and delivered a design that resonated perfectly with our audience.”</p><cite><b>Liya Woldu</b><small>Product Manager, JoyInterior</small></cite></blockquote></div></div></section>
<section class="section section-line faq-section" data-sc-act="flow"><div class="wrap faq"><p class="kicker">Working together</p><h2 class="section-heading">A few practical things.</h2><details><summary>What can you help with?${ic('chevron-down')}</summary><p>Product and interface design, websites, visual identities, and graphic design — depending on what the problem calls for.</p></details><details><summary>Where does a project begin?${ic('chevron-down')}</summary><p>With a conversation about the audience, the current obstacle, and what needs to change. We agree on a useful scope before design begins.</p></details><details><summary>How do you know a direction is working?${ic('chevron-down')}</summary><p>We compare the screens to the original need: can people find the right information, understand their options, and move forward?</p></details><details><summary>How do I start a conversation?${ic('chevron-down')}</summary><p>Send a note about what you are making and where people get stuck. We can work out the next step from there.</p></details></div></section>${contact()}`;
writeFileSync(join(ROOT, 'index.html'), doc('Yohannes Assefa Portfolio', 0, home, 'Yohannes Assefa designs digital experiences by clarifying the problem, shaping the information, and building a visual system around what people need to do.', 'home', ''));

// ---------------- ABOUT ----------------
const about = `<section class="page-hero about-page-hero"><div class="wrap about-hero-layout"><p class="kicker">About · Addis Ababa, Ethiopia</p><h1>I design the<br><em>way through.</em></h1><p class="page-note">Architecture taught me to notice how people enter a space, what they see first, and where a route becomes unclear. I use that same attention to shape digital experiences.</p><span class="about-hero-index" aria-hidden="true">01 <i>—</i> Point of view</span></div></section>
<section class="section section-line about-profile"><div class="wrap about-profile-grid"><figure class="about-photo-frame"><img class="about-photo" src="${rel(1, 'assets/work/portrait-about.jpg')}" alt="Yohannes Assefa"><figcaption>Structure first · Then the feeling</figcaption></figure><div class="about-profile-copy"><p class="kicker">Point of view</p><h2 class="section-heading">A good interface gives attention somewhere useful to go.</h2><p class="about-copy">I look for the gap between what an organisation needs to say and what a person needs to understand. The design grows from there: order the information, set the visual tone, and make each next move easier to read.</p><div class="timeline"><article><small>2024 — Present</small><h3>UI/UX and Web Designer · Freelance</h3></article><article><small>2023 — 2024</small><h3>Graphic Designer · PurposeblackEth</h3></article><article><small>2021 — 2023</small><h3>Web Designer · Joye Design Studio</h3></article></div></div></div></section>
<section class="section section-line about-tools-section"><div class="wrap"><div class="about-tools-head"><div><p class="kicker">Tools I work with</p><h2 class="section-heading">Chosen for the work at hand.</h2></div><p class="about-tools-intro">A practical toolkit for exploring ideas, shaping clear interfaces, and taking finished work into use.</p></div><div class="about-tools-grid" data-sc-in data-sc-stagger="90"><article class="about-tool"><span>01 · Web</span><h3>Framer</h3><p>For building responsive websites and bringing designed interactions into a live experience.</p></article><article class="about-tool"><span>02 · Interface</span><h3>Figma</h3><p>For mapping flows, testing layout ideas, and creating a shared language for an interface.</p></article><article class="about-tool"><span>03 · Image</span><h3>Paper</h3><p>For sketching compositions, collecting visual references, and shaping image direction.</p></article><article class="about-tool"><span>04 · Image AI</span><h3>ChatGPT</h3><p>For generating image concepts and editing visuals as part of an iterative design process.</p></article><article class="about-tool"><span>05 · Development</span><h3>OpenCode</h3><p>For AI-assisted development that turns design decisions into working interfaces.</p></article><article class="about-tool"><span>06 · Graphics</span><h3>Illustrator</h3><p>For building identity assets, campaign graphics, and precise vector artwork.</p></article></div></div></section>
<section class="section section-line"><div class="wrap process-stage"><p class="kicker">How problems are solved</p><h2 class="section-heading">Five moves from a stuck brief to a clear answer.</h2><div class="steps five"><article>${ic('search')}<h3>Find the real problem</h3><p>Look past the first symptom and agree on what is actually making the experience difficult.</p></article><article>${ic('target')}<h3>Frame the decision</h3><p>Agree on what the person needs to understand or do, and on the evidence that will show it worked.</p></article><article>${ic('layers')}<h3>Structure the answer</h3><p>Give the information a route through the problem before deciding how any screen should look.</p></article><article>${ic('clock')}<h3>Test it in context</h3><p>Review working screens with real copy, then check the experience across devices and states.</p></article><article>${ic('check')}<h3>Leave a durable system</h3><p>Hand over the components, type, and guidance that keep the answer clear as the work grows.</p></article></div></div></section>
${contact('Contact')}${contactStrip()}`;
mkdirSync(join(ROOT, 'about'), { recursive: true });
writeFileSync(join(ROOT, 'about', 'index.html'), doc('About — Yohannes Assefa', 1, about, 'A digital designer and Framer developer in Addis Ababa — structure first, then the feeling.', 'about', 'about/', 'assets/work/portrait-about.jpg'));

// ---------------- PROJECTS ----------------
const archiveCard = (a, depth) =>
  `<a data-route class="project-card${a.figure ? ' is-poster' : ''}" href="${rel(depth, 'projects/' + a.slug + '/index.html')}"><img src="${rel(depth, a.image)}" alt="${a.title}" loading="lazy"><div class="overlay"><span class="kicker">${a.kind}</span><h2>${a.title}</h2><p>${a.problem_line}</p><span class="go">Explore the visual solution ${ic('arrow-right')}</span></div></a>`;
const selectedCards = PROJECTS.map(p =>
  `<a data-route class="snap-card" href="${rel(1, 'projects/' + p.slug + '/index.html')}" aria-label="Open ${p.title}">
    <figure class="snap-card-visual"><img src="${rel(1, p.cover)}" alt="${p.title} project design" loading="lazy"></figure>
    <span class="snap-card-copy"><span class="kind">${p.kind}</span><strong>${p.title}</strong><span class="go">Read the case ${ic('arrow-right')}</span><span class="snap-card-description">${p.problem_line}</span></span>
  </a>`).join('');
const graphicStudies = ARCHIVE.filter(a => !['limitless-finance-app', 'focus-editorial-poster'].includes(a.slug));
const archiveCards = graphicStudies.map((a, i) =>
  `<a data-route class="design-slide" data-design-slide data-index="${i}" data-kind="${a.kind}" href="${rel(1, 'projects/' + a.slug + '/index.html')}" aria-label="Open ${a.title}">
    <span class="design-image"><img src="${rel(1, a.image)}" alt="${a.title}" loading="lazy"></span>
  </a>`).join('');
const limitless = ARCHIVE.find(a => a.slug === 'limitless-finance-app');
const readBible = PROJECTS.find(p => p.slug === 'readbible-reading-app');
const museum = PROJECTS.find(p => p.slug === 'museum-of-art-in-addis');
// Phone screens laid out beside each project's heading (light and dark together).
const appScreens = (p, shots) => `<div class="app-uiux-screens">${shots.map(([label, src]) => `<a data-route class="app-uiux-screen" href="${rel(1, 'projects/' + p.slug + '/index.html')}" aria-label="View ${p.title} — ${label} screen"><img src="${rel(1, src)}" alt="${p.title} — ${label} screen" loading="lazy"><span>${label}</span></a>`).join('')}</div>`;
const appProject = (p, shots, cta) => `<article class="app-uiux-project"><div class="app-uiux-heading"><h3>${p.uiuxTitle || p.title}</h3><p>${p.desc}</p><a data-route class="text-link" href="${rel(1, 'projects/' + p.slug + '/index.html')}">${cta} ${ic('arrow-right')}</a></div>${appScreens(p, shots)}</article>`;
const readBibleShots = [['Home · light', `${W}/bible-app-1.jpg`], ['Reader · light', `${W}/bible-app-2.jpg`], ['Library · light', `${W}/bible-app-3.jpg`], ['Saved · dark', `${W}/bible-app-4.jpg`], ['Plan · dark', `${W}/bible-app-5.jpg`]];
const museumShots = [['Welcome', `${W}/museum-phone-1.jpg`], ['Sign up', `${W}/museum-phone-2.jpg`], ['Log in', `${W}/museum-phone-4.jpg`], ['Home', `${W}/museum-phone-6.jpg`], ['Artists', `${W}/museum-phone-8.jpg`]];
const appUiuxSection = `<section class="section section-line app-uiux-section" id="app-uiux"><div class="wrap">${secHead('', 'App UI/UX Design', 'Phone interfaces shaped around the task, with each screen carrying one clear next step.')}<div class="app-uiux-projects">${appProject(readBible, readBibleShots, 'Explore the ReadBible case study')}${appProject(limitless, limitless.shots, 'Explore the Limitless case study')}${appProject({ ...museum, uiuxTitle: 'Museum of Art in Addis' }, museumShots, 'Explore the museum case study')}</div></div></section>`;
const projectsPage = `<section class="page-hero projects-intro"><div class="wrap page-head"><div><p class="kicker">Selected work &amp; visual studies</p><h1>Find the friction.<br><em>Follow the thinking.</em></h1></div><p class="page-note">Every piece starts with a communication problem: what is unclear, what competes for attention, or what should happen next. The work below shows how structure and visual choices resolve it.</p></div></section>
<section class="section section-line" id="selected"><div class="wrap">${secHead('Case studies', 'Design decisions in context.', 'Explore the brief, the constraint, and the reasoning behind the finished experience.')}<div class="selected-snap" data-snap-carousel><div class="snap-tools"><div class="snap-controls"><button class="snap-control" type="button" data-snap-prev aria-label="Previous project">${ic('arrow-left')}</button><button class="snap-control" type="button" data-snap-next aria-label="Next project">${ic('arrow-right')}</button></div></div><div class="snap-track" data-snap-track tabindex="0" role="region" aria-label="Case studies. Scroll horizontally to browse.">${selectedCards}</div></div></div></section>
<section class="section section-line ideas-section" id="ideas" data-sc-act="pin" data-sc-span="${Math.max(1.5, (graphicStudies.length - 1) * .45)}" data-carousel-pin><div data-sc-stage class="wrap ideas-pin-stage">${secHead('Graphic design', 'Poster and social media posts', 'Ideas made visible.')}<div class="design-carousel" data-design-carousel><button class="design-arrow design-prev" type="button" aria-label="Previous design">${ic('arrow-left')}</button><div class="design-stage" tabindex="0" role="region" aria-label="Poster and social media designs. Scroll to move through the work, or use the controls." data-design-stage><div class="design-backdrop" aria-hidden="true"></div><div class="design-track">${archiveCards}</div></div><button class="design-arrow design-next" type="button" aria-label="Next design">${ic('arrow-right')}</button></div><div class="design-caption" aria-live="polite"><span class="design-caption-title" data-design-title>${graphicStudies[0].title}</span><span class="design-caption-kind" data-design-kind>${graphicStudies[0].kind}</span></div></div></section>${appUiuxSection}${contact()}`;
mkdirSync(join(ROOT, 'projects'), { recursive: true });
writeFileSync(join(ROOT, 'projects', 'index.html'), doc('Selected work — Yohannes Assefa', 1, projectsPage, 'A portfolio of digital design and visual studies shaped around the problems each experience needed to solve.', 'projects', 'projects/'));

// ---------------- PROJECT DETAIL PAGES (flagships) ----------------
for (const p of PROJECTS) {
  const d = join(ROOT, 'projects', p.slug);
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, 'index.html'), detailPage(p, PROJECTS));
}

// archive detail pages: always regenerate (stale pages predate the v11 shell)
for (const a of ARCHIVE) {
  const f = join(ROOT, 'projects', a.slug, 'index.html');
  mkdirSync(dirname(f), { recursive: true });
  const head = `<section class="project-detail-hero"><div class="wrap page-head"><div><h1>${a.title}</h1></div><p class="page-note cs-problem" data-sc-in><b>The challenge</b>${a.problem_line}</p></div></section><section class="section archive-story"><div class="wrap"><h2>How the visual system responds.</h2><p>${a.desc}</p></div></section>`;
  // Posters and phone screens are portrait artwork: show them whole on a dark
  // stage instead of cover-cropping a 70vh band. Phone entries then get the
  // device-switchable showcase; single-image posters stand alone (a book-mockup
  // fallback would be wrong artwork for them).
  const figure = a.figure === 'poster'
    ? `<div class="poster-stage" data-sc-in><img src="${rel(2, a.image)}" alt="${a.title} — full artwork" loading="lazy"></div>`
    : a.figure === 'phone' ? '' : `<img class="detail-hero-image" src="${rel(2, a.image)}" alt="${a.title}">`;
  const showcase = a.figure === 'poster' ? '' : staticScreens(a, 2);
  const body = `${head}${figure}${showcase}${contact()}`;
  writeFileSync(f, doc(a.title + ' — Yohannes Assefa', 2, body, a.desc, 'projects', 'projects/' + a.slug + '/', a.image));
}

// ---------------- BLOGS ----------------
const posts = [
  { img: 'assets/site/1MKyBh4nyMajaj7mqPEZiCiuAiU.jpg', slug: 'design-trends-that-will-define-2025', date: 'Feb 7, 2025', title: 'Design choices should earn their place', desc: 'A visual pattern only helps when it makes the content clearer, the task easier, or the character of the work more specific.', body: [['Interaction with a purpose', 'Motion and depth earn their place when they show relationships, reveal a process, or help someone understand a space. Without that job, they compete with the information.', 'assets/site/IHxJW1bKUhAj9C6slDiHfYZk.jpg'], ['Start with the human task', 'Tools change quickly; the questions that guide a useful design remain steady. Who is here, what are they trying to do, and what is getting in their way?', 'assets/site/mqYI8iGnOdVn7is3WMoGmnLwc.jpg'], ['Structure before shape', 'A modular layout can organize unlike pieces of information, but only when each size and position reflects a real difference in importance.', 'assets/site/rcirnYWcwUy8ZXqykfvozbbyCDE.jpg'], ['Material should clarify', 'A surface treatment can suggest what is touchable or important. If it does not make the interface easier to read, it is only another layer.', 'assets/site/umg7xrt0J22YAW0X8LsdSo9U1w.jpg'], ['Typography is part of the route', 'Type scale, line length, and spacing shape how someone moves through the message. A distinctive headline cannot compensate for body copy that is difficult to read.']] },
  { img: 'assets/site/SQgfnjbRI9uSNscu7wFDXpuJeRo.jpg', slug: 'the-power-of-typography-in-web-design', date: 'May 2, 2025', title: 'Typography as navigation', desc: 'Type does more than set a tone. It tells readers what belongs together, what matters first, and where to continue.', body: [['Voice and hierarchy share the same system', 'A display face can establish a point of view, but it has to share a clear scale with labels and reading text.'], ['Give every level a reason', 'A compact type scale makes the relationship between headline, section title, label, and paragraph easier to understand.'], ['Design for the full paragraph', 'Line length, line height, contrast, and real copy all matter. Judge the type system by the reading experience, not the specimen word.'], ['Carry the rules into the controls', 'Navigation, buttons, captions, and long-form reading are different contexts. Consistency comes from clear roles, not identical styling.']] },
];
const blogCards = posts.map(post =>
  `<a data-route class="post-card" data-sc-in href="${rel(1, 'blogs/' + post.slug + '/index.html')}"><span class="kicker">Field note · ${post.date}</span><img src="${rel(1, post.img)}" alt="${post.title} — cover" loading="lazy"><h2>${post.title}</h2><p>${post.desc}</p><span class="button alt">Read the note <span class="orb">${ic('arrow-right')}</span></span></a>`).join('');
const blogs = `<section class="page-hero"><div class="wrap page-head"><div><p class="kicker">Field notes</p><h1>Thoughts from the work.</h1></div><p class="page-note">Notes on visual hierarchy, working with content, and the small decisions that make a digital experience easier to understand.</p></div></section><section class="section section-line"><div class="wrap"><div class="blog-grid" data-sc-in data-sc-stagger="110">${blogCards}</div></div></section>${contact()}`;
mkdirSync(join(ROOT, 'blogs'), { recursive: true });
writeFileSync(join(ROOT, 'blogs', 'index.html'), doc('Field notes — Yohannes Assefa', 1, blogs, 'Notes on visual hierarchy, content, and the decisions behind useful digital experiences.', 'blogs', 'blogs/'));
for (const post of posts) {
  const art = post.body.map(([head, text, img]) => `<h2>${head}</h2><p>${text}</p>${img ? `<img class="article-img" src="${rel(2, img)}" alt="${head} example" loading="lazy">` : ''}`).join('');
  const page = `<article class="article" data-sc-in><p class="meta">Field note · ${post.date}</p><h1 data-sc-kinetic="words">${post.title}</h1><img class="article-cover" src="${rel(2, post.img)}" alt="${post.title} cover"><p class="lede">${post.desc}</p>${art}<p><a data-route class="button alt" href="${rel(2, 'blogs/index.html')}">More field notes <span class="orb">${ic('arrow-right')}</span></a></p></article>${contact()}`;
  const d = join(ROOT, 'blogs', post.slug);
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, 'index.html'), doc(post.title + ' — Yohannes Assefa', 2, page, post.desc, 'blogs', 'blogs/' + post.slug + '/', post.img));
}

console.log('regenerated the site (node)');
