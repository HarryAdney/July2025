import { z } from 'zod';

const ImageConfigSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

const GalleryConfigSchema = z.object({
  defaultImagePath: z.string(),
  supportedFormats: z.array(z.string()),
  imageSizes: z.object({
    thumbnail: ImageConfigSchema,
    large: ImageConfigSchema,
  }),
});

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

const ImageVariantSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const GalleryItemMetadataSchema = z.object({
  photographer: z.string().optional(),
  location: z.string().optional(),
  equipment: z.string().optional(),
  keywords: z.array(z.string()),
});

const GalleryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  images: z.object({
    thumbnail: ImageVariantSchema,
    large: ImageVariantSchema,
  }),
  tags: z.array(z.string()),
  publishDate: z.string().datetime(),
  draft: z.boolean(),
  sortOrder: z.number(),
  metadata: GalleryItemMetadataSchema,
});

export const GalleryDataSchema = z.object({
  metadata: z.object({
    version: z.string(),
    lastUpdated: z.string().datetime(),
    totalItems: z.number().nonnegative(),
    schema: z.string().url(),
  }),
  gallery: z.object({
    config: GalleryConfigSchema,
    categories: z.array(CategorySchema),
    items: z.array(GalleryItemSchema),
  }),
});

export type GalleryData = z.infer<typeof GalleryDataSchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type GalleryConfig = z.infer<typeof GalleryConfigSchema>;