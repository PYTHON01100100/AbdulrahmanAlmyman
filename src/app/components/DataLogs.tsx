"use client";

import { useState } from "react";

export interface DataLog {
  timestamp: string; // YYYY.MM.DD_HH:MM
  text: string;
  href?: string; // optional source link
}

const PAGE_SIZE = 5;

export default function DataLogs({ logs }: { logs: DataLog[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = logs.slice(0, visible);
  const hasMore = visible < logs.length;

  return (
    <ul className="ml-6 mt-4 mb-4 max-w-[560px] nier-box p-3 text-sm">
      {shown.map((log) => (
        <li key={log.timestamp + log.text} className="nier-row mb-2 px-1">
          <span className="text-terminal-comment">
            TIMESTAMP: [{log.timestamp}]
          </span>
          <br />
          &gt; {log.text}
          {log.href && (
            <>
              {" "}
              <a
                href={log.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                [ SOURCE ]
              </a>
            </>
          )}
        </li>
      ))}
      <li className="mt-3 flex items-center justify-between gap-2 text-terminal-comment">
        <span>
          &gt; {shown.length}/{logs.length} logs
          <span className="nier-blink">_</span>
        </span>
        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="nier-box px-2 py-0.5 cursor-pointer"
          >
            [ LOAD MORE ]
          </button>
        ) : (
          logs.length > PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setVisible(PAGE_SIZE)}
              className="nier-box px-2 py-0.5 cursor-pointer"
            >
              [ COLLAPSE ]
            </button>
          )
        )}
      </li>
    </ul>
  );
}
