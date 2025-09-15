# Web Search Gateway

![Web Search Gateway](https://imgix.cosmicjs.com/5acff1f0-927d-11f0-939d-c1726752de46-photo-1446776653964-20c1d3a81b06-1757972752614.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A sophisticated web search gateway that provides curated access to indexed content with advanced filtering and search capabilities. Built with Next.js and powered by Cosmic CMS.

## Features

- 🔍 **Advanced Search** - Real-time search across titles, descriptions, and keywords
- 🎯 **Content Filtering** - Filter by status (Active, Pending, Blocked) and domains
- 📊 **Smart Ranking** - Results prioritized by search ranking scores
- 🖼️ **Rich Previews** - Featured images and content snippets for each result
- 📱 **Responsive Design** - Optimized for all devices
- ⚡ **Fast Performance** - Server-side rendering with Next.js 15
- 🎨 **Modern UI** - Clean, dark theme with intuitive navigation

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68c88831fe0840663f64f854&clone_repository=68c889ecfe0840663f64f867)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "i want to be able to watch twitch.com without it being blocked"

### Code Generation Prompt

> "Based on the content model I created for "i want to be able to watch twitch.com without it being blocked", now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless content management
- **React** - UI library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Cosmic credentials:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Cosmic SDK Examples

### Fetching Search Results
```typescript
const response = await cosmic.objects
  .find({ type: 'search-results' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1);
```

### Searching Content
```typescript
const response = await cosmic.objects
  .find({
    type: 'search-results',
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { 'metadata.description': { $regex: searchTerm, $options: 'i' } },
      { 'metadata.keywords': { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1);
```

### Filtering by Status
```typescript
const response = await cosmic.objects
  .find({
    type: 'search-results',
    'metadata.status.key': 'active'
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1);
```

## Cosmic CMS Integration

This application uses the following Cosmic object type:

**Search Results** (`search-results`)
- **URL** (text) - The full URL of the indexed page
- **Page Title** (text) - The title that appears in search results
- **Description** (textarea) - Meta description or summary
- **Content Preview** (textarea) - Snippet of the actual page content
- **Keywords** (text) - Comma-separated relevant keywords
- **Domain** (text) - The website domain
- **Search Ranking** (number) - Priority score for result ordering
- **Last Indexed** (date) - When content was last crawled
- **Status** (select-dropdown) - Active, Pending Review, or Blocked
- **Featured Image** (file) - Thumbnail or preview image

## Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables

### Other Platforms
This Next.js application can be deployed to any platform that supports Node.js applications.

For production deployment, ensure all environment variables are properly configured in your hosting platform.
<!-- README_END -->