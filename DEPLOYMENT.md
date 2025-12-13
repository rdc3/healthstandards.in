# GitHub Pages Deployment Guide

This guide explains how to deploy your Health Standards Website to GitHub Pages.

## Prerequisites

1. Your code should be in a GitHub repository
2. GitHub Pages should be enabled for your repository

## Automatic Deployment (Recommended)

The repository is configured with GitHub Actions for automatic deployment:

### Setup Steps:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically run on every push to main branch

3. **Access your deployed site:**
   - Your site will be available at: `https://[username].github.io/[repository-name]`
   - GitHub will show you the URL in the Pages settings

### How it works:
- The `.github/workflows/deploy.yml` file contains the deployment configuration
- On every push to main branch, it will:
  - Install dependencies
  - Build the static site
  - Deploy to GitHub Pages

## Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Build the site locally:**
   ```bash
   npm run build
   ```

2. **Deploy using gh-pages:**
   ```bash
   npm run deploy
   ```

## Build Configuration

The site is configured for static export with these settings in `next.config.js`:
- `output: 'export'` - Enables static site generation
- `trailingSlash: true` - Adds trailing slashes to URLs
- `images: { unoptimized: true }` - Disables image optimization for static export

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Ensure TypeScript compilation passes: `npm run lint`

### Site Not Loading
- Verify GitHub Pages is enabled in repository settings
- Check that the deployment workflow completed successfully in the "Actions" tab
- Ensure your repository is public (or you have GitHub Pro for private repo Pages)

### Search Not Working
- The search index generation is currently skipped during build
- Search functionality will work with the existing `public/search-index.json` file
- To enable search index generation, fix the TypeScript build script in `scripts/`

## Repository Settings

Make sure your GitHub repository has:
- Pages enabled with "GitHub Actions" as source
- Proper permissions for the workflow (should be automatic)
- Public visibility (unless you have GitHub Pro)