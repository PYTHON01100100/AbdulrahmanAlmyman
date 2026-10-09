"use client";

import { useEffect, useState } from "react";

interface LocationBadgeProps {
  geo: string;
  hq: string;
}

// Status plate: fixed beside the theme toggle on large screens, inline on small ones.
// Fades out once the page is scrolled so it never sits over the content.
export default function LocationBadge({ geo, hq }: LocationBadgeProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={scrolled}
      className={`nier-box location-badge mx-6 mt-4 mb-2 w-fit px-3 py-2 text-xs leading-5 sm:text-sm lg:fixed lg:top-4 lg:right-32 lg:z-[60] lg:m-0 transition-opacity duration-200 ${
        scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <p>
        <span className="text-terminal-comment">GEO_LOCATION:</span>{" "}
        <span className="text-terminal-strong">{geo}</span>
      </p>
      <p>
        <span className="text-terminal-comment">HQ:</span>{" "}
        <span className="text-terminal-strong">{hq}</span>
      </p>
    </div>
  );
}
