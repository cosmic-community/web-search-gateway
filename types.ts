// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Search result object type
interface SearchResult extends CosmicObject {
  type: 'search-results';
  metadata: {
    url?: string;
    page_title?: string;
    description?: string;
    content_preview?: string;
    keywords?: string;
    domain?: string;
    search_ranking?: number;
    last_indexed?: string;
    status?: {
      key: SearchStatus;
      value: string;
    };
    featured_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Type literals for select-dropdown values
type SearchStatus = 'active' | 'pending' | 'blocked';

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Search and filter types
interface SearchFilters {
  query?: string;
  status?: SearchStatus;
  domain?: string;
  sortBy?: 'ranking' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

// Component prop types
interface SearchResultCardProps {
  result: SearchResult;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

interface FilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableDomains: string[];
}

// Type guards for runtime validation
function isSearchResult(obj: CosmicObject): obj is SearchResult {
  return obj.type === 'search-results';
}

// Utility types
type CreateSearchResultData = Omit<SearchResult, 'id' | 'created_at' | 'modified_at'>;
type UpdateSearchResultData = Partial<Pick<SearchResult, 'title' | 'metadata'>>;

export type {
  CosmicObject,
  SearchResult,
  SearchStatus,
  CosmicResponse,
  SearchFilters,
  SearchResultCardProps,
  SearchBarProps,
  FilterBarProps,
  CreateSearchResultData,
  UpdateSearchResultData,
};

export {
  isSearchResult,
};