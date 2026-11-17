import type { Metadata } from 'next';
import { CourseArt } from '../components/course-art';
import { GoogleMap } from '../components/google-map';
import { HeroPicture } from '../components/hero-picture';
import { Icon } from '../components/icons';
import { MarginalNote } from '../components/marginal-note';
import { PastaPlate } from '../components/pasta-plate';
import { SiteLink } from '../components/site-link';
import { TimeZoneNote } from '../components/time-zone-note';
import { TonightStatus } from '../components/tonight-status';
import { atlasDishes, figureNumber, findDish, formatPrice, specials, sundayLunch } from '../content/menu';
import { formatAddress, groupedHours, hoursSummary, looseNotes, telHref, trattoria } from '../content/trattoria';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl } from '../lib/paths';
import { region } from '../lib/regions';
import { jsonLd, restaurantStructuredData } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

/** Splits the name so its last word can be set in italic on the masthead: "La Tavola *Lunga*". */
function mastheadParts(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  return words.length > 1 ? [words.slice(0, -1).join(' '), words.at(-1)!] : ['', name];
}

function HoursList() {
  return (
    <dl className="grid gap-y-1.5">
      {groupedHours().map(group => (
        <div key={group.label} className="flex flex-wrap items-baseline gap-x-3 border-b border-line pb-1.5">
          <dt className="min-w-[6.5rem] font-semibold">{group.label}</dt>
          <dd className="figures text-muted">
            {group.services.length ? group.services.map(service => `${service.label} ${service.hours}`).join(' · ') : 'Closed'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function HomePage() {
  const [lead, last] = mastheadParts(trattoria.name);
  const [cover, ...moreSpecials] = specials;
  const kitchenNote = looseNotes[0];
  const tableNote = looseNotes[1] ?? looseNotes[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(restaurantStructuredData()) }} />

      {/* Cover */}
      <section className="overflow-hidden pt-[clamp(1.5rem,3.5vw,3rem)]" aria-labelledby="cover-title">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-y border-rule py-2 text-[.78rem]">
            <span className="caps text-[.68rem]">Cucina di famiglia</span>
            <span className="font-display italic text-muted max-sm:hidden">{trattoria.tagline}</span>
            <span className="caps text-[.68rem]">{trattoria.address.locality}</span>
          </div>
          <h1 id="cover-title" className="masthead mt-3 -ml-[.04em] whitespace-nowrap">
            {lead ? <>{lead} </> : null}<em>{last}</em>
          </h1>
          <div className="hairline mt-3" />
        </div>

        <div className="wrap grid gap-x-10 gap-y-8 pt-[clamp(1.5rem,3vw,2.5rem)] lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pt-4">
            {cover ? (
              <SiteLink href="/#from-the-kitchen" className="group block no-underline">
                <p className="kicker text-accent">From the kitchen</p>
                <p className="mt-2 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] italic group-hover:text-accent">{cover.name}</p>
                <p className="prose-serif mt-2 max-w-md">{cover.description}</p>
              </SiteLink>
            ) : null}

            <div className="mt-7 grid gap-3 border-t border-rule pt-5">
              <TonightStatus fallback={hoursSummary()} className="text-[1.02rem]" />
              <p className="flex items-start gap-2.5 text-[.98rem]">
                <Icon name="pin" className="mt-0.5 flex-none text-accent" />
                <a href="#find-us" className="no-underline hover:underline">
                  {trattoria.address.street}, {trattoria.address.locality}
                  {trattoria.address.note ? <span className="block text-[.9rem] text-muted">{trattoria.address.note}</span> : null}
                </a>
              </p>
            </div>

            <p className="mt-7 flex flex-wrap gap-3">
              <SiteLink href="/menu/" className="button">See the menu <Icon name="arrow" width={18} height={18} /></SiteLink>
              <a href="#find-us" className="button button-ghost">Find us</a>
            </p>
          </div>

          <div className="lg:col-span-7 lg:-mt-6 print:hidden">
            <HeroPicture />
          </div>
        </div>
      </section>

      {/* Find us */}
      <section id="find-us" className="wrap mt-(--space-section)" aria-labelledby="find-us-title">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker">Where to find us</p>
            <h2 id="find-us-title" className="headline mt-3">Find <em>us</em></h2>
            <p className="prose-serif mt-4 text-[1.3rem]">
              {trattoria.address.street}, {trattoria.address.locality}, {trattoria.address.region} {trattoria.address.postalCode}
            </p>
            {trattoria.address.note ? <p className="mt-1 text-muted">{trattoria.address.note}</p> : null}
            <p className="mt-5 flex flex-wrap gap-3">
              <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions <Icon name="arrow" width={18} height={18} /></a>
              <a className="button button-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
            </p>
            {trattoria.directions.length ? (
              <ul className="mt-6 grid gap-2 text-[.97rem] text-muted">
                {trattoria.directions.map(line => <li key={line} className="border-l border-line pl-3">{line}</li>)}
              </ul>
            ) : null}
            {trattoria.notice ? <p className="mt-5 border-y border-accent py-3 font-semibold">{trattoria.notice}</p> : null}

            <h3 className="mt-8 flex items-center gap-2 text-[1.5rem] italic"><Icon name="clock" className="text-accent" />Opening hours</h3>
            <div className="mt-3"><HoursList /></div>
            <TimeZoneNote />
            {trattoria.phone ? (
              <p className="mt-3 text-[.97rem]">Phone <a className="text-link" href={telHref()}>{trattoria.phone}</a></p>
            ) : null}
          </div>

          <figure className="lg:col-span-7 lg:pt-14">
            <div className="figure-frame"><GoogleMap className="min-h-[24rem] lg:min-h-[30rem]" /></div>
            <figcaption className="figure-caption mt-2.5">
              <span className="caps mr-2 text-[.66rem] not-italic">Fig. A</span>
              {trattoria.address.street}, {trattoria.address.locality}. {trattoria.address.note}.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* From the kitchen */}
      {specials.length ? (
        <section id="from-the-kitchen" className="wrap mt-(--space-section)" aria-labelledby="kitchen-title">
          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="kicker">Written on the board this week</p>
              <h2 id="kitchen-title" className="headline mt-3">From the <em>kitchen</em></h2>
              <p className="prose-serif mt-4 text-muted">What the market and the season brought in, in short supply until it’s gone.</p>
              {kitchenNote ? <MarginalNote note={kitchenNote} className="mt-8 max-w-xs" /> : null}
            </div>
            <ol className="grid gap-0 lg:col-span-8">
              {[cover, ...moreSpecials].filter(Boolean).map((special, index) => (
                <li key={special.name} className={`grid gap-x-6 gap-y-3 border-t py-6 ${index === 0 ? 'border-rule' : 'border-line'} ${special.shape ? 'sm:grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
                  <div>
                    <p className="kicker">{special.region ? region(special.region).name : 'Today'}</p>
                    <h3 className="mt-1 text-[clamp(1.7rem,3vw,2.3rem)] italic">{special.name}</h3>
                    <p className="prose-serif mt-1.5 max-w-xl">
                      {special.description} <span className="figures ml-1 font-sans text-[.95rem] font-semibold">{formatPrice(special.price)}</span>
                    </p>
                  </div>
                  {special.shape ? <PastaPlate shape={special.shape} regionId={special.region} size={120} className="w-32 sm:justify-self-end" /> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* The long table */}
      <section className="pt-(--space-section)" aria-labelledby="long-table-title">
        <div className="border-y border-line bg-paper/70 py-[clamp(3rem,7vw,5.5rem)]">
          <div className="wrap grid gap-x-10 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="kicker">Every Sunday, 12 to 4</p>
              <h2 id="long-table-title" className="headline mt-3">The long <em>table</em></h2>
              <p className="prose-serif drop-cap mt-6 max-w-2xl">{sundayLunch.served}</p>
              <ol className="mt-7 grid max-w-2xl gap-0">
                {sundayLunch.courses.map((course, index) => {
                  const dish = 'dish' in course ? findDish(course.dish) : undefined;
                  return (
                    <li key={index} className="flex items-baseline gap-4 border-t border-line py-2.5">
                      <span className="figures w-6 flex-none font-display text-accent italic">{index + 1}.</span>
                      {dish
                        ? <SiteLink href={`/menu/#${dish.id}`} className="font-display text-[1.2rem] italic no-underline hover:text-accent hover:underline">{dish.name}</SiteLink>
                        : <span className="font-display text-[1.2rem] italic">{'label' in course ? course.label : ''}</span>}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-rule pt-4">
                <span><span className="figures font-display text-[2rem]">{formatPrice(sundayLunch.pricePerPerson)}</span> <span className="text-muted">per person</span></span>
                <span><span className="figures font-display text-[1.5rem]">{formatPrice(sundayLunch.childrenPrice)}</span> <span className="text-muted">children under 12</span></span>
              </p>
            </div>
            <div className="grid content-center gap-8 lg:col-span-5 lg:pl-6">
              <CourseArt art="roast" size={140} className="justify-self-start" />
              <blockquote className="pull-quote text-[clamp(1.7rem,3vw,2.5rem)]">{sundayLunch.quote}</blockquote>
              {tableNote ? <MarginalNote note={tableNote} className="max-w-xs" /> : null}
            </div>
          </div>
        </div>
      </section>

      {/* The pasta atlas */}
      {atlasDishes.length ? (
        <section className="wrap pt-(--space-section)" aria-labelledby="atlas-title">
          <div className="grid gap-x-10 gap-y-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="kicker">Plates I – {['I', 'II', 'III', 'IV', 'V', 'VI'][atlasDishes.length - 1]}</p>
              <h2 id="atlas-title" className="headline mt-3">The pasta <em>atlas</em></h2>
            </div>
            <p className="prose-serif text-muted lg:col-span-6 lg:col-start-7 lg:self-end">
              Every shape on the menu, drawn as it comes off the board. Each one belongs to a place, and to a sauce that suits it.
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {atlasDishes.map(dish => (
              <li key={dish.id}>
                <SiteLink href={`/menu/#${dish.id}`} className="group block no-underline">
                  <PastaPlate shape={dish.shape!} regionId={dish.region} figure={figureNumber(dish.id)} size={150} className="[&_svg]:h-auto [&_svg]:w-full" />
                  <span className="mt-1 block font-display text-[1.05rem] leading-tight italic group-hover:text-accent group-hover:underline">{dish.name}</span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Our story */}
      <section className="wrap pt-(--space-section)" aria-labelledby="story-title">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="kicker">Our story</p>
            <h2 id="story-title" className="mt-3 text-[clamp(2.3rem,4vw,3.2rem)] leading-none [&_em]:text-accent [&_em]:italic">Three <em>generations</em>, one board</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-4">
            {trattoria.story.map((paragraph, index) => (
              <p key={paragraph} className={`prose-serif ${index ? 'mt-5' : 'drop-cap'}`}>{paragraph}</p>
            ))}
          </div>
          <ol className="grid content-start gap-6 lg:col-span-3 lg:col-start-10">
            {trattoria.storyPoints.map((point, index) => (
              <li key={point.title} className="border-t border-rule pt-3">
                <span className="chapter-numeral text-[1rem]">{['I', 'II', 'III', 'IV'][index]}</span>
                <h3 className="mt-1 text-[1.35rem] italic">{point.title}</h3>
                <p className="mt-1 text-[.95rem] text-muted">{point.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Large tables */}
      <section className="wrap pt-(--space-section)" aria-labelledby="large-tables-title">
        <div className="grid items-center gap-x-10 gap-y-6 border-y-2 border-double border-rule py-10 lg:grid-cols-12">
          <CourseArt art="wine-glass" size={110} className="max-lg:hidden lg:col-span-2" />
          <div className="lg:col-span-7">
            <p className="kicker">Six or more · private room · celebrations</p>
            <h2 id="large-tables-title" className="mt-2 text-[clamp(2rem,4vw,3.1rem)]">Large tables, private dining <em className="text-accent">&amp; celebrations</em></h2>
            <p className="prose-serif mt-3 max-w-2xl text-muted">
              Birthdays, christenings, rehearsal dinners or a long lunch for the whole family: tell us the date and how many,
              and we’ll write back with menus. Small tables can always walk in.
            </p>
          </div>
          <p className="lg:col-span-3 lg:justify-self-end"><SiteLink href="/contact/" className="button">Send an enquiry</SiteLink></p>
        </div>
      </section>

      {/* FAQs */}
      {trattoria.faqs.length ? (
        <section id="faq" className="wrap mt-(--space-section)" aria-labelledby="faq-title">
          <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="kicker">Good to know</p>
              <h2 id="faq-title" className="headline mt-3">Questions at <em>the table</em></h2>
              <p className="mt-5 text-muted">
                Something else? <SiteLink href="/contact/" className="text-link">Write to us</SiteLink>
                {trattoria.phone ? <> or call <a className="text-link" href={telHref()}>{trattoria.phone}</a></> : null}.
              </p>
            </div>
            <div className="lg:col-span-8">
              {trattoria.faqs.map(faq => (
                <details key={faq.question} className="faq border-t border-line last:border-b">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 font-display text-[clamp(1.2rem,2vw,1.45rem)] italic">{faq.question}</summary>
                  <p className="prose-serif max-w-2xl pb-5 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
