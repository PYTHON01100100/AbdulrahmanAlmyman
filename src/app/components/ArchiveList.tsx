import Link from "next/link";
import { CaseStudy } from "../types";

export default function ArchiveList({ projects }: { projects: CaseStudy[] }) {
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
      </ul>
      <p className="mt-2 text-terminal-comment">
        {projects.length} entries<span className="nier-blink">_</span>
      </p>
    </div>
  );
}
