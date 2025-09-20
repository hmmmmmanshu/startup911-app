#!/usr/bin/env node

/**
 * Social Media Image Generator for Startup911
 * 
 * This script creates optimized social media preview images
 * Dimensions: 1200x630 (Facebook/LinkedIn/WhatsApp optimal)
 * 
 * Run: node scripts/create-social-image.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logo.png');

async function createSocialImage() {
  try {
    console.log('🎨 Creating social media preview image...');

    // Create a social media optimized image (1200x630)
    const socialImage = sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background
      }
    });

    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      console.error('❌ Logo file not found at public/logo.png');
      return;
    }

    // Create the social preview image
    await socialImage
      .composite([
        {
          input: await sharp(logoPath)
            .resize(400, 400, { 
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer(),
          top: 115, // Center vertically (630-400)/2 = 115
          left: 400 // Center horizontally (1200-400)/2 = 400
        }
      ])
      .png()
      .toFile(path.join(publicDir, 'social-preview.png'));

    // Create Twitter card image (1200x600 - Twitter's preferred ratio)
    await sharp({
      create: {
        width: 1200,
        height: 600,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
      .composite([
        {
          input: await sharp(logoPath)
            .resize(380, 380, { 
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer(),
          top: 110, // Center vertically
          left: 410 // Center horizontally
        }
      ])
      .png()
      .toFile(path.join(publicDir, 'twitter-card.png'));

    // Create LinkedIn specific image (1200x627)
    await sharp({
      create: {
        width: 1200,
        height: 627,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
      .composite([
        {
          input: await sharp(logoPath)
            .resize(400, 400, { 
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer(),
          top: 113, // Center vertically
          left: 400 // Center horizontally
        }
      ])
      .png()
      .toFile(path.join(publicDir, 'linkedin-preview.png'));

    console.log('✅ Created social-preview.png (1200x630) for Facebook/WhatsApp');
    console.log('✅ Created twitter-card.png (1200x600) for Twitter');
    console.log('✅ Created linkedin-preview.png (1200x627) for LinkedIn');
    console.log('🎉 Social media images generated successfully!');

  } catch (error) {
    console.error('❌ Error creating social images:', error.message);
  }
}

createSocialImage();
