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
