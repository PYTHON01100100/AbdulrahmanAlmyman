interface LocationBadgeProps {
  geo: string;
  hq: string;
}

// Status plate: fixed beside the theme toggle on large screens, inline on small ones.
export default function LocationBadge({ geo, hq }: LocationBadgeProps) {
  return (
    <div className="nier-box mx-6 mt-4 mb-2 w-fit px-3 py-2 text-xs leading-5 sm:text-sm lg:fixed lg:top-4 lg:right-32 lg:z-[60] lg:m-0">
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
