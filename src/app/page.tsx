import Layout from "@/app/components/Layout";
import Section from "@/app/components/Section";
import ContactList from "@/app/components/ContactList";
import LocationBadge from "@/app/components/LocationBadge";
import CertsList, { Certification } from "@/app/components/CertsList";
import IntelList, { IntelEntry } from "@/app/components/IntelList";
import ArchiveList, { ExternalRepo } from "@/app/components/ArchiveList";
import DataLogs, { DataLog } from "@/app/components/DataLogs";
// import StatusComment from "@/app/components/StatusComment";
import { getVisibleCaseStudies } from "@/lib/case-studies";

const contactData = [
  {
    label: "Resume/CV",
    value: "/resume/AbdulrahmanAlmyman_CV.pdf",
    showAs: "resume",
  },
  {
    label: "Email",
    value: "mailto:abdulrahmanalmyman@gmail.com",
    showAs: "abdulrahmanalmyman@gmail.com",
  },
  {
    label: "GitHub",
    value: "https://github.com/PYTHON01100100",
    showAs: "github/PYTHON01100100",
  },
  {
    label: "LinkedIn",
    value: "https://www.linkedin.com/in/abdulrahmanalmyman/",
    showAs: "linkedin/abdulrahmanalmyman",
  },
  {
    label: "X",
    value: "https://x.com/PYTHON01100100",
    showAs: "x/PYTHON01100100",
  },
  {
    label: "HuggingFace",
    value: "https://huggingface.co/PYTHON01100100",
    showAs: "huggingface/PYTHON01100100",
  },
];

const certsData: Certification[] = [
  {
    certification: "AWS ML Engineer - Associate",
    provider: "AWS",
    date: "Sep 2026",
    order: 2,
    wip: false,
    url: "https://cp.certmetrics.com/amazon/en/public/verify/credential/7ed088bc294b40e6b7594ef53d34a407",
  },
  {
    certification: "ACA Cloud Computing Certification",
    provider: "Alibaba Cloud",
    date: "2026",
    order: 1,
    wip: false,
  },
];

// Rolling micro-updates. Any order: they are sorted newest first on render.
const dataLogs: DataLog[] = [
  { timestamp: "2026.11.17_12:00", text: "Field report archived: \"Beyond the Profile\". Visual records from the Italy expedition decoded: coastal route Santa Margherita Ligure → Portofino, and The School of Athens in Vatican City. Link to Cloud & AI research: confirmed.", href: "/case-study/beyond-the-profile" },
  // Timeline, recorded in the style of a 9S field report.
  { timestamp: "2025.09.01_00:00", text: "Redeployment confirmed. Unit returned to SCCC, the same organization, now designated: AI Engineer. Combat readiness: elevated.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7367876038896377856/" },
  { timestamp: "2025.07.10_00:00", text: "Co-op deployment at SCCC, Alibaba Cloud division, concluded. Field data archived. Mission result: successful.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7360680559204823042/" },
  { timestamp: "2025.05.28_00:00", text: "Academic program complete. King Saud University: graduation confirmed. Status of unit upgraded to: GRADUATE.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7333885466775056385/" },
  { timestamp: "2025.01.12_00:00", text: "Co-op unit activated at SCCC, Alibaba Cloud division. First contact with large-scale cloud infrastructure established.", href: "https://www.linkedin.com/feed/update/urn:li:activity:7284174404584886272/" },
  { timestamp: "2022.01.06_00:00", text: "Anomaly resolved. After a prolonged struggle against hostile GPA readings, the unit has finally entered the Computer Science program. Objective re-aligned." },
  { timestamp: "2021.06.27_00:00", text: "Unit relocated to Egypt. Route deviation recorded. Duration: extended. Reason: classified." },
  { timestamp: "2019.09.02_00:00", text: "Record 001: unit enrolled at King Saud University. Initial deployment begins. All systems nominal." },
  { timestamp: "2026.11.18_00:00", text: "Mission Log: Relocation protocol SUCCESSFUL. Current grid coordinated to the United Kingdom 🇬🇧. Initializing system integration with global tech nodes and sync complete." },
  { timestamp: "2026.11.18_00:00", text: "SCHEDULED: Travel sequence initiated. Destination: United Kingdom 🇬🇧." },
  { timestamp: "2026.11.17_00:00", text: "SCHEDULED: Portfolio deployment in NieR interface." },
  { timestamp: "2026.10.10_00:00", text: "Playing Hollow Knight: Silksong. Learning Go." },
  { timestamp: "2026.10.01_00:00", text: "Learning Bifrost." },
  { timestamp: "2026.09.11_00:00", text: "AWS Certified ML Engineer - Associate added to records." },
  { timestamp: "2026.06.24_14:20", text: "Geo Log: Infiltrating the Vatican City node 🇻🇦 during the Italy expedition. Anomalous historical architecture detected. System inspiration levels: MAX." },
  { timestamp: "2026.06.20_11:45", text: "Geo Log: Phase 2 initialized. Landed on Italian territories 🇮🇹. Commencing cultural data extraction and environmental sync." },
  { timestamp: "2026.07.06_18:30", text: "Mission Log: European reconnaissance phase 1 complete. Initiating relocation protocol back to Riyadh HQ 🇸🇦." },
  { timestamp: "2026.07.01_09:15", text: "Geo Log: Boundary breach successful. Arrived at the Switzerland node 🇨🇭. Mapping alpine environments and grid stabilization." },
];

