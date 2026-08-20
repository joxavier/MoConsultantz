import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/devz/dashboard/", "/moos/domin8AI/demo/"] },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap: "https://modevz.ca/sitemap.xml",
    host: "https://modevz.ca",
  };
}
