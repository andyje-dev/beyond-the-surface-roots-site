import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config/site";

export async function GET(context: APIContext) {
  const curation = await getCollection("curation");

  const items = [
    ...curation.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/curation/${entry.id}`,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: site.title,
    description: site.description,
    site: context.site?.toString() ?? site.url,
    items,
  });
}
