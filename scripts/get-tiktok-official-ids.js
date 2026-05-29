const https = require('https');

const options = {
  hostname: 'www.tiktok.com',
  path: '/@tiktok',
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
  });
}).on('error', (err) => {
  console.error('Error fetching page:', err.message);
});
