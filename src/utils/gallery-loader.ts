import type { GalleryData, GalleryItem } from '../types/gallery.js';
import { GalleryDataSchema } from '../schemas/gallery.js';

class GalleryLoader {
  private static instance: GalleryLoader;
  private data: GalleryData | null = null;
  private cache: Map<string, any> = new Map();
  private loadPromise: Promise<GalleryData> | null = null;

  private constructor() {}

  public static getInstance(): GalleryLoader {
    if (!GalleryLoader.instance) {
      GalleryLoader.instance = new GalleryLoader();
    }
    return GalleryLoader.instance;
  }

  private async loadData(): Promise<GalleryData> {
    if (this.data) return this.data;

    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = this.performLoad();
    this.data = await this.loadPromise;
    this.loadPromise = null;

    return this.data;
  }

  private async performLoad(): Promise<GalleryData> {
    try {
      // In Astro, this would be a static import
      const galleryData = await import('../data/gallery.json');
      return GalleryDataSchema.parse(galleryData.default || galleryData);
    } catch (error) {
      console.error('Failed to load gallery data:', error);
      throw error;
    }
  }

  public async getAllItems(): Promise<GalleryItem[]> {
    const cacheKey = 'all-items';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const data = await this.loadData();
    const items = data.gallery.items
      .filter(item => !item.draft)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    this.cache.set(cacheKey, items);
    return items;
  }

  public async getItemById(id: string): Promise<GalleryItem | null> {
    const items = await this.getAllItems();
    return items.find(item => item.id === id) || null;
  }

  public async getItemsByTag(tag: string): Promise<GalleryItem[]> {
    const cacheKey = `tag-${tag}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const items = await this.getAllItems();
    const filtered = items.filter(item => item.tags.includes(tag));

    this.cache.set(cacheKey, filtered);
    return filtered;
  }

  public async getConfig(): Promise<GalleryData['gallery']['config']> {
    const data = await this.loadData();
    return data.gallery.config;
  }

  public async getCategories(): Promise<GalleryData['gallery']['categories']> {
    const data = await this.loadData();
    return data.gallery.categories;
  }

  public async getMetadata(): Promise<GalleryData['metadata']> {
    const data = await this.loadData();
    return data.metadata;
  }

  // Clear cache (useful for testing or when data changes)
  public clearCache(): void {
    this.cache.clear();
    this.data = null;
    this.loadPromise = null;
  }
}

// Export singleton instance
export const galleryLoader = GalleryLoader.getInstance();

// Convenience functions for common operations
export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return galleryLoader.getAllItems();
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  return galleryLoader.getItemById(id);
}

export async function getGalleryItemsByTag(tag: string): Promise<GalleryItem[]> {
  return galleryLoader.getItemsByTag(tag);
}

export async function getGalleryConfig(): Promise<GalleryData['gallery']['config']> {
  return galleryLoader.getConfig();
}

export async function getGalleryCategories(): Promise<GalleryData['gallery']['categories']> {
  return galleryLoader.getCategories();
}

export async function getGalleryMetadata(): Promise<GalleryData['metadata']> {
  return galleryLoader.getMetadata();
}