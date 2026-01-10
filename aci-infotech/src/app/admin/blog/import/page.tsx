'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileJson,
  Image as ImageIcon,
} from 'lucide-react';

interface BlogData {
  slug: string;
  title: string;
  description: string;
  image: string;
  publishDate: string;
  author: string;
  tags: string[];
  content: string;
}

interface ImportResult {
  slug: string;
  title: string;
  status: 'success' | 'skipped' | 'error';
  message?: string;
}

interface ImportSummary {
  total: number;
  success: number;
  skipped: number;
  errors: number;
}

export default function BlogImportPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [jsonUrl, setJsonUrl] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<ImportResult[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  // Options
  const [skipExisting, setSkipExisting] = useState(true);
  const [importImages, setImportImages] = useState(true);
  const [setPublished, setSetPublished] = useState(true);

  const fetchFromUrl = async () => {
    if (!jsonUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setBlogs([]);

    try {
      const response = await fetch(`/api/admin/import-blogs?url=${encodeURIComponent(jsonUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch');
      }

      setBlogs(data.blogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    setBlogs([]);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of blog posts');
      }

      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse JSON');
    } finally {
      setIsLoading(false);
    }
  };

  const startImport = async () => {
    if (blogs.length === 0) return;

    setIsImporting(true);
    setImportProgress(0);
    setResults([]);
    setSummary(null);
    setError('');

    try {
      // Import in batches of 10 for better progress feedback
      const batchSize = 10;
      const allResults: ImportResult[] = [];
      let totalSuccess = 0;
      let totalSkipped = 0;
      let totalErrors = 0;

      for (let i = 0; i < blogs.length; i += batchSize) {
        const batch = blogs.slice(i, i + batchSize);

        const response = await fetch('/api/admin/import-blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blogs: batch,
            options: {
              skipExisting,
              importImages,
              setPublished,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Import failed');
        }

        allResults.push(...data.results);
        totalSuccess += data.summary.success;
        totalSkipped += data.summary.skipped;
        totalErrors += data.summary.errors;

        setImportProgress(Math.round(((i + batch.length) / blogs.length) * 100));
        setResults([...allResults]);
      }

      setSummary({
        total: blogs.length,
        success: totalSuccess,
        skipped: totalSkipped,
        errors: totalErrors,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Import Blog Posts</h1>
            <p className="text-gray-500">Import blogs from JSON file or URL</p>
          </div>
        </div>
      </div>

      {/* Source Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Data Source</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* URL Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LinkIcon className="w-4 h-4" />
              From URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={jsonUrl}
                onChange={(e) => setJsonUrl(e.target.value)}
                placeholder="https://example.com/blogs.json"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={fetchFromUrl}
                disabled={isLoading || isImporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch'}
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileJson className="w-4 h-4" />
              From File
            </label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Upload JSON file</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading || isImporting}
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      {/* Options */}
      {blogs.length > 0 && !summary && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Import Options</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={skipExisting}
                onChange={(e) => setSkipExisting(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Skip existing posts</span>
                <p className="text-sm text-gray-500">Don&apos;t update posts that already exist (by slug)</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={importImages}
                onChange={(e) => setImportImages(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Import images to Supabase</span>
                <p className="text-sm text-gray-500">Download and store images in Supabase Storage (slower but more reliable)</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={setPublished}
                onChange={(e) => setSetPublished(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Set as published</span>
                <p className="text-sm text-gray-500">Mark all imported posts as published immediately</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Preview */}
      {blogs.length > 0 && !summary && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Preview ({blogs.length} posts)
            </h2>
            <button
              onClick={startImport}
              disabled={isImporting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Importing... {importProgress}%
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Start Import
                </>
              )}
            </button>
          </div>

          {isImporting && (
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-2">
            {blogs.slice(0, 50).map((blog, index) => (
              <div
                key={blog.slug}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-400 w-8">{index + 1}</span>
                {blog.image ? (
                  <ImageIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{blog.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.publishDate).toLocaleDateString()} &bull; {blog.author}
                  </p>
                </div>
                {results.find(r => r.slug === blog.slug) && (
                  <span className={`text-sm ${
                    results.find(r => r.slug === blog.slug)?.status === 'success'
                      ? 'text-green-600'
                      : results.find(r => r.slug === blog.slug)?.status === 'skipped'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {results.find(r => r.slug === blog.slug)?.message}
                  </span>
                )}
              </div>
            ))}
            {blogs.length > 50 && (
              <p className="text-center text-gray-500 py-2">
                ... and {blogs.length - 50} more posts
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {summary && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Import Complete</h2>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">{summary.success}</p>
              <p className="text-sm text-green-600">Imported</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-yellow-600">{summary.skipped}</p>
              <p className="text-sm text-yellow-600">Skipped</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-600">{summary.errors}</p>
              <p className="text-sm text-red-600">Errors</p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.map((result) => (
              <div
                key={result.slug}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  result.status === 'success'
                    ? 'bg-green-50'
                    : result.status === 'skipped'
                    ? 'bg-yellow-50'
                    : 'bg-red-50'
                }`}
              >
                {result.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : result.status === 'skipped' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{result.title}</p>
                  <p className="text-sm text-gray-500">{result.slug}</p>
                </div>
                <span className={`text-sm ${
                  result.status === 'success'
                    ? 'text-green-600'
                    : result.status === 'skipped'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {result.message}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href="/admin/blog"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Blog Posts
            </Link>
            <button
              onClick={() => {
                setBlogs([]);
                setResults([]);
                setSummary(null);
                setJsonUrl('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Import More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
