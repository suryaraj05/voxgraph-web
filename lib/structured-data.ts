import { absoluteUrl, site } from "@/lib/site";

/** JSON-LD @graph for rich results and entity linking (Person ↔ Project ↔ WebSite). */
export function buildStructuredDataGraph() {
  const personId = `${site.url}#person`;
  const websiteId = `${site.url}#website`;
  const appId = `${site.url}#software`;
  const orgId = `${site.url}#opensource-project`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        alternateName: [...site.alternateNames],
        description: site.description,
        inLanguage: "en-US",
        publisher: { "@id": personId },
        creator: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.author,
        alternateName: [...site.authorAlternateNames, site.authorFullName],
        url: absoluteUrl("/about"),
        sameAs: [site.authorUrl, site.authorLinkedIn, site.github, site.githubWeb],
        jobTitle: "Software Developer",
        knowsAbout: [
          "Voice AI",
          "FastAPI",
          "WebSockets",
          "Deepgram",
          "Open Source",
          "Python",
        ],
        creator: { "@id": orgId },
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": orgId,
        name: site.name,
        alternateName: [...site.alternateNames],
        description: site.description,
        url: site.url,
        codeRepository: site.github,
        programmingLanguage: ["Python", "TypeScript"],
        license: "https://opensource.org/licenses/MIT",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
        author: { "@id": personId },
        maintainer: { "@id": personId },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": appId,
        name: site.name,
        alternateName: [...site.alternateNames],
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web, Windows, macOS, Linux",
        description: site.shortDescription,
        url: absoluteUrl("/try"),
        author: { "@id": personId },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Real-time WebSocket voice pipeline",
          "Deepgram speech-to-text",
          "Gemini and Ollama LLM support",
          "Deepgram Aura and ElevenLabs TTS",
          "Episodic and semantic memory",
          "Browser and terminal clients",
        ],
      },
    ],
  };
}
