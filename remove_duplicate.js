const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx', 'utf-8').split('\n');

// We want to remove lines 459 to 871 (0-indexed lines 458 to 870)
// wait, the lines array might be slightly off if there are different line endings.
// It's safer to find the index of `{/* Sección Gastronomía */}` that occurs AFTER the first `ubicacion` block.

let firstUbicacionEnd = -1;
let duplicateStart = -1;
let duplicateEnd = -1;

// find the second Gastronomia
let gastronomiaCount = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('{/* Sección Gastronomía */}')) {
        gastronomiaCount++;
        if (gastronomiaCount === 2) {
            duplicateStart = i;
            break;
        }
    }
}

if (duplicateStart !== -1) {
    // Find where the duplicate ends by looking for </main>
    for (let i = duplicateStart; i < lines.length; i++) {
        if (lines[i].includes('</main>')) {
            // we want to keep </main>, so duplicate ends at i - 1
            duplicateEnd = i - 1;
            break;
        }
    }
}

if (duplicateStart !== -1 && duplicateEnd !== -1) {
    lines.splice(duplicateStart, duplicateEnd - duplicateStart + 1);
    fs.writeFileSync('src/app/page.tsx', lines.join('\n'));
    console.log('Duplicate removed successfully');
} else {
    console.log('Duplicate not found', { duplicateStart, duplicateEnd });
}
