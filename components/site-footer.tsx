import { formatAddress, groupedHours, publicLinks, telHref, trattoria } from '../content/trattoria';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

const heading = 'kicker mb-3';

/** The colophon: as at the back of a magazine, below a woven tablecloth edge. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-(--space-section)">
      <div className="wrap"><div className="woven-rule" aria-hidden="true" /></div>
      <div className="wrap grid gap-x-10 gap-y-8 pt-10 pb-8 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="kicker">Colophon</p>
          <p className="mt-2 font-display text-[2.1rem] leading-none italic">{trattoria.name}</p>
          <p className="mt-2 text-[.95rem] text-muted">{trattoria.tagline}</p>
          <p className="mt-5 max-w-sm font-display text-[.95rem] text-muted italic">
            Set in Bodoni Moda and Libre Franklin, with notes in Nonna’s hand (Homemade Apple). Printed on linen, served on Sundays.
          </p>
        </div>
        <div className="lg:col-span-3">
          <h2 className={heading}>Hours</h2>
          <ul className="grid gap-1.5 text-[.95rem]">
            {groupedHours().map(group => (
              <li key={group.label} className="flex flex-wrap justify-between gap-x-4">
                <span>{group.label}</span>
                <span className="figures text-muted">{group.services.length ? group.services.map(s => `${s.label === 'Sunday lunch' ? 'Lunch' : s.label} ${s.hours}`).join(', ') : 'Closed'}</span>
              </li>
            ))}
          </ul>
          <TimeZoneNote />
        </div>
        <div className="lg:col-span-3">
          <h2 className={heading}>Find us</h2>
          <address className="text-[.95rem] leading-relaxed not-italic">
            {formatAddress()}<br />
            {trattoria.phone ? <><a className="text-link" href={telHref()}>{trattoria.phone}</a><br /></> : null}
            <a className="text-link" href={`mailto:${trattoria.email}`}>{trattoria.email}</a>
          </address>
        </div>
        <div className="lg:col-span-2">
          <h2 className={heading}>Pages</h2>
          <ul className="grid gap-1.5 text-[.95rem] [&_a]:no-underline [&_a:hover]:text-accent [&_a:hover]:underline">
            <li><SiteLink href="/menu/">Menu</SiteLink></li>
            <li><SiteLink href="/wine/">Wine list</SiteLink></li>
            <li><SiteLink href="/#find-us">Find us</SiteLink></li>
            <li><SiteLink href="/contact/">Large tables</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line pt-4 pb-8 text-[.85rem] text-muted">
        <span>© {year} {trattoria.name}</span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-accent hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </p>
    </footer>
  );
}
