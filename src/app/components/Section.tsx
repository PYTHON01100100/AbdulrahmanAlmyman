import type React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

// Section title styled like a YoRHa menu header: a solid bar with a small
// diamond marker, followed by the dotted rule that runs through the NieR menus.
export default function Section({
  title,
  children,
  className = "",
  titleClassName = "",
}: SectionProps) {
  return (
    <section className={`xl:pr-4 mb-4 max-h-fit ${className}`}>
      <h1 className={`nier-heading ml-6 mb-3 max-w-[560px] ${titleClassName}`}>
        <span className="nier-heading-tag">{title}</span>
        <span className="nier-heading-dots" aria-hidden="true" />
      </h1>
      {children}
    </section>
  );
}
