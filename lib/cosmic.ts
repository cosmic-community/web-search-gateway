import { createBucketClient } from '@cosmicjs/sdk';
import { SearchResult, SearchFilters, CosmicResponse } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all search results with optional filtering
export async function getSearchResults(filters: SearchFilters = {}): Promise<SearchResult[]> {
  try {
    const query: Record<string, any> = { type: 'search-results' };
    
    // Add status filter if specified
    if (filters.status) {
      query['metadata.status.key'] = filters.status;
    }
    
    // Add domain filter if specified
    if (filters.domain) {
      query['metadata.domain'] = filters.domain;
    }
    
    // Add search query filter if specified
    if (filters.query && filters.query.trim()) {
      const searchRegex = { $regex: filters.query.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { 'metadata.page_title': searchRegex },
        { 'metadata.description': searchRegex },
        { 'metadata.keywords': searchRegex },
        { 'metadata.content_preview': searchRegex }
      ];
    }
    
    const response = await cosmic.objects
      .find(query)
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    // Manual sorting based on filters
    let results = response.objects as SearchResult[];
    
    if (filters.sortBy === 'ranking') {
      results = results.sort((a, b) => {
        const rankingA = a.metadata?.search_ranking || 0;
        const rankingB = b.metadata?.search_ranking || 0;
        return filters.sortOrder === 'asc' ? rankingA - rankingB : rankingB - rankingA;
      });
    } else if (filters.sortBy === 'date') {
      results = results.sort((a, b) => {
        const dateA = new Date(a.metadata?.last_indexed || '').getTime();
        const dateB = new Date(b.metadata?.last_indexed || '').getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else {
      // Default sort by search ranking (desc)
      results = results.sort((a, b) => {
        const rankingA = a.metadata?.search_ranking || 0;
        const rankingB = b.metadata?.search_ranking || 0;
        return rankingB - rankingA;
      });
    }
    
    return results;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch search results');
  }
}

// Get a single search result by slug
export async function getSearchResult(slug: string): Promise<SearchResult | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'search-results', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const result = response.object as SearchResult;
    
    if (!result || !result.metadata) {
      return null;
    }
    
    return result;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch search result');
  }
}

// Get unique domains from all search results
export async function getAvailableDomains(): Promise<string[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'search-results' })
      .props(['metadata.domain']);
    
    const domains = new Set<string>();
    response.objects.forEach((obj: any) => {
      if (obj.metadata?.domain) {
        domains.add(obj.metadata.domain);
      }
    });
    
    return Array.from(domains).sort();
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch available domains');
  }
}

// Get search results count by status
export async function getResultsStats(): Promise<{ active: number; pending: number; blocked: number; total: number }> {
  try {
    const [activeResults, pendingResults, blockedResults] = await Promise.all([
      getSearchResults({ status: 'active' }),
      getSearchResults({ status: 'pending' }),
      getSearchResults({ status: 'blocked' }),
    ]);
    
    return {
      active: activeResults.length,
      pending: pendingResults.length,
      blocked: blockedResults.length,
      total: activeResults.length + pendingResults.length + blockedResults.length,
    };
  } catch (error) {
    console.error('Error fetching results stats:', error);
    return { active: 0, pending: 0, blocked: 0, total: 0 };
  }
}