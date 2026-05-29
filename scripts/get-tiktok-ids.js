const https = require('https');

const options = {
  hostname: 'www.tiktok.com',
  path: '/@salones_sanpedroplus',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    // Find all occurrences of "video/7..."
    const regex = /video\/(\d+)/g;
    let match;
    const ids = new Set();
    while ((match = regex.exec(data)) !== null) {
      ids.add(match[1]);
    }
    console.log('Found video IDs:', Array.from(ids));
    
    // Also try to find __UNIVERSAL_DATA_FOR_REHYDRATION__
    const jsonMatch = data.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
    if (jsonMatch) {
      console.log('Found universal data script! Parsing...');
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        console.log('JSON keys:', Object.keys(parsed));
        // Save to file for further inspection if needed
        const fs = require('fs');
        fs.writeFileSync('tiktok_data.json', JSON.stringify(parsed, null, 2));
        console.log('Saved tiktok_data.json');
      } catch (e) {
        console.error('Error parsing JSON:', e.message);
      }
    } else {
      console.log('Universal data script not found');
    }
  });
}).on('error', (err) => {
  console.error('Error fetching page:', err.message);
});
