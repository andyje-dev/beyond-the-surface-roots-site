import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const stage = z.enum(["seed", "growing", "harvest"]);

const curation = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/curation" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    domains: z.array(z.string()).min(1),
    description: z.string(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          authors: z.string(),
          url: z.string().url(),
          journal: z.string().optional(),
          year: z.number(),
        }),
      )
      .optional(),
    stage: stage.default("seed"),
    connections: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const exploration = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/exploration" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    domains: z.array(z.string()).min(1),
    description: z.string(),
    tech: z.array(z.string()).default([]),
    connections: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { curation, exploration };
