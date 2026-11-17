# Working on this website

This is a customer-owned Next.js website for an Italian trattoria. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample trattoria, family story,
  menu, wines, address and contact details with the owner's real details; the fictional examples are starting content.

## Structure and content

- `content/menu.ts` owns the food. Most owner requests are edits here only:
  - `specials` (top of the file, edited most often): 2–4 entries with `name`, `description`, `price`, optional
    `region` and `shape`. The first one is the home page cover line ("From the kitchen").
  - `courses`: Antipasti, Primi, Secondi, Contorni and Dolci, in meal order, each with `id`, Italian `title`,
    English `subtitle`, Roman `numeral`, `description`, `art` and `dishes`.
  - Dishes: `id`, `name` (Italian, properly accented), `description` (plain English), `price`, `region`, `shape`
    (required for pasta primi), `diet` (`vegetarian` | `vegan` | `gluten-free` | `contains-nuts`), `pairing`
    (a wine id), `badge` (`della-casa` | `stagionale` | `new`), `featured` with an optional `pullQuote`, and
    `soldOut` ("Finito for today": the dish stays listed).
  - `sundayLunch`: the set menu as `{ dish: id }` or `{ label }` entries, prices and copy. `menu` holds the
    currency, locale, allergen note and footnotes.
- `content/wine.ts` owns the wine list: `id`, `name` (denomination or "… della casa", never a real producer),
  `grape`, `denomination`, `region`, `style` (`sparkling` | `white` | `rose` | `red` | `dessert`), `glass` and
  `bottle` prices, `notes`, `house` (listed first, by the glass) and `featured`. The dishes each wine goes with
  are derived from the menu's `pairing` fields (`lib/pairings.ts`); never type them twice.
- `content/trattoria.ts` owns the name, tagline, introduction, story and story points, contact details, address
  (with a landmark `note`), directions, opening hours (services per day), notice, Nonna's `marginalia` (optional
  `dish` id to sit beside), amenities, FAQs and social links.
- Regions are the 20 ids in `lib/regions.ts`, which also places each on the tile map. Pasta shapes are the fixed
  drawings in `lib/pasta-shapes.ts`. A new shape is a new drawing there plus its name in `PASTA_SHAPES`, with
  tests. Never add image files for dishes, wines or shapes; use the existing drawings and colour tokens. The only
  pictures are the cover's `public/hero-{light,dark}*.webp` pair (`components/hero-picture.tsx`, README "Cover pictures");
  keep both versions in the same layout and regenerate every size when replacing them.
- Opening hours, the "tonight" status and the next opening live in `lib/hours.ts` and are unit tested. A day can
  hold more than one service (lunch and dinner). The status uses the kitchen's closing time.
- The address drives the "Find us" section, Google map, directions links and structured data. Maps use keyless
  Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice there). Change it
  there, not in content; without it the status line shows the week's hours and never claims open or closed.
- The business name lives in two places: `trattoria.name` in `content/trattoria.ts` and `name` in
  `site.config.json`. Renaming is a two-line change.
- Ids are unique, lowercase and hyphenated, and are page anchors (`/menu/#lasagne`, `/wine/#chianti-classico`).
  `find-us`, `from-the-kitchen`, `faq`, `della-casa` and the wine style ids are reserved.
- Keep content out of `site.config.json`: Jamstacks may rewrite it.
- Text is rendered as plain text. Don't invent reviews, awards or claims, or name real restaurants, wineries or
  people. Avoid Italian clichés (gingham, flag stripes, "Mamma mia"); Nonna is a quiet family voice, not a caricature.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds what utilities can't express: the colour tokens (`:root` for light "Sunday
  lunch", plus two dark "candlelight" blocks that must stay identical), the `@theme` built from them, base element
  styles, shared building blocks (`.button`, `.button-ghost`, `.text-link`, `.kicker`, `.headline`, `.prose-serif`,
  `.drop-cap`, `.hairline`, `.woven-rule`, `.pull-quote`, `.marginalia`, `.diet-mark`, `.status`, `.figure-frame`),
  the masthead and chapter titles, illustration classes (`.ink`, `.ink-fine`, `.wash-*`, `.art-*`), the cover picture's edge mask, theme switch and candlelight,
  the region tiles, animation and data-attribute states (diet filters, region highlighting, the form).
- Only this template's palette exists (`bg`, `paper`, `paper-2`, `ink`, `muted`, `line`, `rule`, `accent`,
  `button`, `on-button`, `olive`, `wine`, `ochre`, `hand`). Tailwind's default colours are switched off. To add a
  colour, add a variable to `:root` and both dark blocks, then map it in `@theme inline` as
  `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on. Illustration classes are named `art-*`
  so they never collide with Tailwind's `fill-*` utilities.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
- The layout is an asymmetric 12-column editorial grid on desktop: big Bodoni headlines, kickers, hairlines and
  marginalia. There are no cards. Reuse `PageHead`, `CourseChapter`, `DishEntry`, `FeaturedDish`, `PastaPlate`,
  `CourseArt`, `MarginalNote`, `RegionMap`, `RegionIndex` and `TonightStatus` instead of restyling each instance.
- Keep the `--jamstacks-*` component variables mapped to the tokens (the form's primary stays the deep terracotta
  so its white button text is readable). Preserve contrast in both themes, layouts from 360px, visible keyboard
  focus, semantic headings, print styles and reduced-motion support (the candlelight flicker, plate draw-in and tile
  fade all stop).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no request-time rendering, API
  routes, Server Actions, database or production Next.js server.
- Use local content for pages and ordinary client code only for browser-only interactions: the tonight status,
  the region map and diet filters (`RegionScope` sets `data-*` attributes; CSS does the hiding), the plate
  draw-in and the copy button. Time-dependent text is computed in the browser, never at build time.
- Without JavaScript the full menu and wine list are in the HTML, the map is a static figure and the region index
  links to every dish and wine.
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths. Use the shared path helpers
  (`lib/paths.ts`) and `SiteLink` for links, images and metadata.
- Files imported by the Node tests import other modules' values with a `.ts` extension (`'../lib/hours.ts'`), so
  `node --test` can run them directly.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before changing framework behaviour.
  Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>` with
  `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at `/sites/{publicSiteId}/embed.js`,
  on the Contact page only; no ID means no script request and a useful email fallback. The email stays visible
  beside the form.
- The shared runtime owns form rendering, validation, spam protection and submission. Do not copy it, register a
  replacement element, intercept submission or simulate success.
- Preserve the full-document Contact navigation (`SiteLink`) until a supported remount contract is available.
- The form supports name, email and message. Don't promise bookings, deposits or extra fields in page copy: small
  tables walk in, and a message is an enquiry; nothing is booked until the trattoria replies to confirm.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials, publishing keys or private
  notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated run name when
  changing the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # menu, wine, regions, pasta shapes, hours, tonight, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/italian-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the dish, wine, region, shape or day
to fix. `npm start` previews the export on port 3000. Browser-check affected routes in light and dark, at phone and
desktop widths, and root/project-path assets when changing layout, navigation or deployment behaviour. Report
local checks separately from any actual GitHub deployment or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import it.
- Keep `site.config.json`, embed integration and the Pages workflow outside the optional folder.
