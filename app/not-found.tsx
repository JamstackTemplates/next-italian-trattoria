import type { Metadata } from 'next';
import { PageHead } from '../components/page-head';
import { PastaPlate } from '../components/pasta-plate';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <PageHead id="not-found-title" kicker="404 · Finito" title={<>Questa pagina è finita — <em>this page is all gone…</em></>}
        aside={<PastaPlate shape="farfalle" caption={false} size={150} />}>
        <p>Like the last of the tortellini, it’s been and gone. The link may be out of date, or the page may have moved.</p>
      </PageHead>
      <ul className="wrap flex flex-wrap gap-x-6 gap-y-3 text-[1.1rem]">
        <li><SiteLink href="/" className="text-link">Home</SiteLink></li>
        <li><SiteLink href="/menu/" className="text-link">The menu</SiteLink></li>
        <li><SiteLink href="/wine/" className="text-link">The wine list</SiteLink></li>
        <li><SiteLink href="/#find-us" className="text-link">Hours &amp; directions</SiteLink></li>
      </ul>
    </section>
  );
}
