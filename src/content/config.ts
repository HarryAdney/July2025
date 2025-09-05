import { defineCollection, z } from 'astro:content';

const photos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    coverImage: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
    publishDate: z.date(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { photos };