const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/components/Header.tsx',
    'src/utils/blogData.tsx',
    'stitch-prototype.html'
];

const oldUrl = 'https://wa.me/525557516268?text=%C2%A1Hola!%20Visit%C3%A9%20su%20sitio%20web%20y%20me%20interesa%20agendar%20mi%20evento.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20detalles%3F';
const correctUrl = 'https://api.whatsapp.com/message/U7UANPSABGW4K1?autoload=1&app_absent=0';

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace the old URL with the correct one
    content = content.split(oldUrl).join(correctUrl);
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Updated', file);
}

files.forEach(updateFile);
