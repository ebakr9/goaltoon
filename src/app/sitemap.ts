import { MetadataRoute } from "next";

const SITE_URL = "https://goaltoon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${SITE_URL}/groups`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/stats`,
      changeFrequency: "hourly",
      priority: 0.8,
    },
  ];
}
