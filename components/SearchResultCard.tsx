import Link from 'next/link';
import { ExternalLink, Calendar, Globe, Star } from 'lucide-react';
import { SearchResultCardProps } from '@/types';

export default function SearchResultCard({ result }: SearchResultCardProps) {
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
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow search-card">
      {/* Featured Image */}
      {featured_image && (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={`${featured_image.imgix_url}?w=600&h=300&fit=crop&auto=format,compress`}
            alt={page_title || result.title}
            width="300"
            height="150"
            className="w-full h-full object-cover"
          />
          
          {/* Status Badge */}
          {status && (
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                status.key === 'active' 
                  ? 'bg-green-900/70 text-green-300 border border-green-400/30'
                  : status.key === 'pending'
                  ? 'bg-yellow-900/70 text-yellow-300 border border-yellow-400/30'
                  : 'bg-red-900/70 text-red-300 border border-red-400/30'
              }`}>
                {status.value}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-2">
            <Link 
              href={`/results/${result.slug}`}
              className="hover:text-primary transition-colors"
            >
              {page_title || result.title}
            </Link>
          </h3>
          
          {domain && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Globe className="mr-1 h-3 w-3" />
              <span>{domain}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground truncate-3">
            {description}
          </p>
        )}

        {/* Content Preview */}
        {content_preview && !description && (
          <p className="text-sm text-muted-foreground truncate-3">
            {content_preview}
          </p>
        )}

        {/* Keywords */}
        {keywords && (
          <div className="flex flex-wrap gap-1">
            {keywords.split(',').slice(0, 3).map((keyword, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
              >
                {keyword.trim()}
              </span>
            ))}
            {keywords.split(',').length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                +{keywords.split(',').length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            {search_ranking && (
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3" />
                <span>{search_ranking}</span>
              </div>
            )}
            {last_indexed && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                <span>{new Date(last_indexed).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link 
              href={`/results/${result.slug}`}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              View Details
            </Link>
            {url && (
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}