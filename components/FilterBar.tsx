'use client';

import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { FilterBarProps, SearchStatus } from '@/types';

export default function FilterBar({ filters, onFiltersChange, availableDomains }: FilterBarProps) {
  const handleStatusChange = (status: SearchStatus | undefined) => {
    onFiltersChange({ ...filters, status });
  };

  const handleDomainChange = (domain: string) => {
    onFiltersChange({ ...filters, domain: domain || undefined });
  };

  const handleSortChange = (sortBy: 'ranking' | 'date' | 'relevance') => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleSortOrderToggle = () => {
    const newOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({ ...filters, sortOrder: newOrder });
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'ranking',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.status || filters.domain;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Filter Icon */}
        <div className="flex items-center text-muted-foreground">
          <Filter className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-card-foreground">Status:</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value as SearchStatus || undefined)}
            className="bg-input text-foreground border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="pending">Pending Review</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Domain Filter */}
        {availableDomains.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-card-foreground">Domain:</label>
            <select
              value={filters.domain || ''}
              onChange={(e) => handleDomainChange(e.target.value)}
              className="bg-input text-foreground border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All domains</option>
              {availableDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-card-foreground">Sort by:</label>
          <select
            value={filters.sortBy || 'ranking'}
            onChange={(e) => handleSortChange(e.target.value as 'ranking' | 'date' | 'relevance')}
            className="bg-input text-foreground border border-border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ranking">Ranking</option>
            <option value="date">Last Indexed</option>
            <option value="relevance">Relevance</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={handleSortOrderToggle}
            className="flex items-center justify-center w-8 h-8 bg-input border border-border rounded hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 text-foreground" />
            ) : (
              <SortDesc className="h-4 w-4 text-foreground" />
            )}
          </button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}