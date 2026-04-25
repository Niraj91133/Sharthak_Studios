import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "@/components/blog/BlogPostClient";
import JsonLd from "@/components/JsonLd";
import { getAllBlogs, getBlogById } from "@/lib/server/publicSiteData";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { SITE_URL } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({ id: blog.id }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: {
      canonical: `/blog/${blog.id}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `${SITE_URL}/blog/${blog.id}`,
      images: blog.image ? [blog.image] : ["/opengraph-image.png"],
      type: "article",
    },
  };
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  const allBlogs = await getAllBlogs();
  const otherBlogs = allBlogs.filter((entry) => entry.id !== blog.id).slice(0, 4);
  const sanitizedHtml = sanitizeHtml(blog.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image ? [blog.image] : [`${SITE_URL}/opengraph-image.png`],
    datePublished: blog.date,
    dateModified: blog.date,
    author: {
      "@type": "Organization",
      name: "Sharthak Studio",
    },
    publisher: {
      "@type": "Organization",
      name: "Sharthak Studio",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${blog.id}`,
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <BlogPostClient blog={blog} otherBlogs={otherBlogs} html={sanitizedHtml} />
    </>
  );
}
