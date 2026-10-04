export interface DataLog {
  timestamp: string; // YYYY.MM.DD_HH:MM
  text: string;
}

export default function DataLogs({ logs }: { logs: DataLog[] }) {
  return (
    <ul className="ml-6 mt-4 mb-4 max-w-[560px] nier-box p-3 text-sm">
      {logs.map((log) => (
        <li key={log.timestamp + log.text} className="nier-row mb-2 px-1">
          <span className="text-terminal-comment">
            TIMESTAMP: [{log.timestamp}]
          </span>
          <br />
          &gt; {log.text}
        </li>
      ))}
      <li className="text-terminal-comment">
        &gt; <span className="nier-blink">_</span>
      </li>
    </ul>
  );
}
