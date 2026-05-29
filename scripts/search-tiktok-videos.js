const https = require('https');

const query = 'site:tiktok.com wedding decor video';
const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const decoded = decodeURIComponent(data);
    
    // Find all video IDs: /video/(\d{15,22})
    const regex = /\/video\/(\d{15,22})/g;
    let match;
    const ids = new Set();
    while ((match = regex.exec(decoded)) !== null) {
      ids.add(match[1]);
    }
    
    console.log('Found video IDs:', Array.from(ids));
  });
}).on('error', (err) => {
  console.error('Error fetching search results:', err.message);
});
