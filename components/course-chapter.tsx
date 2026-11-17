import type { Course, Dish } from '../content/menu';
import { noteFor } from '../content/trattoria';
import { CourseArt } from './course-art';
import { DishEntry, FeaturedDish, filterAttributes } from './dish-entry';
import { MarginalNote } from './marginal-note';

/** Pairs of dishes for the two-column flow, so each row's margin can hold a note beside its dishes. */
function rows(dishes: Dish[]): Dish[][] {
  const out: Dish[][] = [];
  for (let i = 0; i < dishes.length; i += 2) out.push(dishes.slice(i, i + 2));
  return out;
}

function Notes({ dishes }: { dishes: Dish[] }) {
  return dishes.map(dish => {
    const note = noteFor(dish.id);
    return note ? <div key={dish.id} {...filterAttributes([dish])}><MarginalNote note={note} /></div> : null;
  });
}

/**
 * A course as a chapter of the feature: a small numeral, the course name set huge in italic across
 * the grid, a drawing and a standfirst, then the dishes. Featured dishes run across the columns; the
 * rest follow in two columns, with Nonna's notes in the right margin beside their dishes.
 */
export function CourseChapter({ course }: { course: Course }) {
  const featured = course.dishes.filter(dish => dish.featured);
  const rest = course.dishes.filter(dish => !dish.featured);
  return (
    <section id={course.id} className="chapter wrap mt-(--space-section)" aria-labelledby={`${course.id}-title`}>
      <header className="grid items-end gap-x-8 gap-y-3 lg:grid-cols-12">
        <p className="chapter-numeral lg:col-span-12">{course.numeral} <span className="kicker ml-2 align-middle">{course.subtitle}</span></p>
        <h2 id={`${course.id}-title`} className="chapter-title lg:col-span-9 lg:-ml-[.04em]">{course.title}</h2>
        <CourseArt art={course.art} size={120} className="hidden justify-self-end lg:col-span-3 lg:block" />
        <p className="prose-serif mt-2 max-w-(--measure) text-muted lg:col-span-6 lg:col-start-4 lg:mt-5">{course.description}</p>
      </header>

      <div className="mt-8 grid gap-8">
        {featured.map(dish => {
          const note = noteFor(dish.id);
          return (
            <div key={dish.id} className="grid gap-x-10 gap-y-4 lg:grid-cols-[minmax(0,1fr)_13rem]" {...filterAttributes([dish])}>
              <FeaturedDish dish={dish} art={course.art} />
              {note ? <MarginalNote note={note} className="self-center" /> : null}
            </div>
          );
        })}
        {rows(rest).map(pair => (
          <div key={pair[0].id} className="grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_13rem]" {...filterAttributes(pair)}>
            {pair.map(dish => <DishEntry key={dish.id} dish={dish} />)}
            {pair.length === 1 ? <div className="max-lg:hidden" aria-hidden="true" /> : null}
            <div className="grid content-start gap-4 md:col-span-2 lg:col-span-1 lg:pt-5"><Notes dishes={pair} /></div>
          </div>
        ))}
        <p className="chapter-empty prose-serif border-t border-line pt-4 text-muted italic">
          Nothing in this course matches that filter tonight — ask us, the kitchen can often adapt a dish.
        </p>
      </div>
    </section>
  );
}
