import type { MetadataRoute } from "next";

const baseUrl = "https://modevz.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/technical-consulting`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/plans`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/plans/technical-clarity`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/plans/growth-systems`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/plans/digital-transformation`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/consultantz`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/devz`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/vestmentz/smart-contracts`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/feed`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/feed/3`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/feed/6`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/articles/tech-adoption-cycle`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${baseUrl}/consultantz/team/joxavier`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
