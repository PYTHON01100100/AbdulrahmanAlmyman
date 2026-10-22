"use client";

import { useEffect, useState } from "react";

interface LocationBadgeProps {
  geo: string;
  hq: string;
  timeZone?: string;
}

interface Clock {
  time: string;
  zone: string;
  gregorian: string;
  hijri: string;
}

function readClock(timeZone: string): Clock {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);
  const zone =
    new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value ?? "";
  const gregorian = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(now);
  const hijri = new Intl.DateTimeFormat("en-GB-u-ca-islamic-umalqura", {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  return { time, zone, gregorian, hijri };
}

// Status plate: fixed beside the theme toggle on large screens, inline on small ones.
// Fades out once the page is scrolled so it never sits over the content.
export default function LocationBadge({
  geo,
  hq,
  timeZone = "Europe/London",
}: LocationBadgeProps) {
  const [scrolled, setScrolled] = useState(false);
  // Filled in after mount: the static HTML has no clock, so there is no hydration mismatch.
  const [clock, setClock] = useState<Clock | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => setClock(readClock(timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

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
        <span className="text-terminal-comment">TIME:</span>{" "}
        <span className="text-terminal-strong tabular-nums">
          {clock ? `${clock.time} ${clock.zone}` : "--:--:-- --"}
        </span>
        <span className="nier-blink">_</span>
      </p>
      <p>
        <span className="text-terminal-comment">DATE:</span>{" "}
        <span className="text-terminal-strong">
          {clock ? clock.gregorian : "--"}
        </span>
      </p>
      <p>
        <span className="text-terminal-comment">HIJRI:</span>{" "}
        <span className="text-terminal-strong">
          {clock ? clock.hijri : "--"}
        </span>
      </p>
      <p>
        <span className="text-terminal-comment">HQ:</span>{" "}
        <span className="text-terminal-strong">{hq}</span>
      </p>
    </div>
  );
}
