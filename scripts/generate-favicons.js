#!/usr/bin/env node

/**
 * Favicon Generation Script for Startup911
 * 
 * This script helps generate favicon files from your logo.png
 * 
 * Requirements:
 * 1. Install sharp: npm install sharp
 * 2. Make sure public/logo.png exists and is at least 512x512px
 * 3. Run: node scripts/generate-favicons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logo.png');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo file not found at public/logo.png');
  console.log('Please ensure you have a logo.png file in the public directory (minimum 512x512px)');
  process.exit(1);
}

async function generateFavicons() {
  try {
    console.log('🚀 Generating favicons from logo.png...');

    // Generate different sizes
    const sizes = [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 180, name: 'apple-touch-icon.png' },
      { size: 192, name: 'android-chrome-192x192.png' },
      { size: 512, name: 'android-chrome-512x512.png' }
    ];

    // Generate PNG favicons
    for (const { size, name } of sizes) {
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(path.join(publicDir, name));
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate ICO file (requires special handling)
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon-temp.png'));

    // For ICO, we'll create a 32x32 PNG and rename it
    // Note: For true ICO support, you might want to use a dedicated ICO library
    await sharp(path.join(publicDir, 'favicon-temp.png'))
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));

    // Clean up temp file
    fs.unlinkSync(path.join(publicDir, 'favicon-temp.png'));
    
    console.log('✅ Generated favicon.ico');
    console.log('🎉 All favicons generated successfully!');
    console.log('');
    console.log('Generated files:');
    console.log('- favicon.ico (32x32)');
    console.log('- favicon-16x16.png');
    console.log('- favicon-32x32.png');
    console.log('- apple-touch-icon.png (180x180)');
    console.log('- android-chrome-192x192.png');
    console.log('- android-chrome-512x512.png');
    console.log('');
    console.log('Your favicon should now appear in the browser! 🚀');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure sharp is installed: npm install sharp');
    console.log('2. Ensure logo.png is at least 512x512 pixels');
    console.log('3. Check that logo.png is a valid PNG file');
  }
}

generateFavicons();
