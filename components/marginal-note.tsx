import type { Marginalia } from '../content/trattoria';

/**
 * One of Nonna's handwritten notes. In the margin on desktop; an inset aside on small screens.
 * The handwriting is set at a readable size and the note is ordinary text for screen readers.
 */
export function MarginalNote({ note, className = '' }: { note: Marginalia; className?: string }) {
  return (
    <aside className={`marginalia border-l-2 border-dotted border-hand/50 bg-paper/70 px-4 py-3 lg:-rotate-1 lg:border-l-0 lg:bg-transparent lg:p-0 ${className}`}
      aria-label="A note from Nonna">
      <p>{note.text}</p>
      <span className="marginalia-sign">— Nonna</span>
    </aside>
  );
}
