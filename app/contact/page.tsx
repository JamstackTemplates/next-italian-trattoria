import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { CourseArt } from '../../components/course-art';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { MarginalNote } from '../../components/marginal-note';
import { PageHead } from '../../components/page-head';
import { looseNotes, telHref, trattoria } from '../../content/trattoria';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Large tables, private dining & celebrations',
  description: `Enquiries for large tables, the private room and celebrations at ${trattoria.name}.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'kicker mb-1.5';
const tips = [
  'The date and time you have in mind',
  'How many guests, and how many children',
  'The occasion, if there is one',
  'Whether you’d like the Sunday long table or the private room',
  'Any dietary needs or allergies',
];

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  const note = looseNotes.at(-1);
  return (
    <>
      <PageHead kicker="Contact" title={<>Large tables, private dining <em>&amp; celebrations</em></>}
        aside={note ? <MarginalNote note={note} className="max-w-xs" /> : undefined}>
        <p>
          Small tables don’t need to ask: just walk in. For six or more, the private room, or a birthday, christening or
          family lunch, send us an enquiry. Nothing is booked until we reply to confirm, usually within a day.
        </p>
      </PageHead>

      <div className="wrap grid items-start gap-x-12 gap-y-10 pt-4 lg:grid-cols-12">
        <section className="lg:col-span-7 print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={trattoria.email} />
          ) : (
            <div className="grid justify-items-start gap-4 border-y border-rule py-8">
              <CourseArt art="moka" size={90} />
              <h2 className="text-[clamp(1.9rem,3.4vw,2.6rem)] italic">Write to us</h2>
              <p className="prose-serif max-w-xl text-muted">
                Email is the best way to reach us. Tell us the date, how many of you there are and what you’re celebrating,
                and we’ll write back with menus and prices.
              </p>
              <p><a className="button" href={`mailto:${trattoria.email}?subject=${encodeURIComponent('Large table enquiry')}`}>Email {trattoria.name}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5 lg:col-span-4 lg:col-start-9" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="font-display text-[1.45rem] italic wrap-anywhere"><a className="text-link font-normal" href={`mailto:${trattoria.email}`}>{trattoria.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={trattoria.email} /></p>

          {trattoria.phone ? (
            <>
              <h2 className={`mt-5 ${subhead}`}>Phone</h2>
              <p className="font-display text-[1.3rem]"><a className="text-link font-normal" href={telHref()}>{trattoria.phone}</a></p>
            </>
          ) : null}

          <h2 className={`mt-5 ${subhead}`}>Useful to include</h2>
          <ol className="grid gap-2">
            {tips.map((tip, index) => (
              <li key={tip} className="flex gap-3 border-t border-line pt-2">
                <span className="chapter-numeral w-5 flex-none text-[.9rem]">{index + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[.9rem] text-muted">
            A message is an enquiry, not a booking. We’ll confirm by email once we’ve checked the date with the kitchen.
          </p>
        </aside>
      </div>
    </>
  );
}
