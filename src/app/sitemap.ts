import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";

export const dynamic = "force-static";

const SITE_URL = "https://www.abdulrahmanalmyman.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = (getAllCaseStudies() ?? [])
    .filter((study) => study.show)
    .map((study) => ({
      url: `${SITE_URL}/case-study/${study.caseStudyId}`,
      lastModified: new Date(study.date),
    }));
  return [{ url: `${SITE_URL}/`, lastModified: new Date() }, ...pages];
}
