import type { MetadataRoute } from "next";

const baseUrl = "https://modevz.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/technical-consulting`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/consultantz`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/devz`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/feed`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/feed/6`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/article/technology-adoption-cycle`, changeFrequency: "yearly", priority: 0.7 },
  ];
}
