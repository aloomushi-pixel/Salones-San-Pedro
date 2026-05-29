import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if exists
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const index = trimmed.indexOf('=');
            if (index > -1) {
                const key = trimmed.substring(0, index).trim();
                const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
                process.env[key] = value;
            }
        }
    });
}

async function runPSI() {
    const urls = [
        'https://sanpedro.aionia.com.mx',
        'https://sanpedro.aionia.com.mx/blog'
    ];
    for (const url of urls) {
        console.log(`\n--- Running PSI for ${url} (Mobile) ---`);
        let apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile`;
        if (process.env.PAGESPEED_API_KEY) {
            console.log('Using PAGESPEED_API_KEY from environment.');
            apiUrl += `&key=${process.env.PAGESPEED_API_KEY}`;
        } else {
            console.log('Running anonymously (no PAGESPEED_API_KEY found).');
        }
        
        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            if (data.error) {
                console.error('API Error:', data.error.message);
                continue;
            }
            if (!data.lighthouseResult) {
                console.log('No lighthouseResult:', data);
                continue;
            }
            const c = data.lighthouseResult.categories;
            console.log('Performance:', c.performance.score * 100);
            console.log('Accessibility:', c.accessibility.score * 100);
            console.log('Best Practices:', c['best-practices'].score * 100);
            console.log('SEO:', c.seo.score * 100);

            // Log main opportunities
            const audits = data.lighthouseResult.audits;
            console.log('\nOpportunities / Diagnostics:');
            Object.keys(audits).forEach(k => {
                const audit = audits[k];
                if (audit.score !== null && audit.score < 0.9 && audit.details && (audit.details.type === 'opportunity' || audit.details.type === 'diagnostic')) {
                    console.log(`- ${audit.title} (${k}): ${audit.displayValue || ''}`);
                }
            });
        } catch (err) {
            console.error('Fetch error:', err);
        }
    }
}
runPSI();
