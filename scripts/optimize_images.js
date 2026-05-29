const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'frontend', 'src', 'pages', 'services');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add loading="lazy" to all <img tags that don't have it and don't have fetchPriority="high"
    content = content.replace(/<img(?!\s+[^>]*loading=)(?!\s+[^>]*fetchPriority="high")[^>]*>/gi, match => {
        return match.replace('<img', '<img loading="lazy"');
    });

    // For background hero images, let's add preload in Helmet if not present
    // First, find the hero background image url
    const bgMatch = content.match(/style=\{\{\s*backgroundImage:\s*`url\('([^']+)'\)`\s*\}\}/);
    if (bgMatch) {
        const heroUrl = bgMatch[1];
        // Check if there's already a preload for it
        if (!content.includes('<link rel="preload" as="image"')) {
            // inject in Helmet
            content = content.replace(/<\/Helmet>/, `    <link rel="preload" as="image" href="${heroUrl}" fetchpriority="high" />\n            </Helmet>`);
        }
    }

    fs.writeFileSync(filePath, content);
}
console.log('Images optimized for lazy loading and LCP preload.');
