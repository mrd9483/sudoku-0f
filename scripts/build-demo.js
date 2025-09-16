#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy demo files to dist directory for GitHub Pages
const demoFiles = [
    'demo/styles.css', 
    'demo/sudoku-demo.js'
];

demoFiles.forEach(file => {
    const srcPath = path.join(__dirname, '..', file);
    const destPath = path.join(distDir, path.basename(file));
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${file} to ${path.basename(file)}`);
    } else {
        console.warn(`⚠️  File not found: ${file}`);
    }
});

// Copy and modify index.html to fix script paths
const htmlSrcPath = path.join(__dirname, '..', 'demo/index.html');
const htmlDestPath = path.join(distDir, 'index.html');

if (fs.existsSync(htmlSrcPath)) {
    let htmlContent = fs.readFileSync(htmlSrcPath, 'utf8');
    
    // Fix script path from ../dist/index.browser.js to index.browser.js
    htmlContent = htmlContent.replace(
        'src="../dist/index.browser.js"',
        'src="index.browser.js"'
    );
    
    fs.writeFileSync(htmlDestPath, htmlContent);
    console.log('✅ Copied and fixed demo/index.html to index.html');
} else {
    console.warn('⚠️  File not found: demo/index.html');
}

// Rename index.html to index.html (it's already correct)
// The demo will be accessible at the root of the GitHub Pages site

console.log('✅ Demo files copied to dist/ for GitHub Pages deployment');
