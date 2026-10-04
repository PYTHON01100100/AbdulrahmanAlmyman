import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "AbdulrahmanAlmyman",
  description:
    "الموقع الشخصي للمهندس عبدالرحمن الميمان - مبرمج ذكاء اصطناعي وحوسبة سحابية. Abdulrahman Almyman: AI & cloud engineer, King Saud University graduate 2025, Alibaba Cloud, AWS (MLA-C01), Kubernetes.",
  keywords: [
    "عبدالرحمن الميمان",
    "عبد الرحمن الميمان",
    "Abdulrahman Almyman",
    "PYTHON01100100",
    "مهندس ذكاء اصطناعي",
    "خريج جامعة الملك سعود 2025",
    "King Saud University",
    "Alibaba Cloud",
    "AWS MLA-C01",
    "SCCC",
  ],
  authors: [{ name: "عبدالرحمن الميمان" }],
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdulrahman Almyman",
  alternateName: ["عبدالرحمن الميمان", "عبد الرحمن الميمان", "PYTHON01100100"],
  jobTitle: "AI & Cloud Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "King Saud University",
    alternateName: "جامعة الملك سعود",
  },
  knowsAbout: ["Artificial Intelligence", "Alibaba Cloud", "AWS", "Kubernetes"],
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-CWKB4GRTEB" />
    </html>
  );
}
