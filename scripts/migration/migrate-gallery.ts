import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { GalleryDataSchema } from '../../src/schemas/gallery.js';
import type { GalleryData, GalleryItem } from '../../src/types/gallery.js';

async function migrateGallery(): Promise<void> {
  console.log('🚀 Starting gallery migration from markdown to JSON...\n');

  try {
    // Step 1: Create backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `backups/migration-${timestamp}`;
    await fs.mkdir(backupDir, { recursive: true });

    const sourceDir = 'src/content/photos';
    const files = await fs.readdir(sourceDir);

    console.log('📦 Creating backup...');
    for (const file of files) {
      if (file.endsWith('.md')) {
        await fs.copyFile(
          path.join(sourceDir, file),
          path.join(backupDir, file)
        );
      }
    }
    console.log(`✅ Backup created: ${backupDir}`);

    // Step 2: Extract data from markdown files
    console.log('\n📤 Extracting data from markdown files...');
    const items: GalleryItem[] = [];
    const markdownFiles = files.filter(f => f.endsWith('.md'));

    for (const file of markdownFiles) {
      const filePath = path.join(sourceDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(content);

      const slideMatch = file.match(/slide(\d+)\.md/);
      const slideNumber = slideMatch ? parseInt(slideMatch[1]) : items.length + 1;
      const imageName = data.coverImage?.src?.split('/').pop()?.replace('.webp', '') || `slide${slideNumber}`;

      const item: GalleryItem = {
        id: data.slug || file.replace('.md', ''),
        title: data.title || `Gallery Image ${slideNumber}`,
        description: data.description || data.title || `Gallery Image ${slideNumber}`,
        slug: data.slug || file.replace('.md', ''),
        images: {
          thumbnail: {
            src: `${imageName}.webp`,
            alt: data.coverImage?.alt || data.title || `Gallery Image ${slideNumber}`,
            width: 400,
            height: 300
          },
          large: {
            src: `${imageName}-large.webp`,
            alt: data.coverImage?.alt || data.title || `Gallery Image ${slideNumber}`,
            width: 1200,
            height: 800
          }
        },
        tags: data.tags || ['restaurant'],
        publishDate: data.publishDate ? new Date(data.publishDate).toISOString() : new Date().toISOString(),
        draft: data.draft || false,
        sortOrder: slideNumber,
        metadata: {
          location: 'The Foresters Arms',
          keywords: extractKeywords(data.title, data.description)
        }
      };

      items.push(item);
      console.log(`  ✓ Processed: ${item.title}`);
    }

    // Step 3: Create gallery data structure
    items.sort((a, b) => a.sortOrder - b.sortOrder);

    const galleryData: GalleryData = {
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalItems: items.length,
        schema: 'https://forestersarms.com/schemas/gallery-v1.json'
      },
      gallery: {
        config: {
          defaultImagePath: '/gallery/',
          supportedFormats: ['webp', 'jpg', 'png'],
          imageSizes: {
            thumbnail: { width: 400, height: 300 },
            large: { width: 1200, height: 800 }
          }
        },
        categories: [
          { id: 'restaurant', name: 'Restaurant', description: 'Food and dining experiences' },
          { id: 'food', name: 'Food', description: 'Culinary creations and dishes' },
          { id: 'drink', name: 'Drinks', description: 'Beverages and bar offerings' }
        ],
        items
      }
    };

    // Step 4: Validate data
    console.log('\n✅ Validating data structure...');
    const validatedData = GalleryDataSchema.parse(galleryData);
    console.log('✅ Data validation passed');

    // Step 5: Write JSON file
    console.log('\n💾 Writing gallery.json...');
    await fs.mkdir('src/data', { recursive: true });
    await fs.writeFile(
      'src/data/gallery.json',
      JSON.stringify(validatedData, null, 2),
      'utf-8'
    );

    console.log('\n🎉 Migration completed successfully!');
    console.log(`📊 Migrated ${items.length} gallery items`);
    console.log(`📁 Backup available at: ${backupDir}`);
    console.log(`📄 Gallery data written to: src/data/gallery.json`);

    // Step 6: Verify the written file
    console.log('\n🔍 Verifying written file...');
    const writtenContent = await fs.readFile('src/data/gallery.json', 'utf-8');
    const parsedData = JSON.parse(writtenContent);
    GalleryDataSchema.parse(parsedData);
    console.log('✅ Written file verification passed');

    console.log('\n📋 Next steps:');
    console.log('1. Update your components to use the new gallery loader');
    console.log('2. Test the gallery functionality');
    console.log('3. Commit the changes to your feature branch');
    console.log(`4. To rollback if needed: restore files from ${backupDir}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

function extractKeywords(title: string, description?: string): string[] {
  const text = `${title} ${description || ''}`.toLowerCase();
  const commonWords = ['the', 'is', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'some', 'kind'];

  return text
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .filter((word, index, arr) => arr.indexOf(word) === index)
    .slice(0, 10);
}

// Run migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateGallery();
}

export { migrateGallery };
