# La Tavola Lunga (Next.js)

A warm, editorial theme for Italian trattorias: a course-by-course menu from antipasti to dolci with regional dishes, pasta drawn by shape, wine pairings and a wine list mapped across Italy's regions, today's specials from the kitchen, Sunday lunch, opening hours, location and a [Jamstacks](https://jamstacks.net) contact component for large tables, private dining and celebrations.

The site is laid out like a food-magazine feature about a long Italian meal, set on linen. The home page opens on a magazine cover: your name as a Bodoni masthead, a cover line from today's specials, tonight's status and a watercolour still life of the pasta board. The menu is a sequence of chapters (*Antipasti*, *Primi*, *Secondi*, *Contorni*, *Dolci*), each dish set as an editorial entry with its region, a wine pairing and, for pasta, a plate from the **pasta atlas**. A **tile map of Italy's 20 regions** shows where the food and wine come from, and Nonna's handwritten notes sit in the margins. Light mode is "Sunday lunch" (linen, ink and terracotta); dark mode is "dinner by candlelight" (wine-black and walnut, with the candle on the pasta board lit). Both follow the visitor's device unless they pick one with the header toggle.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend.

**La Tavola Lunga**, its family, story, dishes, wines, Nonna's notes and contact details are fictitious placeholders. The sample address is a public landmark, the Paul Revere Mall (the Prado) in Boston's North End, so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | The **cover**: your name as a masthead, the cover line from today's first special, tonight's status and hours, the address, "See the menu" and "Find us", and the still life of the pasta board. Then **Find us** (landmark, directions buttons, transit and parking, opening hours with Sunday lunch and the time zone, and the map as a framed figure), **From the kitchen** (today's specials), **The long table** (the Sunday lunch set menu and prices), **The pasta atlas** (six plates linking to the menu), **Our story** (with a drop cap and three points), **Large tables & celebrations** and **FAQs** |
| `/menu/` | Tonight's status, a contents list of the courses, the allergen note, vegetarian/vegan filters and the region map, then each course as a chapter with editorial entries, pasta plates, wine pairings and Nonna's notes |
| `/wine/` | The region map of where the wines come from, then the list: house wines by the glass first, then bollicine, bianchi, rosati, rossi and dolci, each wine with grape, region, denomination, glass and bottle prices, notes and the dishes it goes with |
| `/contact/` | Large tables, private dining & celebrations: email and phone (always available) plus the hosted enquiry form when connected |
| any other URL | A friendly 404: "Questa pagina è finita — this page is all gone…" |

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # configuration, menu, wine, regions, pasta shapes and hours checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from three content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | **Today's specials** (at the top), the five courses and their dishes, prices, regions, pasta shapes, diet marks, wine pairings, badges, sold-out ("Finito for today") dishes, the Sunday lunch menu and prices, the allergen note, currency |
| [content/wine.ts](content/wine.ts) | The wine list: house wines, grapes, regions, denominations, styles, glass and bottle prices, notes, corkage note |
| [content/trattoria.ts](content/trattoria.ts) | Name, tagline, introduction, family story and its three points, email, phone, address (with a landmark `note`), directions, opening hours, notice, Nonna's notes, amenities, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours, fonts and other customizations. Components are styled with Tailwind classes |
| `public/hero-*.webp` | The cover picture, by day and by candlelight (see [Cover pictures](#cover-pictures)) |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name/description, domain, your time zone and public deployment settings (see below) |

**Renaming the business** is a two-line change: `name` in `content/trattoria.ts` and `name` in `site.config.json`. The masthead sets the last word in italic terracotta automatically.

### Today's specials

The edit you'll make most is at the very top of `content/menu.ts`:

```ts
export const specials: Special[] = [
  {
    name: 'Ravioli di zucca',                 // Italian name, with its accents
    description: 'Hand-cut ravioli of roast squash and amaretti, with brown butter and sage.',
    price: 27,
    region: 'lombardia',                      // optional: shown as a small-caps kicker
    shape: 'ravioli',                         // optional: draws a pasta plate beside it
  },
  // 2–4 entries in all
];
```

The first special becomes the home page **cover line** under "From the kitchen". Specials are build-time content, so they're labelled "From the kitchen", never "Today", and change when you rebuild.

### A dish

```ts
{
  id: 'orecchiette-cime-di-rapa',    // unique; also the link /menu/#orecchiette-cime-di-rapa
  name: 'Orecchiette con le cime di rapa',
  description: 'Little ears with bitter turnip greens, garlic, chilli and toasted breadcrumbs.',
  price: 23,
  region: 'puglia',                  // one of Italy's 20 regions (see below)
  shape: 'orecchiette',              // required for pasta primi: draws its plate in the atlas
  diet: ['vegan'],                   // vegetarian, vegan, gluten-free, contains-nuts
  pairing: 'cerasuolo-d-abruzzo',    // optional: a wine id from content/wine.ts
  badge: 'stagionale',               // optional: 'della-casa' | 'stagionale' | 'new'
  featured: true,                    // optional: set large with a pull quote (one or two per course)
  pullQuote: 'Pressed with the thumb, one at a time.',
}
```

- **Finished for today?** Add `soldOut: true`. The dish stays on the menu, struck through, with "Finito for today" in place of its price. Remove the line when it's back.
- **Seasonal dishes:** add `badge: 'stagionale'` and delete the dish when the season ends.
- **A new course or section:** the five courses follow the Italian meal and are checked in order; rename their titles and descriptions freely, and add dishes to any of them. A chapter drawing (`art`) is one of `olives`, `pasta-nest`, `roast`, `artichoke` or `lemon-tart`.
- **Regions:** `region` is one of `valle-d-aosta`, `piemonte`, `liguria`, `lombardia`, `trentino-alto-adige`, `veneto`, `friuli-venezia-giulia`, `emilia-romagna`, `toscana`, `umbria`, `marche`, `lazio`, `abruzzo`, `molise`, `campania`, `puglia`, `basilicata`, `calabria`, `sicilia`, `sardegna`. The region maps shade whatever your menu and wine list visit.
- **Pasta shapes:** `shape` is one of `tagliatelle`, `pappardelle`, `spaghetti`, `bucatini`, `rigatoni`, `penne`, `orecchiette`, `ravioli`, `tortellini`, `gnocchi`, `lasagne`, `trofie` or `farfalle`. Each is a fixed line drawing in [lib/pasta-shapes.ts](lib/pasta-shapes.ts), numbered "Fig. 1", "Fig. 2"… in menu order, so a new dish needs no image. The home page atlas shows the first six.
- **Diet marks:** `GF` means made with gluten-free ingredients in a shared kitchen; the allergen note on the menu says so. Vegan dishes also count as vegetarian in the filters.
- **Prices** are numbers in `menu.currency` (`26` is $26, `14.5` is $14.50). Change `currency` and `locale` for other countries.

### Sunday lunch, wine and Nonna

`sundayLunch` in `content/menu.ts` is the long-table set menu: a list of `{ dish: 'tagliatelle-al-ragu' }` (linked to the menu) or `{ label: 'Porchetta with crackling' }` entries, `pricePerPerson`, `childrenPrice`, a `served` paragraph and a pull quote.

Wines in `content/wine.ts` need an `id`, `name`, `grape`, `denomination`, `region`, `style`, `glass` and `bottle` prices and `notes`. Use denominations and generic names ("Chianti Classico", "Rosso della casa"), not real producers. `house: true` puts a wine in the "By the glass" section at the top. **Pairings are typed once**, on the dish: the wine list works out which dishes go with each wine.

Nonna's notes are `marginalia` in `content/trattoria.ts`. Give a note a `dish` id and it sits in the margin beside that dish on the menu (or as an inset aside on phones); notes without a dish appear on the home page and Contact. Keep them short and kind.

`npm test` checks everything after an edit: unique, URL-safe ids, complete dishes and wines, valid regions, shapes, diet tags and badges, positive prices, pairings and Sunday-lunch dishes that exist, Nonna's notes pointing at real dishes, a shape for every pasta primo, the number of specials, valid hours, the 20-region tile map and that every pasta shape draws. A failure names the item to fix.

### Hours, tonight and the time zone

`hours` in `content/trattoria.ts` lists every day once, Monday first, with its services in 24-hour local time:

```ts
{ day: 'Monday', services: [] },                                                   // closed
{ day: 'Tuesday', services: [{ label: 'Dinner', opens: '17:00', closes: '22:00' }] },
{ day: 'Sunday', services: [{ label: 'Sunday lunch', opens: '12:00', closes: '16:00' }] },
```

`closes` is when the kitchen closes. A day can have two services, e.g. `{ label: 'Lunch', … }` then `{ label: 'Dinner', … }`.

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/New_York`. With it, the visitor's browser works out the status on the cover and the menu, using *your* clock and refreshing every minute: "Open tonight · kitchen until 10pm", "Sunday lunch · until 4pm", "Kitchen closing in 30 minutes", "Kitchen closed for today · open Thursday from 5pm" or "Closed today · open Tuesday from 5pm". "Times shown in Eastern Time" (or your zone) appears beside the hours.

The built files never contain a time-dependent claim. Without a time zone or without JavaScript, the status shows the week's pattern ("Dinner Tue – Sat, 5pm – 10pm · Sunday lunch, 12pm – 4pm"). An invalid zone name fails the build with a clear message. Use `notice` for one-off messages such as holiday hours; leave it `''` to hide it.

### Location and map

The Find us section shows the address, landmark, directions and hours beside a Google map framed like a magazine figure. The map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/trattoria.ts`.

All three are free and need no Google account or API key:

- The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- The map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form that `google.com/maps?q=…&output=embed` redirects to). It's widely used but isn't a documented API. For Google's officially supported option, create a free [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts) to the `maps/embed/v1/place` form shown there. Embed API keys are meant to be public, so this is safe in a static site.

The map is lazy-loaded, so Google is only contacted when it scrolls into view. Google may set cookies in the embedded map, so mention it in your privacy notice if you have one. In dark mode a CSS filter (`--map-filter` in `app/tailwind.input.css`) darkens it to match; set it to `none` to show Google's normal colours.

Text is rendered as plain text, never HTML. Don't present invented reviews or awards as fact.

## Appearance

The header uses `DarkModeToggle` from the published `jamstacks` React package. The root layout supplies `ThemeProvider` and the early `ThemeScript`, so a saved preference applies before the first paint and stays consistent across navigation and tabs.

Apart from the cover picture, everything you see is drawn with inline SVG and CSS coloured by tokens: the pasta plates, the course drawings (olives, a pasta nest, a roast, an artichoke, a lemon tart, a moka pot, a wine glass and bottle), the region tile map, the linen weave and the woven tablecloth edge above the footer. There are no other image files to swap. After dark a soft candlelight flickers over the cover picture's candle; pasta plates draw themselves in once as they scroll into view, and region tiles fade their shading in. All of this stops for visitors who prefer reduced motion, and without JavaScript the plates are simply there.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-paper text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (light `:root` and both dark blocks, which must match). To add one, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on). Illustration colours are tokens too (`--ink-line`, `--ink-fine`, `--wash-*`, `--red-wine`).

### Cover pictures

The still life on the cover is a pair of watercolour-and-ink pictures in `public/`: `hero-light.webp` ("Sunday lunch") and `hero-dark.webp` (by candlelight), 2400×1792, served at 800, 1280, 1600 and 2400 pixels wide (`hero-light-800.webp` and so on). Only the one for the current theme is downloaded. The day picture has a pure white background and the night picture pure black; [components/hero-picture.tsx](components/hero-picture.tsx) blends them onto the page (multiply and screen), so the background disappears into the linen or walnut whatever the theme colours. It also adds the flickering candlelight in dark mode.

To use your own pictures, keep the same layout in both versions, a plain background and a little empty space around the subject. Turn the day background pure white and the night background pure black (dividing by, or subtracting, a colour a shade darker or lighter than the background does it), then make the sizes:

```sh
magick day.webp \( +clone -fill '#F4E9D9' -colorize 100 \) -compose Divide_Src -composite day-white.png
magick night.webp \( +clone -fill '#1B100F' -colorize 100 \) -compose Minus_Src -composite night-black.png
for w in 800 1280 1600 2400; do
  magick day-white.png -resize ${w}x -quality 82 public/hero-light-$w.webp
  magick night-black.png -resize ${w}x -quality 82 public/hero-dark-$w.webp
done
```

If the new pictures aren't 2400×1792, update `WIDTH` and `HEIGHT` in `components/hero-picture.tsx`, and move the candlelight glow (`candle-light`) over your candle, or delete it.

Fonts are self-hosted through npm packages:

| Font | Used for | Licence |
| --- | --- | --- |
| [Bodoni Moda](https://fonts.google.com/specimen/Bodoni+Moda) (`@fontsource-variable/bodoni-moda`) | The masthead, chapters, dish names, descriptions and long-form text. Its optical sizes keep small text sturdy and save the high contrast for large sizes | SIL Open Font License 1.1 |
| [Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin) (`@fontsource-variable/libre-franklin`) | Navigation, buttons, kickers, prices and other UI | SIL Open Font License 1.1 |
| [Homemade Apple](https://fonts.google.com/specimen/Homemade+Apple) (`@fontsource/homemade-apple`) | Nonna's handwritten notes only | Apache License 2.0 |

Prices and times use lining, tabular figures (the `figures` utility).

## Footer credit

The footer (the "colophon") ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "La Tavola Lunga",
  "description": "A family trattoria in Boston’s North End: handmade pasta from Emilia-Romagna to Puglia, a short honest wine list, and Sunday lunch at one long table.",
  "domain": "next-italian-trattoria.jamstacks.net",
  "timeZone": "America/New_York",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo, `next-italian-trattoria.jamstacks.net`. **Replace it with your own domain** (hostname only, e.g. `www.example.com`) or set it to `""` if you don't know it yet; it's used for canonical links, the social image and the sitemap. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-trattoria` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions so a public site can never depend on your machine.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts that URL and emits HTTPS canonical, social and sitemap URLs, so the first deployment can complete. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Restaurant` structured data (`servesCuisine: "Italian"`, address, phone, menu link, opening hours, and `acceptsReservations: false`, because small tables walk in and large tables go through an enquiry) built from `content/trattoria.ts`.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number and a "useful to include" list (the date and time, number of guests, the occasion, the Sunday long table or the private room, dietary needs). No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Large tables & celebrations", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval), with no rebuild. Changing the menu, hours or the site ID does need a rebuild.
- The form supports name, email and message today. The page copy says small tables walk in, and that a message is an *enquiry*: nothing is booked until you reply to confirm. Don't promise booking slots, party-size fields or deposits.
- Only the Contact page loads the Jamstacks script.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation), so the form appears reliably. This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). The form's primary colour stays the deep terracotta in both modes, so its white button text stays readable. A theme you publish in the portal overrides these on the component itself. Don't style the component's internals; they're owned by the runtime.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets: they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/italian-preview npm run build
node scripts/serve.mjs --base /italian-preview   # http://localhost:3000/italian-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, then put the same hostname in `site.config.json`'s `domain`. Don't add a `public/CNAME` file: deployments from GitHub Actions ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal; the service refuses submissions from origins it doesn't know.

## Project structure

```
app/                    routes (home, menu, wine, contact, 404), metadata, sitemap/robots, styles and tokens
components/             header, colophon footer, cover picture, course drawings, pasta plates, dish entries and
                        chapters, region map, scope and index, diet filters, Nonna's notes, tonight status,
                        Jamstacks host/loader
content/                trattoria.ts, menu.ts and wine.ts: your content
lib/config.mjs          build-time public config resolution and validation
lib/hours.ts            opening hours, services and the tonight status
lib/regions.ts          Italy's 20 regions and their tiles on the map
lib/pasta-shapes.ts     the pasta atlas drawings
lib/pairings.ts         dishes for each wine and the region index, derived from the menu
lib/menu-filter.ts      vegetarian and vegan filters
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Restaurant data
lib/time-zone.ts        readable time zone names for the hours
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/                  typed JSX for <jamstacks-support-form>
public/                 cover pictures and social preview image
scripts/serve.mjs       static preview server (with base path support)
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace La Tavola Lunga (in `content/trattoria.ts` and `site.config.json`), the family story, Nonna's notes, address (and its `note`), directions, email, phone, specials, dishes, prices, wines, Sunday lunch, FAQs and social links with your own details.
- Set your real opening hours and `timeZone` in `site.config.json`, and check the status line on the home page.
- Replace the demo `domain` in `site.config.json` with your own (or set the correct Pages URL), and update the site title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed.
Normal `npm test`, type checking, builds and the Pages workflow do not depend on it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
