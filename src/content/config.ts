import { defineCollection, z } from 'astro:content';

const photos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
    publishDate: z.date(),
    draft: z.boolean(),
  }),
});

export const collections = { photos };