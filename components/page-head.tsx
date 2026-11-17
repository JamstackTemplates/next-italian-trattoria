import type { ReactNode } from 'react';

/**
 * Heading block for inner pages, set like the opening of a magazine section: a kicker and numeral,
 * a large Bodoni title (use <em> for the italic accent words) and a standfirst.
 */
export function PageHead({ kicker, title, children, id, aside }: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional drawing or note in the right-hand columns on desktop. */
  aside?: ReactNode;
}) {
  return (
    <header className="wrap grid gap-6 pt-[clamp(2.5rem,6vw,5rem)] pb-[clamp(1.5rem,3vw,2.5rem)] lg:grid-cols-12">
      <div className="lg:col-span-8">
        <p className="kicker">{kicker}</p>
        <h1 id={id} className="headline mt-3 [&_em]:text-accent [&_em]:italic">{title}</h1>
        {children ? <div className="prose-serif mt-5 max-w-(--measure) text-muted">{children}</div> : null}
      </div>
      {aside ? <div className="self-end lg:col-span-4 lg:justify-self-end">{aside}</div> : null}
    </header>
  );
}
