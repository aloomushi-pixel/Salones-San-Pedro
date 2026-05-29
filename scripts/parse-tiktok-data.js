const fs = require('fs');

const fileData = fs.readFileSync('tiktok_data.json', 'utf8');
const data = JSON.parse(fileData);

// Recursive search for "itemList" or "ItemModule" or "video" or "id"
function searchKeys(obj, path = '') {
  if (!obj || typeof obj !== 'object') return;
  
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      searchKeys(item, `${path}[${index}]`);
    });
    return;
  }
  
  Object.keys(obj).forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    if (key.toLowerCase().includes('itemlist') || key.toLowerCase().includes('itemmodule') || key.toLowerCase().includes('videolist')) {
      console.log(`Found list key at: ${currentPath}`);
      if (Array.isArray(obj[key])) {
        console.log(`Array length: ${obj[key].length}`);
        console.log(`First item:`, JSON.stringify(obj[key][0], null, 2).substring(0, 300));
      } else {
        console.log(`Type: ${typeof obj[key]}`);
      }
    }
    
    // If it's a string that matches a 19 digit number, it might be a video ID
    if (typeof obj[key] === 'string' && /^\d{18,20}$/.test(obj[key])) {
      // Check if parent has keys like desc, createTime, video, etc.
      if (obj.desc || obj.createTime || obj.video || obj.music) {
        console.log(`Found potential video ID: ${obj[key]} at ${currentPath}`);
        console.log(`Video title/desc: ${obj.desc}`);
      }
    }
    
    searchKeys(obj[key], currentPath);
  });
}

searchKeys(data);
