import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Download image from URL and upload to Supabase Storage
 */
export async function downloadAndUploadImage(
  imageUrl: string,
  bucket: string,
  fileName: string
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

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension from content type
    const ext = contentType.includes('png') ? 'png'
      : contentType.includes('webp') ? 'webp'
      : contentType.includes('gif') ? 'gif'
      : 'jpg';

    const finalFileName = fileName.endsWith(`.${ext}`) ? fileName : `${fileName}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalFileName, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
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
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
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
    const { error } = await supabase.storage
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
    const { data, error } = await supabase.storage
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
