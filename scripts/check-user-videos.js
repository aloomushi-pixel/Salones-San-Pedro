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
    
    // Find all universal data JSON
    const jsonMatch = data.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        const userDetail = parsed.__DEFAULT_SCOPE__?.['webapp.user-detail'];
        const userInfo = userDetail?.userInfo;
        const itemList = userInfo?.itemList || [];
        console.log('ItemList length:', itemList.length);
        if (itemList.length > 0) {
          itemList.forEach((item, idx) => {
            console.log(`Video #${idx + 1}: ID = ${item.id}, Desc = ${item.desc}`);
          });
        } else {
          console.log('No videos found in itemList. Full userInfo.stats:', userInfo?.stats);
        }
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
