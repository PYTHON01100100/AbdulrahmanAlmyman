import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import ThemeToggle from "@/app/components/ThemeToggle";
import { GoogleAnalytics } from "@next/third-parties/google";

const SITE_URL = "https://abdulrahmanalmyman.dev";
const SITE_TITLE = "Abdulrahman Almyman | عبدالرحمن الميمان";
const SITE_DESCRIPTION =
  "الموقع الشخصي للمهندس عبدالرحمن الميمان - متخصص في الذكاء الاصطناعي التوليدي، النماذج اللغوية الكبيرة، والحوسبة السحابية المتعددة. AI & DevOps Engineer specializing in GenAI, LLMOps, and Multi-Cloud architectures.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "عبدالرحمن الميمان",
    "عبد الرحمن الميمان",
    "Abdulrahman Almyman",
    "PYTHON01100100",
    "مهندس ذكاء اصطناعي",
    "الذكاء الاصطناعي التوليدي",
    "GenAI",
    "LLMOps",
    "DevOps Engineer",
    "Multi-Cloud",
    "خريج جامعة الملك سعود 2025",
    "King Saud University",
    "Alibaba Cloud",
    "AWS MLA-C01",
    "SCCC",
  ],
  authors: [{ name: "Abdulrahman Almyman (عبدالرحمن الميمان)", url: SITE_URL }],
  creator: "Abdulrahman Almyman",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description:
      "AI & DevOps Engineer specializing in GenAI, LLMOps, and Multi-Cloud architectures.",
    siteName: "Abdulrahman Almyman",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description:
      "AI & DevOps Engineer specializing in GenAI, LLMOps, and Multi-Cloud architectures.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdulrahman Almyman",
  alternateName: ["عبدالرحمن الميمان", "عبد الرحمن الميمان", "PYTHON01100100"],
  url: SITE_URL,
  jobTitle: "AI & DevOps Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "King Saud University",
    alternateName: "جامعة الملك سعود",
  },
  knowsAbout: ["Generative AI", "LLMOps", "Alibaba Cloud", "AWS", "Kubernetes", "Multi-Cloud"],
  sameAs: [
    "https://github.com/PYTHON01100100",
    "https://www.linkedin.com/in/abdulrahmanalmyman/",
    "https://x.com/PYTHON01100100",
    "https://huggingface.co/PYTHON01100100",
  ],
};

const Roboto = Roboto_Mono({
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultLang = "en";
  return (
    <html
      lang={defaultLang}
      className={Roboto.className}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <ThemeToggle />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-CWKB4GRTEB" />
    </html>
  );
}
