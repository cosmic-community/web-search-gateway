'use client';

import { useState, useEffect } from 'react';
import { SearchResult, SearchFilters } from '@/types';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import SearchResultCard from '@/components/SearchResultCard';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Props {
  initialResults: SearchResult[];
  availableDomains: string[];
}

export default function SearchInterface({ initialResults, availableDomains }: Props) {
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'ranking',
    sortOrder: 'desc',
  });

  // Apply filters to results
  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      } else {
        console.error('Failed to fetch filtered results');
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search by title, description, or keywords..."
          initialValue={filters.query}
        />
      </div>

      {/* Filter Bar */}
      <div className="mb-8">
        <FilterBar 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableDomains={availableDomains}
        />
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">
            {loading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {results.length} result{results.length !== 1 ? 's' : ''} found
                {filters.query && ` for "${filters.query}"`}
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Results Grid */}
        {!loading && (
          <>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <span className="text-6xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  {filters.query 
                    ? `No results match your search for "${filters.query}"`
                    : 'Try adjusting your filters to see more results'
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}