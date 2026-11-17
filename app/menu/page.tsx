import type { Metadata } from 'next';
import { CourseChapter } from '../../components/course-chapter';
import { DietFilterBar } from '../../components/diet-filter';
import { PageHead } from '../../components/page-head';
import { RegionIndex } from '../../components/region-index';
import { RegionMap } from '../../components/region-map';
import { RegionScope } from '../../components/region-scope';
import { SiteLink } from '../../components/site-link';
import { TonightStatus } from '../../components/tonight-status';
import { courses, menu } from '../../content/menu';
import { hoursSummary, trattoria } from '../../content/trattoria';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu',
  description: `Antipasti, handmade pasta, secondi, contorni and dolci at ${trattoria.name}, with the region each dish comes from and a wine to go with it.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

export default function MenuPage() {
  return (
    <RegionScope>
      <PageHead kicker="The menu · a meal in five chapters" title={<>From antipasti <em>to dolci</em></>}>
        <p>
          An Italian meal is a sequence: something to share, a pasta, a main with vegetables on the side, then something
          sweet and a coffee. Order the whole story, or just a chapter.
        </p>
      </PageHead>

      <div className="wrap grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="grid content-start gap-5 lg:col-span-4">
          <TonightStatus fallback={hoursSummary()} />
          <nav aria-label="Courses" className="border-t border-rule pt-3">
            <ol className="grid gap-1">
              {courses.map(course => (
                <li key={course.id}>
                  <a href={`#${course.id}`} className="group flex items-baseline gap-3 no-underline">
                    <span className="chapter-numeral w-8 text-[.95rem]">{course.numeral}</span>
                    <span className="font-display text-[1.3rem] italic group-hover:text-accent group-hover:underline">{course.title}</span>
                    <span className="text-[.85rem] text-muted max-xs:hidden">{course.subtitle}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <p className="border-l-2 border-accent pl-3 text-[.9rem] text-muted">{menu.allergenNote}</p>
          <div className="print:hidden"><DietFilterBar /></div>
        </div>
        <div className="lg:col-span-8">
          <p className="kicker mb-3">Italy on a plate · where tonight’s dishes come from</p>
          <RegionMap shade="menu" caption="Fig. B — The regions of Italy. Shaded: the ones this menu visits." />
          <RegionIndex shade="menu" />
        </div>
      </div>

      {courses.map(course => <CourseChapter key={course.id} course={course} />)}

      <div className="wrap mt-(--space-section) grid gap-3 border-t border-rule pt-5 text-[.95rem] text-muted lg:grid-cols-12">
        <p className="lg:col-span-6">{menu.allergenNote}</p>
        <ul className="grid gap-1 lg:col-span-4 lg:col-start-8">
          {menu.notes.map(note => <li key={note}>{note}</li>)}
          <li><SiteLink href="/wine/" className="text-link">The wine list</SiteLink> · <SiteLink href="/contact/" className="text-link">Large tables &amp; private dining</SiteLink></li>
        </ul>
      </div>
    </RegionScope>
  );
}
