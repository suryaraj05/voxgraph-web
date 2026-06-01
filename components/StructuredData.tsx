import { buildStructuredDataGraph } from "@/lib/structured-data";

export function StructuredData() {
  const graph = buildStructuredDataGraph();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
