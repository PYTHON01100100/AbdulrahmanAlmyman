"use client";

import { useRef, useState, type ReactNode } from "react";

interface CodeBlockProps {
  children?: ReactNode;
  language?: string;
  title?: string;
  download?: string;
  where?: "host" | "box";
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
};

// cube: a container
const BoxIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3 3 7.5v9L12 21l9-4.5v-9z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </svg>
);

// monitor: the host machine
const HostIcon = () => (
  <svg {...iconProps}>
    <path d="M3 4h18v12H3zM8 20h8M12 16v4" />
  </svg>
);

export default function CodeBlock({
  children,
  language,
  title,
  download,
  where,
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context / denied) */
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span className="code-block-label">
          {where && (
            <span className="code-block-where" title={where === "box" ? "Run inside the Distrobox container" : "Run on your host"}>
              {where === "box" ? <BoxIcon /> : <HostIcon />}
              {where === "box" ? "IN THE BOX" : "ON THE HOST"}
              {" · "}
            </span>
          )}
          {title || language || "code"}
        </span>
        <span className="code-block-actions">
          <button type="button" onClick={copy} aria-label="Copy code">
            {copied ? "[ copied ]" : "[ copy ]"}
          </button>
          {download && (
            <a
              href={download}
              download={download.split("/").pop()}
              target="_self"
            >
              [ download ]
            </a>
          )}
        </span>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
