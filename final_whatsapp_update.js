const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/components/Header.tsx',
    'src/utils/blogData.tsx',
    'stitch-prototype.html'
];

const newTextEncoded = encodeURIComponent('¡Hola! Visité su sitio web y me interesa agendar mi evento. ¿Me podrían dar más detalles?');
const newUrl = `https://wa.me/526633670431?text=${newTextEncoded}`;
const oldUrl = 'https://api.whatsapp.com/message/U7UANPSABGW4K1?autoload=1&app_absent=0';

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace the old URL with the new correct one
    content = content.split(oldUrl).join(newUrl);
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Updated', file);
}

files.forEach(updateFile);
