import { useEffect, useRef, useState } from "react";

interface Logo {
  name: string;
  href: string;
  img: string;
  abbr?: string;
}

const logos: Logo[] = [
  { name: "NCR", href: "https://www.ncr.com", img: "/qualifications/NCR.png" },
  {
    name: "Manulife",
    href: "https://www.manulife.ca",
    img: "/qualifications/manulife.png",
  },
  {
    name: "Best Buy",
    href: "https://www.bestbuy.ca",
    img: "/qualifications/bestbuy.png",
  },
  {
    name: "University of Waterloo",
    href: "https://uwaterloo.ca",
    img: "/qualifications/UW.png",
  },
  {
    name: "Wilfrid Laurier University",
    href: "https://wlu.ca",
    img: "/qualifications/WLU.jpg",
  },
  {
    name: "Metaparlour",
    href: "https://metaparlour.io",
    img: "/qualifications/metaparlour.png",
  },
  {
    name: "Nissan Canada",
    href: "https://www.nissan.ca",
    img: "/qualifications/nissan.jpg",
  },
  {
    name: "LA Fitness",
    href: "https://www.lafitness.com",
    img: "/qualifications/LAFitness.png",
  },
];

// Repeat the base logo set so one loop is always wider than the viewport.
const BASE_REPEAT = 3;
const baseSet = Array.from({ length: BASE_REPEAT }, () => logos).flat();

export function CredibilityBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(40);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // The track contains two identical halves, so half its width is one loop.
    const setWidth = track.scrollWidth / 2;
    // ~45 px/s gives a calm, readable cadence; cap minimum so tiny loops don't blur.
    const speed = 45;
    setDuration(Math.max(setWidth / speed, 24));
  }, []);

  return (
    <section className="w-full border-y border-border bg-muted/30 py-10">
      <style jsx global>{`
        @keyframes horizontal-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .horizontal-scroll-track {
          width: max-content;
          animation: horizontal-scroll 40s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .horizontal-scroll-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
      <div className="group relative h-[120px] overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

        <div
          ref={trackRef}
          className="horizontal-scroll-track flex flex-nowrap items-center will-change-transform group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${duration}s` }}
        >
          {Array.from({ length: 2 }).map((_, groupIndex) => (
           <div
  key={groupIndex}
  className="flex shrink-0 flex-nowrap items-center gap-10 pr-10"
>
  {baseSet.map((logo, index) => (
    <a
      key={`${logo.name}-${groupIndex}-${index}`}
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/logo flex shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:bg-muted/50"
      aria-label={`${logo.name} website`}
    >
      <div className="flex h-10 w-10 items-center justify-center">
        {logo.img && !imgError ? (
          <img
            src={logo.img}
            alt={logo.name}
            className="h-8 w-auto max-w-[100px] rounded object-contain grayscale transition-all duration-300 group-hover/logo:grayscale-0"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground transition-colors duration-300 group-hover/logo:bg-primary/10 group-hover/logo:text-primary">
            {(logo.abbr ?? logo.name.slice(0, 1)).toUpperCase()}
          </span>
        )}
      </div>

      <span className="mt-2 text-center text-sm font-semibold tracking-tight text-foreground/50 transition-colors duration-300 group-hover/logo:text-foreground">
        {logo.name}
      </span>
    </a>
  ))}
</div>
          ))}
        </div>
      </div>
    </section>
  );
}
