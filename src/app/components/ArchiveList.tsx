import Link from "next/link";
import { CaseStudy } from "../types";

export interface ExternalRepo {
  name: string;
  href: string;
}

interface ArchiveListProps {
  projects: CaseStudy[];
  repos?: ExternalRepo[];
}

export default function ArchiveList({ projects, repos = [] }: ArchiveListProps) {
  return (
    <div className="ml-6 mt-4 mb-4 max-w-[560px] nier-box p-3 text-sm">
      <p className="text-terminal-comment mb-2">
        root@archive:~$ ls -l /archives
      </p>
      <ul>
        {projects.map((project) => (
          <li key={project.caseStudyId} className="mb-1">
            <Link
              href={`/case-study/${project.caseStudyId}`}
              className="nier-row flex gap-2 px-1"
            >
              <span className="text-terminal-comment shrink-0">drwxr-xr-x</span>
              <span className="truncate">{project.caseStudyId}/</span>
              <span className="ml-auto shrink-0 text-terminal-comment">
                {project.date}
              </span>
            </Link>
          </li>
        ))}
        {repos.map((repo) => (
          <li key={repo.href} className="mb-1">
            <a
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nier-row flex gap-2 px-1"
            >
              <span className="text-terminal-comment shrink-0">lrwxr-xr-x</span>
              <span className="truncate">{repo.name}/</span>
              <span className="ml-auto shrink-0 text-terminal-comment">
                github ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-terminal-comment">
        {projects.length + repos.length} entries
        <span className="nier-blink">_</span>
      </p>
    </div>
  );
}
