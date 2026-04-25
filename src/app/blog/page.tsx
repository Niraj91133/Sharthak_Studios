import type { Metadata } from "next";
import BlogListingClient from "@/components/blog/BlogListingClient";
import { getAllBlogs } from "@/lib/server/publicSiteData";

export const metadata: Metadata = {
  title: "Wedding Photography Journal | Sharthak Studio",
  description:
    "Wedding photography tips, cinematic stories, locations, and shoot ideas from Sharthak Studio in Gaya, Bihar.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogListing() {
  const blogs = await getAllBlogs();
  return <BlogListingClient blogs={blogs} />;
}
