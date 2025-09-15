import { NextResponse } from 'next/server';
import { getSearchResults } from '@/lib/cosmic';
import { SearchFilters } from '@/types';

export async function POST(request: Request) {
  try {
    const filters: SearchFilters = await request.json();
    
    const results = await getSearchResults(filters);
    
    return NextResponse.json({
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search results' },
      { status: 500 }
    );
  }
}