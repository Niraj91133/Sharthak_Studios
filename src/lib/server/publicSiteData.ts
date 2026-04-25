import "server-only";

import { Blog } from "@/context/MediaContext";

function getSupabaseHeaders() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
  };
}

function normalizeBlog(input: Record<string, unknown>): Blog | null {
  const id = typeof input.id === "string" ? input.id : "";
  const title = typeof input.title === "string" ? input.title : "";
  const content = typeof input.content === "string" ? input.content : "";
  const image = typeof input.image === "string" ? input.image : "";
  const date = typeof input.date === "string" ? input.date : "";
  const category = typeof input.category === "string" ? input.category : "TIPS";
  const excerpt = typeof input.excerpt === "string" ? input.excerpt : "";

  if (!id || !title || !content) {
    return null;
  }

  return { id, title, content, image, date, category, excerpt };
}

export async function getAllBlogs(): Promise<Blog[]> {
  const config = getSupabaseHeaders();
  if (!config) return [];

  const res = await fetch(
    `${config.url}/rest/v1/blogs?select=*&order=date.desc`,
    {
      headers: config.headers,
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => normalizeBlog((item ?? {}) as Record<string, unknown>))
    .filter((item): item is Blog => Boolean(item));
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const blogs = await getAllBlogs();
  return blogs.find((blog) => blog.id === id) ?? null;
}
