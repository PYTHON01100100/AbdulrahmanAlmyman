interface CertsListProps {
  certs: Certification[];
  className?: string;
}

export interface Certification {
  certification: string;
  provider: string;
  wip?: boolean;
  order: number;
  date: string;
  url?: string;
}

export default function CertsList({ certs, className = "" }: CertsListProps) {
  return (
    <ul className={`ml-6 mt-4 mb-4 max-w-[560px] flex flex-col gap-2 ${className}`}>
      {[...certs]
        .sort((a, b) => b.order - a.order)
        .map((cert) => {
          const body = (
            <>
              <span className="block text-xs text-terminal-comment">
                [ {cert.provider} ]{cert.wip && " - IN PROGRESS"}
              </span>
              {cert.certification}
            </>
          );
          return (
            <li key={cert.certification}>
              {cert.url ? (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nier-box block px-3 py-2"
                >
                  {body}
                </a>
              ) : (
                <div className="nier-box px-3 py-2">{body}</div>
              )}
            </li>
          );
        })}
    </ul>
  );
}