// In-memory Intel entries. Any order here: they are sorted newest first on render.
// Add href to link to a case-study page.
const intelData: IntelEntry[] = [
  { id: "train-cv-model-oss", title: "Training an Image Classifier on Alibaba Cloud with Data in OSS", date: "2026-10-27", description: "Classifying 9 types of Saudi dates on CPU, pre-downloading vs. streaming the data from OSS, and when to use each.", href: "/case-study/train-cv-model-oss" },
  { id: "aws-alibaba-ipsec-direct-vpc", title: "AWS to Alibaba Cloud IPsec VPN, Direct to the VPC (No Transit Router)", date: "2026-10-25", description: "The simpler version of my site-to-site VPN lab: tunnels straight into the VPC, with BGP and the Bad Peer AS fix.", href: "/case-study/aws-alibaba-ipsec-direct-vpc" },
  { id: "devices-and-programs-i-use", title: "Devices and Programs I Use", date: "2025-01-01", description: "An ever-updating list of the devices, operating systems and programs I use and recommend.", href: "/case-study/devices-and-programs-i-use" },
  { id: "my-path-to-linux", title: "My Path to Linux: From Curiosity to Freedom", date: "2026-10-22", description: "My journey through Linux, open source, cloud engineering, AI, gaming and desktop customization, and which distro I would recommend to you.", href: "/case-study/my-path-to-linux" },
  { id: "aws-alibaba-ipsec-vpn", title: "Connecting AWS and Alibaba Cloud with Site-to-Site IPsec VPN, BGP and a Transit Router", date: "2026-10-21", description: "A step-by-step lab with the IP plan, route tables, Cloud Firewall, and every IPsec and BGP problem I had to fix.", href: "/case-study/aws-alibaba-ipsec-vpn" },
  { id: "wsl-guide", title: "WSL: Use Linux on Windows Without a Virtual Machine", date: "2026-10-16", description: "What WSL solves, how to install it, try Ubuntu, Arch, Fedora and Kali, and use it for DevOps and GPU-accelerated AI.", href: "/case-study/wsl-guide" },
  { id: "distrobox-guide", title: "Distrobox: Any Linux Distro Inside Your Terminal", date: "2026-10-16", description: "What Distrobox solves, how to install it with apt, dnf and pacman, run GUI apps, and build a toolbox for cloud work.", href: "/case-study/distrobox-guide" },
  { id: "llm-serving-litellm-vllm-ack", title: "Serving Large Language Models with LiteLLM and vLLM on Alibaba Cloud ACK", date: "2026-11-18", description: "A multi-model, OpenAI-compatible inference platform on GPU nodes in ACK, with a downloadable draw.io diagram.", href: "/case-study/llm-serving-litellm-vllm-ack" },
];

// Archives: the portfolio and the profile README article have internal pages; the rest link out to GitHub.
const projectsData = getVisibleCaseStudies("project")?.filter(
  (project) =>
    ["abdulrahman-almyman-portfolio", "github-profile-readme"].includes(
      project.caseStudyId,
    ),
);

