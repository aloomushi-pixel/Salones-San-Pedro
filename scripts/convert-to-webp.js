const fs = require('fs');
const path = require('path');

// Simple WebP conversion using canvas (built-in in Node 18+)
async function convertToWebP() {
    try {
        // Try using sharp if available
        const sharp = require('sharp');

        const inputPath = path.join(__dirname, 'frontend', 'public', 'images', 'hero-bg.jpg');
        const outputPath = path.join(__dirname, 'frontend', 'public', 'images', 'hero-bg.webp');

        console.log('Converting image to WebP...');
        console.log('Input:', inputPath);
        console.log('Output:', outputPath);

        await sharp(inputPath)
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);

        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);

        const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);

        console.log('\n✅ Conversion successful!');
        console.log(`Original size: ${(inputStats.size / 1024).toFixed(2)} KB`);
        console.log(`WebP size: ${(outputStats.size / 1024).toFixed(2)} KB`);
        console.log(`Size reduction: ${reduction}%`);

    } catch (error) {
        console.error('Error:', error.message);
        console.log('\n⚠️  Sharp not installed. Installing...');
        process.exit(1);
    }
}

convertToWebP();
