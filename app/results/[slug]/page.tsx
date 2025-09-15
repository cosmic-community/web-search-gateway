// app/results/[slug]/page.tsx
import { getSearchResult } from '@/lib/cosmic';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Calendar, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSearchResult(slug);

  if (!result) {
    return {
      title: 'Result Not Found',
    };
  }

  return {
    title: result.metadata?.page_title || result.title,
    description: result.metadata?.description || `View details for ${result.title}`,
  };
}

export default async function ResultDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getSearchResult(slug);

  if (!result) {
    notFound();
  }

  const {
    url,
    page_title,
    description,
    content_preview,
    keywords,
    domain,
    search_ranking,
    last_indexed,
    status,
    featured_image
  } = result.metadata || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {page_title || result.title}
                </h1>
                {domain && (
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Globe className="mr-2 h-4 w-4" />
                    <span>{domain}</span>
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              {status && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  status.key === 'active' 
                    ? 'bg-green-900/20 text-green-400 border border-green-400/20'
                    : status.key === 'pending'
                    ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-400/20'
                    : 'bg-red-900/20 text-red-400 border border-red-400/20'
                }`}>
                  {status.value}
                </span>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {search_ranking && (
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4" />
                  Ranking: {search_ranking}
                </div>
              )}
              {last_indexed && (
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Last Indexed: {new Date(last_indexed).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Image */}
              {featured_image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={`${featured_image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
                    alt={page_title || result.title}
                    width="800"
                    height="400"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {description && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {/* Content Preview */}
              {content_preview && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Content Preview</h2>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <p className="text-card-foreground leading-relaxed">
                      {content_preview}
                    </p>
                  </div>
                </div>
              )}

              {/* Keywords */}
              {keywords && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.split(',').map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Visit Site Button */}
              {url && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Visit Site</h3>
                  <a 
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Website
                  </a>
                  <p className="text-xs text-muted-foreground mt-2 break-all">
                    {url}
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Details</h3>
                <div className="space-y-3">
                  {domain && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Domain</dt>
                      <dd className="text-sm text-card-foreground">{domain}</dd>
                    </div>
                  )}
                  {search_ranking && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Search Ranking</dt>
                      <dd className="text-sm text-card-foreground">{search_ranking}/100</dd>
                    </div>
                  )}
                  {last_indexed && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Last Indexed</dt>
                      <dd className="text-sm text-card-foreground">
                        {new Date(last_indexed).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  )}
                  {status && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                      <dd className="text-sm text-card-foreground">{status.value}</dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}