const archiveRepos: ExternalRepo[] = [
  { name: "a1s", href: "https://github.com/PYTHON01100100/a1s" },
  { name: "BucketOps", href: "https://github.com/PYTHON01100100/BucketOps" },
  { name: "ec2s", href: "https://github.com/PYTHON01100100/ec2s" },
];

export default function Home() {
  if (!projectsData) return <p>Error occurred with projects data.</p>;
  return (
    <Layout className="text-base sm:text-lg px-6 py-5 md:px-8 md:py-8">
      <LocationBadge
        geo="London, UK"
        hq="SCCC by stc"
      />
      {/* Large screen: centered container with max width */}
      <div className=" lg:flex lg:items-center lg:justify-center lg:min-h-[calc(100vh-4rem)] ">
        <div className="md:flex md:flex-wrap md:w-full lg:max-w-304 md:mx-auto max-h-fit">
          {/* About Section */}

          <div className="flex flex-col gap-2 justify-start items-start w-full md:w-1/2">
            <Section title="About" className="w-full lg:pl-4">
              <div className="nier-box ml-6 mt-4 mb-4 p-3 max-w-[560px] leading-5">
                <p className="text-terminal-comment mb-2">
                  [ SYSTEM ARCHIVE // PERSONAL RECORD ]
                </p>
                <p>
                  <span className="text-terminal-comment">&gt; IDENTITY:</span>{" "}
                  <span className="text-terminal-strong">ABDULRAHMAN ALMYMAN</span>
                </p>
                <p>
                  <span className="text-terminal-comment">&gt; STATUS:</span>{" "}
                  <span className="text-terminal-strong">ACTIVE</span>
                </p>
                <p className="mb-3">
                  <span className="text-terminal-comment">&gt; CLASS:</span>{" "}
                  <span className="text-terminal-strong">AI / CLOUD ENGINEER</span>
                </p>
                <p className="mb-3">
                  Hi (^-^)/ I&apos;m{" "}
                  <strong className="font-normal text-terminal-strong">
                    Abdulrahman Almyman
                  </strong>
                  , a King Saud University graduate (2025) &amp; an AI Engineer
                  driven by curiosity &amp; the pursuit of intelligent systems.
                  I&apos;m currently working @ SCCC by stc.
                </p>
                <p className="mb-3">
                  My expertise spans Alibaba Cloud, AWS, Azure &amp; GCP, with
                  hands-on experience in Kubernetes, Docker &amp; DevOps.
                </p>
                <p className="mb-3">
                  I build scalable, cloud-native architectures &amp; explore the
                  boundaries of AI engineering.
                </p>
                <p className="text-terminal-comment">
                  &gt; END OF RECORD<span className="nier-blink">_</span>
                </p>
              </div>
            </Section>
            <Section title="Contact" className="lg:pl-4">
              <ContactList contacts={contactData} />
            </Section>
            <Section title="InMemory Intel" className="lg:pl-4">
              <IntelList
                entries={[...intelData].sort((a, b) => b.date.localeCompare(a.date))}
              />
            </Section>
          </div>
          {/* Right column: Archives, Certifications, Data Logs */}
          <div className="flex flex-col gap-2 justify-start items-start w-full md:w-1/2">
            <Section title="Archives" className="w-full lg:pl-4">
              <ArchiveList projects={projectsData} repos={archiveRepos} />
            </Section>
            <Section title="Certifications" className="w-full lg:pl-4">
              <CertsList certs={certsData} />
            </Section>
            <Section title="Data Logs" className="w-full lg:pl-4">
              <DataLogs
                logs={[...dataLogs].sort((a, b) =>
                  b.timestamp.localeCompare(a.timestamp),
                )}
              />
            </Section>
          </div>
          {/* Status/Notes Section */}

          {/* <section className="xl:w-full mb-4">
            <div className="ml-6 mt-4 mb-4 md:ml-6 text-sm lg:text-base">
              <StatusComment>
                Currently seeking opportunities in System Administration, Cloud
                Engineering and DevOps roles
              </StatusComment>
            </div>
          </section> */}
        </div>
      </div>
    </Layout>
  );
}
