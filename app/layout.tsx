import type { Metadata } from 'next';
import './globals.css';
import CosmicBadge from '@/components/CosmicBadge';

export const metadata: Metadata = {
  title: 'Web Search Gateway',
  description: 'A sophisticated web search gateway providing curated access to indexed content with advanced filtering and search capabilities.',
  keywords: 'search, gateway, content discovery, web search, indexed content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Access environment variable on server side
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        {/* Pass bucket slug as prop to client component */}
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  );
}