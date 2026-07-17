const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/components/Header.tsx',
    'src/utils/blogData.tsx',
    'stitch-prototype.html'
];

const newLink = 'https://api.whatsapp.com/send?phone=525557516268&text=Hola,%20vengo%20de%20la%20landing%20page%20y%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n.';

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace href="#disponibilidad" on <a> tags with the new link and add target="_blank"
    // Note: some might already have target="_blank", but let's just do a simple replace
    content = content.replace(/href="#disponibilidad"/g, `href="${newLink}" target="_blank" rel="noopener noreferrer"`);
    content = content.replace(/href="\/#disponibilidad"/g, `href="${newLink}" target="_blank" rel="noopener noreferrer"`);

    // Replace old WA links
    content = content.replace(/https:\/\/api\.whatsapp\.com\/message\/U7UANPSABGW4K1\?autoload=1&app_absent=0/g, newLink);
    content = content.replace(/https:\/\/wa\.me\/message\/U7UANPSABGW4K1/g, newLink);
    
    // Clean up duplicate target="_blank" if any
    content = content.replace(/target="_blank" target="_blank"/g, 'target="_blank"');
    content = content.replace(/rel="noopener noreferrer" rel="noopener noreferrer"/g, 'rel="noopener noreferrer"');
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Updated', file);
}

files.forEach(updateFile);
