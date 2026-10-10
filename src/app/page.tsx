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
    value: "https://drive.google.com/file/d/1K2lDxvyalavo-QJJIgDnzO189A0WtbJC/view",
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

// In-memory Intel entries, newest first. Add href to link to a case-study page.
const intelData: IntelEntry[] = [
  { id: "llm-serving-litellm-vllm-ack", title: "Serving Large Language Models at Scale with LiteLLM and vLLM on Alibaba Cloud ACK", date: "2026-10-22", description: "A multi-model, OpenAI-compatible inference platform on GPU nodes in ACK, with a downloadable draw.io diagram.", href: "/case-study/llm-serving-litellm-vllm-ack" },
  { id: "alb-in-ack", title: "Using ALB in Alibaba Container Service for Kubernetes", date: "2026-04-26", description: "Customize an Application Load Balancer and use it with Ingress or Gateway API on Alibaba cloud.", href: "/case-study/alb-in-ack" },
  { id: "homelab", title: "K3s Cluster Homelab", date: "2026-03-11", description: "Documenting my homelabbing journey! :)", href: "/case-study/homelab" },
  { id: "deployment-strategies", title: "Application Zero-Downtime Deployment Strategies", date: "2026-02-28", description: "We explore Rolling Updates, Canary Deployments, and Blue/Green Deployments", href: "/case-study/deployment-strategies" },
  { id: "k8s-adventures-pt2", title: "The end (?) of the Kubernetes learning journey", date: "2026-02-15", description: "After achieving Kubestronaut, am I done with Kubernetes?", href: "/case-study/k8s-adventures-pt2" },
  { id: "k8s-adventures", title: "The Kubernetes learning journey (so far)", date: "2025-11-22", description: "Sharing thoughts after getting into the administration side of K8s", href: "/case-study/k8s-adventures" },
  { id: "teamwork-and-collaboration", title: "Collaboration on GitHub", date: "2025-10-13", description: "A session I presented in DevOps bootcamp to help colleagues on how to efficiently collaborate on GitHub.", href: "/case-study/teamwork-and-collaboration" },
  { id: "author-clock", title: "Author Clock/Entertainment System", date: "2025-09-05", description: "Author Clock replica built on Raspberry Pi with YouTube, Spotify, and Kodi integration", href: "/case-study/author-clock" },
];

// Archives: only the portfolio has an internal page; the rest link out to GitHub.
const projectsData = getVisibleCaseStudies("project")?.filter(
  (project) => project.caseStudyId === "abdulrahman-almyman-portfolio",
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
        status="UNDER DEV"
        launch="18 NOV 2026"
      />
      {/* Large screen: centered container with max width */}
      <div className=" lg:flex lg:items-center lg:justify-center lg:min-h-[calc(100vh-4rem)] ">
        <div className="md:flex md:flex-wrap md:w-full lg:max-w-304 md:mx-auto max-h-fit">
          {/* About Section */}

          <div className="flex flex-col gap-2 justify-start items-start w-full md:w-1/2">
            <Section title="About" className="w-full lg:pl-4">
              <p className="nier-box ml-6 mt-4 mb-4 p-3 max-w-[560px] leading-5">
                Hi, I&apos;m{" "}
                <strong className="font-normal text-terminal-strong">
                  Abdulrahman Almyman 🙋🏽‍♂️😊&nbsp;
                </strong>
                a King Saud University graduate (2025) and an AI Engineer
                passionate about building intelligent systems,
                cloud infrastructure, and DevOps. I specialize in Alibaba Cloud,
                AWS, Azure, and GCP with hands-on expertise in Kubernetes and
                Docker. I love designing scalable, cloud-native architectures.
              </p>
            </Section>
            <Section title="Contact" className="lg:pl-4">
              <ContactList contacts={contactData} />
            </Section>
            <Section title="Data Logs" className="lg:pl-4">
              <DataLogs
                logs={[...dataLogs].sort((a, b) =>
                  b.timestamp.localeCompare(a.timestamp),
                )}
              />
            </Section>
            <Section title="InMemory Intel" className="lg:pl-4">
              <IntelList entries={intelData} />
            </Section>
          </div>
          {/* Projects Section */}
          <Section title="Archives" className="w-full md:w-1/2 lg:pl-4">
            <ArchiveList projects={projectsData} repos={archiveRepos} />
            <Section title="Certifications">
              <CertsList certs={certsData} />
            </Section>
          </Section>
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
