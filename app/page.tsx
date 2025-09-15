import { getSearchResults, getAvailableDomains, getResultsStats } from '@/lib/cosmic';
import SearchInterface from '@/components/SearchInterface';

export default async function HomePage() {
  try {
    // Fetch initial data
    const [initialResults, availableDomains, stats] = await Promise.all([
      getSearchResults({ status: 'active' }),
      getAvailableDomains(),
      getResultsStats(),
    ]);

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Web Search Gateway
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover curated content from across the web with advanced search and filtering capabilities
            </p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active Results</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Indexed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{availableDomains.length}</div>
                <div className="text-sm text-muted-foreground">Domains</div>
              </div>
            </div>
          </div>

          {/* Search Interface */}
          <SearchInterface 
            initialResults={initialResults}
            availableDomains={availableDomains}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            Unable to load search results. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}