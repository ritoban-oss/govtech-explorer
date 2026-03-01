# GovTech Contracts & Partnership Explorer

AI-powered government transparency tool that analyzes federal contracts for the top 100 U.S. tech companies. Powered by live [USASpending.gov](https://usaspending.gov) data and [Claude AI](https://anthropic.com).

## Architecture

- **Frontend**: React + Vite (static SPA)
- **Backend**: Cloudflare Pages Function (`/api/lookup`)
- **Data source**: USASpending.gov API (called directly from the browser)
- **AI analysis**: Anthropic Claude API (called from the serverless function)

The user's Anthropic API key is stored in their browser's `localStorage` and passed to the serverless function via an HTTP header. It is never stored server-side.

## Deploy to Cloudflare Pages

### Option 1: Git integration (recommended)

1. Push this repo to GitHub or GitLab
2. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
3. Click **Create a project** → **Connect to Git**
4. Select the repository
5. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18` (or higher)
6. Deploy

### Option 2: Direct upload

1. Build locally:
   ```bash
   npm install
   npm run build
   ```
2. Go to Cloudflare Dashboard → Pages → **Create a project** → **Direct upload**
3. Upload the `dist/` folder

> **Note**: Direct upload does NOT support Pages Functions. You must use Git integration for the `/api/lookup` endpoint to work.

## Local Development

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `localhost:8788`. To run the Pages Function locally:

```bash
npx wrangler pages dev dist
```

## Usage

1. Open the app
2. Click **Set API Key** and enter your [Anthropic API key](https://console.anthropic.com)
3. Select a company from the sidebar
4. The app resolves the company to a USASpending.gov recipient entity, fetches contract data, then sends it to Claude for analysis

## SEO

Includes `robots.txt`, `sitemap.xml`, Open Graph tags, Twitter Card meta, and JSON-LD structured data for search engine and AI crawler visibility.

## License

MIT
