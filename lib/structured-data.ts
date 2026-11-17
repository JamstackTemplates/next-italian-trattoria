import { menu } from '../content/menu';
import { trattoria } from '../content/trattoria';
import { absoluteUrl } from './paths';

const SCHEMA_DAYS = { Monday: 'Mo', Tuesday: 'Tu', Wednesday: 'We', Thursday: 'Th', Friday: 'Fr', Saturday: 'Sa', Sunday: 'Su' } as const;

/** schema.org Restaurant for search engines and maps. Built from the same content as the pages. */
export function restaurantStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: trattoria.name,
    description: trattoria.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    email: trattoria.email,
    ...(trattoria.phone ? { telephone: trattoria.phone } : {}),
    servesCuisine: 'Italian',
    priceRange: '$$',
    currenciesAccepted: menu.currency,
    // Small tables walk in; large tables and private dining go through a Contact enquiry.
    acceptsReservations: false,
    address: {
      '@type': 'PostalAddress',
      streetAddress: trattoria.address.street,
      addressLocality: trattoria.address.locality,
      addressRegion: trattoria.address.region,
      postalCode: trattoria.address.postalCode,
      addressCountry: trattoria.address.country,
    },
    openingHours: trattoria.hours.flatMap(entry =>
      entry.services.map(service => `${SCHEMA_DAYS[entry.day]} ${service.opens}-${service.closes}`)),
    sameAs: trattoria.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
