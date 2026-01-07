import { createClient } from '@supabase/supabase-js';
import BlogPreviewSection from './BlogPreviewSection';

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface BlogPostDB {
  slug: string;
  title: string;
  excerpt?: string | null;
  author_name?: string | null;
  category?: string | null;
  featured_image?: string | null;
  read_time_minutes?: number | null;
  published_at?: string | null;
  created_at?: string | null;
  status?: string;
  [key: string]: unknown;
}

async function getLatestPosts(limit: number = 3) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Use * to fetch all columns - works with any table structure
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface DynamicBlogSectionProps {
  headline?: string;
  subheadline?: string;
  limit?: number;
}

export default async function DynamicBlogSection({
  headline = "Thoughts and Insights",
  subheadline = "Technical depth from engineers who've been there",
  limit = 3,
}: DynamicBlogSectionProps) {
  const dbPosts = await getLatestPosts(limit);

  // Transform DB format to component format
  const posts = dbPosts.map((post: BlogPostDB) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    author: post.author_name || 'ACI Infotech',
    date: formatDate(post.published_at),
    category: post.category || 'Insights',
    featured_image: post.featured_image || undefined,
    read_time: post.read_time_minutes ? `${post.read_time_minutes} min read` : undefined,
  }));

  // If no posts from DB, show placeholder
  if (posts.length === 0) {
    const placeholderPosts = [
      {
        slug: 'enterprise-data-mesh-architecture',
        title: 'Building an Enterprise Data Mesh Architecture',
        excerpt: 'Learn how to implement a data mesh architecture that scales with your organization.',
        author: 'ACI Infotech',
        date: 'Jan 2025',
        category: 'Data Engineering',
        read_time: '12 min read',
      },
      {
        slug: 'ai-governance-enterprise',
        title: 'AI Governance for the Enterprise: From Policy to Practice',
        excerpt: 'A comprehensive framework for implementing AI governance in your organization.',
        author: 'ACI Infotech',
        date: 'Dec 2024',
        category: 'AI & ML',
        read_time: '10 min read',
      },
      {
        slug: 'databricks-vs-snowflake',
        title: 'Databricks vs Snowflake: Choosing the Right Platform',
        excerpt: 'An objective comparison of the two leading data platforms for 2025.',
        author: 'ACI Infotech',
        date: 'Dec 2024',
        category: 'Data Engineering',
        read_time: '15 min read',
      },
    ];

    return (
      <BlogPreviewSection
        headline={headline}
        subheadline={subheadline}
        posts={placeholderPosts}
        viewAllUrl="/blog"
      />
    );
  }

  return (
    <BlogPreviewSection
      headline={headline}
      subheadline={subheadline}
      posts={posts}
      viewAllUrl="/blog"
    />
  );
}
