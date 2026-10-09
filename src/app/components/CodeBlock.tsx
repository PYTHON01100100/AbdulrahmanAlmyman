"use client";

import { useRef, useState, type ReactNode } from "react";

interface CodeBlockProps {
  children?: ReactNode;
  language?: string;
  title?: string;
  download?: string;
}

export default function CodeBlock({
  children,
  language,
  title,
  download,
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
        <span className="code-block-label">{title || language || "code"}</span>
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
