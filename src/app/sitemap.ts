import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pharmacieaeria.ma";
  const sections = ["", "#pharmacie", "#services", "#parapharmacie", "#conseils", "#contact"];

  return sections.map((s, i) => ({
    url: `${base}/${s}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: i === 0 ? 1 : 0.8,
  }));
}
