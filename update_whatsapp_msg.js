const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/components/Header.tsx',
    'src/utils/blogData.tsx',
    'stitch-prototype.html'
];

const oldText = 'Hola,%20vengo%20de%20la%20landing%20page%20y%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n.';
const newText = encodeURIComponent('¡Hola! Visité su sitio web y me interesa agendar mi evento. ¿Me podrían dar más detalles?');

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace the old URL text with the new one
    content = content.split(oldText).join(newText);
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Updated', file);
}

files.forEach(updateFile);
