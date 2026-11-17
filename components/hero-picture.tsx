import { asset } from '../lib/paths';

// The cover picture: the pasta board with a well of flour and eggs, a rolling pin, fresh tagliatelle,
// basil, a candle and a glass of red. One picture for "Sunday lunch" (light) and one by candlelight
// (dark); only the one for the current theme downloads (the hidden <img> is lazy and display:none).
// The day picture has a pure white background and is multiplied onto the page; the night picture has
// pure black and is screened onto it. Either way the background disappears into the linen or walnut,
// whatever the theme colours, with no visible box. After dark a soft glow flickers over the candle flame (it stops for visitors who
// prefer reduced motion). To replace the pictures, see README "Cover pictures".

const ALT = 'A wooden pasta board with a well of flour and egg yolks, a rolling pin, freshly cut tagliatelle, basil, a brass candlestick and a glass of red wine';
const WIDTH = 2400;
const HEIGHT = 1792;
const SIZES = '(min-width: 64rem) 46rem, 100vw';

function srcSet(theme: 'light' | 'dark') {
  return [
    `${asset(`/hero-${theme}-800.webp`)} 800w`,
    `${asset(`/hero-${theme}-1280.webp`)} 1280w`,
    `${asset(`/hero-${theme}-1600.webp`)} 1600w`,
    `${asset(`/hero-${theme}-2400.webp`)} 2400w`,
  ].join(', ');
}

export function HeroPicture() {
  return (
    <div className="hero-picture relative">
      <img src={asset('/hero-light-1280.webp')} srcSet={srcSet('light')} sizes={SIZES} width={WIDTH} height={HEIGHT}
        alt={ALT} loading="lazy" decoding="async" className="hero-picture-light block h-auto w-full mix-blend-multiply" />
      <img src={asset('/hero-dark-1280.webp')} srcSet={srcSet('dark')} sizes={SIZES} width={WIDTH} height={HEIGHT}
        alt={ALT} loading="lazy" decoding="async" className="hero-picture-dark h-auto w-full mix-blend-screen" />
      {/* Over the candle flame in the dark picture. Move it if a new picture puts the candle elsewhere. */}
      <span className="candle-light pointer-events-none absolute top-[6%] left-[22%] h-[22%] w-[14%]" aria-hidden="true" />
    </div>
  );
}
