import { DarkModeToggle } from 'jamstacks';
import { trattoria } from '../content/trattoria';
import { SiteLink } from './site-link';

const navigation = [
  { href: '/menu/', label: 'Menu' },
  { href: '/wine/', label: 'Wine' },
  { href: '/contact/', label: 'Contact' },
];

/** A slim masthead strip: the name in Bodoni small capitals, three links and the theme toggle. */
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50">
      <div className="wrap flex min-h-(--header-h) items-center justify-between gap-3">
        <SiteLink href="/" className="masthead-small text-[1.08rem] whitespace-nowrap no-underline max-[359px]:text-[.95rem] sm:text-[1.3rem]">
          {trattoria.name}
        </SiteLink>
        <div className="flex items-center gap-2.5 sm:gap-6">
          <nav aria-label="Main">
            <ul className="flex gap-3 sm:gap-6">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent="section" className="nav-link">{item.label}</SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <DarkModeToggle className="flex-none print:hidden" />
        </div>
      </div>
    </header>
  );
}
