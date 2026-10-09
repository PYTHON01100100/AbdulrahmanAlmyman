"use client";
import Layout from "@/app/components/Layout";
import BackLink from "@/app/components/BackLink";
import TerminalImage from "@/app/components/TerminalImage";
import CodeBlock from "@/app/components/CodeBlock";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import NotFound from "@/app/not-found";
import { CaseStudy } from "@/app/types";
const DEAD_REGION = "me-south-1";
export const inDeadRegion = (imageSrc: string) => {
  return imageSrc.includes(DEAD_REGION);
};
interface CaseStudyProps {
  caseStudy: CaseStudy & { content: string };
}

export default function CaseStudyClient({ caseStudy }: CaseStudyProps) {
  // Site may be served from a sub-path (GitHub Pages), so root-relative asset
  // URLs in the markdown are prefixed with whatever precedes /case-study.
  const [base, setBase] = useState("");
  useEffect(() => {
    const i = window.location.pathname.indexOf("/case-study");
    if (i > 0) setBase(window.location.pathname.slice(0, i));
  }, []);
  const withBase = (url?: string | Blob) =>
    typeof url === "string" && url.startsWith("/") && !url.startsWith("//")
      ? base + url
      : url;

  useEffect(() => {
    if (!caseStudy?.name) return;
    document.title = caseStudy.name;
  }, [caseStudy]);

  if (!caseStudy) return NotFound({ message: "Case Study not found" });
  return (
    <Layout>
      <div className="max-w-4xl xl:max-w-304 mx-auto p-8 relative">
        <BackLink
          href="/"
          className="sticky top-0 left-0 bg-terminal-bg w-full pb-5 pt-4 z-50 border-b-terminal-comment rounded-sm border-1 border-t-0 border-l-0 border-r-0"
        >
          ← Back to Portfolio
        </BackLink>

        <div className="markdown-content prose prose-invert">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypePrism]}
            components={{
              img: (props) => {
                return inDeadRegion(props.src?.toString() + "")
                  ? null
                  : TerminalImage({ ...props, src: withBase(props.src) });
              },
              pre: ({ node, children }) => {
                const code = node?.children?.[0] as
                  | {
                      properties?: { className?: string[] };
                      data?: { meta?: string };
                    }
                  | undefined;
                const language = code?.properties?.className
                  ?.find((c) => c.startsWith("language-"))
                  ?.slice("language-".length);
                const meta = code?.data?.meta ?? "";
                const attr = (name: string) =>
                  meta.match(new RegExp(`${name}="([^"]+)"`))?.[1];
                return (
                  <CodeBlock
                    language={language}
                    title={attr("title")}
                    download={withBase(attr("download")) as string | undefined}
                  >
                    {children}
                  </CodeBlock>
                );
              },
              p: "div",
              a: (props) => {
                return (
                  <a
                    {...props}
                    href={withBase(props.href) as string | undefined}
                    target={props.download !== undefined ? undefined : "_blank"}
                  >
                    {props.children}
                  </a>
                );
              },
            }}
          >
            {caseStudy.content}
          </Markdown>
        </div>

        {caseStudy.images?.some(
          (project_image) => project_image.url.length > 1,
        ) && (
          <div className="markdown-content">
            <h2>Screenshots</h2>
            {caseStudy.images.map((image) =>
              image.url.length > 0 ? (
                <TerminalImage
                  key={image.url}
                  src={image.url}
                  alt={image["alt-text"]}
                  caption={image.caption}
                  width={600}
                  height={400}
                />
              ) : null,
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
