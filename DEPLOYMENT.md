# Deploying Plip Documentation to Vercel

This guide helps you deploy the Plip documentation to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Methods

### Option 1: GitHub Integration (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the VitePress configuration

3. **Deployment Settings:**
   - **Framework Preset:** VitePress
   - **Build Command:** `bun run docs:build` (auto-detected from vercel.json)
   - **Output Directory:** `docs/.vitepress/dist` (auto-detected from vercel.json)
   - **Install Command:** `bun install` (auto-detected from vercel.json)

4. **Deploy:**
   - Click "Deploy"
   - Your site will be available at `https://your-project-name.vercel.app`

### Option 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy:**
   ```bash
   vercel login
   vercel --prod
   ```

## Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment Variables

If you need environment variables:
1. Go to "Settings" > "Environment Variables"
2. Add your variables for Production, Preview, and Development environments

## Automatic Deployments

Once connected to GitHub:
- **Production deployments:** Triggered by pushes to the main branch
- **Preview deployments:** Triggered by pull requests
- **Branch deployments:** Each branch gets its own preview URL

## Build Optimization

The project is configured with:
- ✅ Clean URLs enabled
- ✅ Sitemap generation
- ✅ Last updated timestamps
- ✅ Optimized build process for Vercel

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify VitePress configuration is valid

### 404 Errors
- Ensure `cleanUrls: true` is set in VitePress config
- Check that all internal links are correct

### Slow Builds
- Consider using `bun` instead of `npm` (already configured)
- Enable build cache in Vercel settings

## Performance

Your VitePress site on Vercel includes:
- 🚀 Edge network deployment
- 📱 Automatic mobile optimization  
- ⚡ Lightning-fast loading
- 🔍 Built-in analytics (optional)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [VitePress Deployment Guide](https://vitepress.dev/guide/deploy#vercel)
