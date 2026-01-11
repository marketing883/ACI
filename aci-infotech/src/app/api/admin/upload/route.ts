import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// Image optimization settings
const IMAGE_CONFIG = {
  maxWidth: 1920,           // Max width for featured images
  maxHeight: 1080,          // Max height
  quality: 82,              // WebP quality (80-85 is optimal for web)
  thumbnailWidth: 400,      // Thumbnail width for previews
  thumbnailQuality: 75,     // Slightly lower quality for thumbnails
};

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && serviceKey);
}

// Server-side Supabase client with service role key (bypasses RLS)
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(url, serviceKey);
}

// Optimize image using sharp - converts to WebP with compression
async function optimizeImage(
  buffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<{ buffer: Buffer; format: string; originalSize: number; optimizedSize: number }> {
  const {
    maxWidth = IMAGE_CONFIG.maxWidth,
    maxHeight = IMAGE_CONFIG.maxHeight,
    quality = IMAGE_CONFIG.quality,
  } = options;

  const originalSize = buffer.length;

  // Get image metadata
  const metadata = await sharp(buffer).metadata();

  // Determine if resize is needed
  const needsResize = (metadata.width && metadata.width > maxWidth) ||
                      (metadata.height && metadata.height > maxHeight);

  // Process image: resize if needed, convert to WebP
  let sharpInstance = sharp(buffer);

  if (needsResize) {
    sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
      fit: 'inside',           // Maintain aspect ratio, fit within bounds
      withoutEnlargement: true // Don't upscale small images
    });
  }

  // Convert to WebP with quality optimization
  const optimizedBuffer = await sharpInstance
    .webp({
      quality,
      effort: 4,              // Compression effort (0-6, higher = smaller but slower)
      smartSubsample: true,   // Better color subsampling
    })
    .toBuffer();

  return {
    buffer: optimizedBuffer,
    format: 'webp',
    originalSize,
    optimizedSize: optimizedBuffer.length,
  };
}

// Generate thumbnail for quick previews
async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(IMAGE_CONFIG.thumbnailWidth, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: IMAGE_CONFIG.thumbnailQuality,
      effort: 4,
    })
    .toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('FormData parsing error:', formError);
      return NextResponse.json(
        { error: 'Failed to parse form data' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const bucket = formData.get('bucket') as string || 'ACI-web';
    const skipOptimization = formData.get('skipOptimization') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Demo mode: return placeholder URL when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning placeholder URL');
      const timestamp = Date.now();
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const sanitizedName = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
      const ext = file.name.split('.').pop() || 'jpg';

      // Return a demo placeholder URL - use a real placeholder image
      const demoUrl = `https://placehold.co/400x300/1a365d/ffffff?text=${encodeURIComponent(sanitizedName.substring(0, 20))}`;

      return NextResponse.json({
        success: true,
        url: demoUrl,
        path: `${folder}/${timestamp}-${sanitizedName}.${ext}`,
        demo: true,
        message: 'Demo mode: Using placeholder. Configure Supabase for real uploads.',
      });
    }

    // Validate file type based on folder
    if (folder === 'whitepapers' && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed for whitepapers' },
        { status: 400 }
      );
    }

    if (folder.includes('covers') || folder.includes('images')) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // Determine if this is an image that should be optimized
    const isImage = file.type.startsWith('image/');
    const isOptimizableImage = isImage &&
      !file.type.includes('svg') && // Don't optimize SVGs
      !file.type.includes('gif');   // Don't convert GIFs (preserves animation)

    let finalBuffer: Buffer = buffer;
    let contentType = file.type;
    let fileExtension = file.name.split('.').pop() || '';
    let optimizationInfo = null;

    // Optimize images (except SVG, GIF, and when explicitly skipped)
    if (isOptimizableImage && !skipOptimization) {
      try {
        const optimized = await optimizeImage(buffer);
        finalBuffer = optimized.buffer;
        contentType = 'image/webp';
        fileExtension = 'webp';

        const savings = ((optimized.originalSize - optimized.optimizedSize) / optimized.originalSize * 100).toFixed(1);
        optimizationInfo = {
          originalSize: optimized.originalSize,
          optimizedSize: optimized.optimizedSize,
          savings: `${savings}%`,
          format: 'webp',
        };

        console.log(`Image optimized: ${file.name} - ${optimized.originalSize} bytes → ${optimized.optimizedSize} bytes (${savings}% reduction)`);
      } catch (optimizeError) {
        // If optimization fails, fall back to original
        console.error('Image optimization failed, using original:', optimizeError);
        finalBuffer = buffer;
      }
    }

    // Create unique filename with correct extension
    const timestamp = Date.now();
    const baseName = file.name.replace(/\.[^.]+$/, ''); // Remove original extension
    const sanitizedName = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const fileName = `${folder}/${timestamp}-${sanitizedName}.${fileExtension}`;

    // Upload using service role (bypasses RLS)
    const supabase = getServiceSupabase();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, finalBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: fileName,
      optimization: optimizationInfo,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
