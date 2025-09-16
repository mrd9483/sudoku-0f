# GitHub Pages Deployment Guide

This guide explains how to deploy the 16x16 Sudoku demo to GitHub Pages.

## Quick Setup

### 1. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy when you push to the `main` branch

### 2. Repository Structure
```
sudoku-0f/
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── _config.yml                     # GitHub Pages config
├── demo/                          # Demo files (source)
├── dist/                          # Built files (deployed)
└── scripts/build-demo.js          # Demo build script
```

## How It Works

### Build Process
1. **TypeScript Compilation**: `npm run build` compiles TypeScript to JavaScript
2. **Browser Build**: Creates `dist/index.browser.js` for browser compatibility
3. **Demo Build**: Copies demo files to `dist/` directory
4. **GitHub Actions**: Automatically deploys `dist/` contents to GitHub Pages

### File Structure After Build
```
dist/
├── index.browser.js    # Browser-compatible Sudoku library
├── index.html          # Demo HTML (copied from demo/index.html)
├── styles.css          # Demo styles (copied from demo/styles.css)
├── sudoku-demo.js      # Demo JavaScript (copied from demo/sudoku-demo.js)
└── ...                 # Other compiled files
```

## Manual Deployment

If you want to deploy manually:

```bash
# Build everything
npm run build:pages

# The dist/ directory is now ready for GitHub Pages
# You can manually upload its contents to GitHub Pages
```

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `dist/` directory with your domain
2. Update the GitHub Pages settings to use your custom domain

## Troubleshooting

### Common Issues

1. **404 Error**: Make sure `dist/index.html` exists and contains the demo
2. **Script Not Loading**: Verify `dist/index.browser.js` was built correctly
3. **Build Fails**: Check that all dependencies are installed (`npm ci`)

### Debug Steps
```bash
# Test build locally
npm run build:pages

# Check dist directory
ls -la dist/

# Test locally (optional)
cd dist && python3 -m http.server 8000
# Then visit http://localhost:8000
```

## URLs

After deployment, your demo will be available at:
- `https://yourusername.github.io/sudoku-0f/`
- `https://yourusername.github.io/sudoku-0f/index.html`

## Features Available

✅ **16x16 Sudoku Generation** - Complete grids and puzzles  
✅ **Hexadecimal Display** - 0-F digit representation  
✅ **Interactive Solving** - Click to edit, keyboard navigation  
✅ **Technique Analysis** - Advanced difficulty assessment  
✅ **Hex Import/Export** - Load puzzles from hex strings  
✅ **Responsive Design** - Works on desktop and mobile  

## Repository Settings

Make sure your repository has:
- ✅ Public visibility (for GitHub Pages)
- ✅ GitHub Actions enabled
- ✅ Pages source set to "GitHub Actions"
