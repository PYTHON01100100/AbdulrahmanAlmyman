import Link from "next/link";

export interface IntelEntry {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  href?: string;
}

export default function IntelList({ entries }: { entries: IntelEntry[] }) {
  return (
    <div className="ml-6 mt-4 mb-4 max-w-[560px] flex flex-col gap-3">
      {entries.map((entry, index) => {
        const body = (
          <>
            <div className="flex justify-between gap-2 text-xs text-terminal-comment">
              <span>INMEMORY_{String(index + 1).padStart(3, "0")}</span>
              <span>{entry.date}</span>
            </div>
            <strong className="font-normal text-terminal-strong">
              {entry.title}
            </strong>
            <p className="mt-1 text-sm">{entry.description}</p>
            {entry.href && <span className="text-xs underline">&gt; ACCESS</span>}
          </>
        );
        return entry.href ? (
          <Link
            key={entry.id}
            href={entry.href}
            className="nier-box block p-3 leading-5"
          >
            {body}
          </Link>
        ) : (
          <div key={entry.id} className="nier-box p-3 leading-5">
            {body}
          </div>
        );
      })}
    </div>
  );
}
