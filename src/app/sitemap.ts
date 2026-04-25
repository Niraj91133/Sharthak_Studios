import { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/server/publicSiteData";
import { SITE_URL } from "@/lib/site";
import { SEO_CITIES, SEO_SERVICES, buildCityPath, buildServiceCityPath, buildServicePath } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getAllBlogs();
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/locations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...SEO_SERVICES.map((service) => ({
      url: `${SITE_URL}${buildServicePath(service.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
    ...SEO_CITIES.map((city) => ({
      url: `${SITE_URL}${buildCityPath(city.slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.86,
    })),
    ...SEO_SERVICES.flatMap((service) =>
      SEO_CITIES.map((city) => ({
        url: `${SITE_URL}${buildServiceCityPath(service.slug, city.slug)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ),
    ...blogs.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.id}`,
      lastModified: blog.date ? new Date(blog.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
