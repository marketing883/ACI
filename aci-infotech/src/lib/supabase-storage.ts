import { createClient, SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// Lazy initialization for server-side Supabase client
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseServiceKey || '');
  }
  return supabaseInstance;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Optimize image buffer using Sharp
 */
export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<{ buffer: Buffer; contentType: string }> {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 80,
    format = 'webp',
  } = options;

  try {
    let image = sharp(buffer);
    const metadata = await image.metadata();

    // Resize if larger than max dimensions while maintaining aspect ratio
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        image = image.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }
    }

    // Convert to specified format with quality settings
    let optimized: Buffer;
    let contentType: string;

    switch (format) {
      case 'webp':
        optimized = await image.webp({ quality }).toBuffer();
        contentType = 'image/webp';
        break;
      case 'jpeg':
        optimized = await image.jpeg({ quality, progressive: true }).toBuffer();
        contentType = 'image/jpeg';
        break;
      case 'png':
        optimized = await image.png({ quality }).toBuffer();
        contentType = 'image/png';
        break;
      default:
        optimized = await image.webp({ quality }).toBuffer();
        contentType = 'image/webp';
    }

    return { buffer: optimized, contentType };
  } catch (error) {
    console.error('Image optimization failed, using original:', error);
    return { buffer, contentType: 'image/jpeg' };
  }
}

/**
 * Download image from URL and upload to Supabase Storage
 * Automatically optimizes images for web (converts to WebP, resizes if needed)
 */
export async function downloadAndUploadImage(
  imageUrl: string,
  bucket: string,
  fileName: string,
  optimizeOptions?: OptimizeOptions
): Promise<UploadResult> {
  try {
    // Download image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ACI-Infotech-Bot/1.0)',
      },
    });

    if (!response.ok) {
      return { success: false, error: `Failed to download: ${response.status}` };
    }

    const originalContentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Skip optimization for GIFs and SVGs
    const skipOptimization = originalContentType.includes('gif') || originalContentType.includes('svg');

    let buffer: Buffer;
    let contentType: string;
    let ext: string;

    if (skipOptimization) {
      buffer = originalBuffer;
      contentType = originalContentType;
      ext = originalContentType.includes('gif') ? 'gif' : 'svg';
    } else {
      // Optimize the image (default: convert to WebP, max 1200x800, quality 80)
      const optimized = await optimizeImage(originalBuffer, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 80,
        format: 'webp',
        ...optimizeOptions,
      });
      buffer = optimized.buffer;
      contentType = optimized.contentType;
      ext = 'webp';

      console.log(`Image optimized: ${(originalBuffer.length / 1024).toFixed(1)}KB → ${(buffer.length / 1024).toFixed(1)}KB`);
    }

    const finalFileName = `${fileName}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await getSupabase().storage
      .from(bucket)
      .upload(finalFileName, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = getSupabase().storage
      .from(bucket)
      .getPublicUrl(finalFileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Upload file directly to Supabase Storage
 */
export async function uploadFile(
  file: Buffer,
  bucket: string,
  fileName: string,
  contentType: string
): Promise<UploadResult> {
  try {
    const { data, error } = await getSupabase().storage
      .from(bucket)
      .upload(fileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = getSupabase().storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, fileName: string): Promise<boolean> {
  try {
    const { error } = await getSupabase().storage
      .from(bucket)
      .remove([fileName]);

    return !error;
  } catch {
    return false;
  }
}

/**
 * List files in a bucket folder
 */
export async function listFiles(bucket: string, folder?: string) {
  try {
    const { data, error } = await getSupabase().storage
      .from(bucket)
      .list(folder || '', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      return { success: false, error: error.message, files: [] };
    }

    return { success: true, files: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      files: []
    };
  }
}

/**
 * Generate a safe filename from a string
 */
export function generateSafeFileName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

/**
 * Check if a URL is likely an image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const hostname = urlObj.hostname.toLowerCase();

    // Known non-image domains to exclude
    const excludedDomains = [
      'zoom.us',
      'hubspot.zoom.us',
      'meet.google.com',
      'teams.microsoft.com',
      'webex.com',
      'gotomeeting.com',
      'youtube.com',
      'youtu.be',
      'vimeo.com',
    ];

    // Check if domain is excluded
    for (const domain of excludedDomains) {
      if (hostname.includes(domain)) {
        return false;
      }
    }

    // Common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.avif'];

    // Check file extension
    for (const ext of imageExtensions) {
      if (pathname.endsWith(ext)) {
        return true;
      }
    }

    // Known image hosting services (even without extension)
    const imageHostingDomains = [
      'images.unsplash.com',
      'images.pexels.com',
      'cloudinary.com',
      'imgix.net',
      'imagekit.io',
      'cdn.shopify.com',
      'i.imgur.com',
      'res.cloudinary.com',
      'media.istockphoto.com',
      'cdn.pixabay.com',
      'images.ctfassets.net',
      'storage.googleapis.com',
      's3.amazonaws.com',
      'blob.core.windows.net',
      'cdn.sanity.io',
      'hubspot.com',
      'hubspotusercontent',
      'hubspot.net',
      'hs-cms',
    ];

    for (const domain of imageHostingDomains) {
      if (hostname.includes(domain)) {
        return true;
      }
    }

    // Check for common image patterns in URL
    const imagePatterns = [
      '/images/',
      '/img/',
      '/media/',
      '/uploads/',
      '/assets/',
      '/static/',
      '/photos/',
      '/pictures/',
      'image',
      'photo',
      'thumbnail',
      'featured',
    ];

    for (const pattern of imagePatterns) {
      if (pathname.includes(pattern) || urlObj.search.toLowerCase().includes(pattern)) {
        // Additional check: URL should not be a redirect or tracking link
        if (!pathname.includes('/click') && !pathname.includes('/track') && !pathname.includes('/redirect')) {
          return true;
        }
      }
    }

    // If URL has a query string that looks like an image service
    if (urlObj.search && (urlObj.search.includes('format=') || urlObj.search.includes('width=') || urlObj.search.includes('height='))) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
