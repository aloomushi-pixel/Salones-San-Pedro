const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/components/Header.tsx',
    'src/utils/blogData.tsx',
    'stitch-prototype.html'
];

const newTextEncoded = encodeURIComponent('¡Hola! Visité su sitio web y me interesa agendar mi evento. ¿Me podrían dar más detalles?');
const correctUrl = `https://wa.me/525557516268?text=${newTextEncoded}`;
const oldUrl = 'https://wa.me/message/U7UANPSABGW4K1';

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace the old URL with the correct one
    content = content.split(oldUrl).join(correctUrl);
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Updated', file);
}

files.forEach(updateFile);
