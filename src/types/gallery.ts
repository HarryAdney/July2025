// Gallery data types for JSON-based system

export interface GalleryMetadata {
  version: string;
  lastUpdated: string;
  totalItems: number;
  schema: string;
}

export interface ImageConfig {
  width: number;
  height: number;
}

export interface GalleryConfig {
  defaultImagePath: string;
  supportedFormats: string[];
  imageSizes: {
    thumbnail: ImageConfig;
    large: ImageConfig;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ImageVariant {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryItemMetadata {
  photographer?: string;
  location?: string;
  equipment?: string;
  keywords: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  images: {
    thumbnail: ImageVariant;
    large: ImageVariant;
  };
  tags: string[];
  publishDate: string;
  draft: boolean;
  sortOrder: number;
  metadata: GalleryItemMetadata;
}

export interface GalleryData {
  metadata: GalleryMetadata;
  gallery: {
    config: GalleryConfig;
    categories: Category[];
    items: GalleryItem[];
  };
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  tag?: string;
  sortBy?: 'default' | 'title-asc' | 'title-desc' | 'date-newest' | 'date-oldest';
}

export interface SearchResult {
  items: GalleryItem[];
  totalResults: number;
  appliedFilters: SearchFilters;
}

// Load result with error handling
export interface LoadResult<T> {
  data: T;
  source: 'json' | 'markdown' | 'static' | 'cache';
  errors: string[];
  warnings: string[];
}