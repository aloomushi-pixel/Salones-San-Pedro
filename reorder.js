const fs = require('fs');
const lines = fs.readFileSync('src/app/page.tsx', 'utf-8').split('\n');

function getBlock(startMarker, endMarker) {
    let startIdx = -1;
    let endIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(startMarker)) {
            startIdx = i;
            break;
        }
    }
    if (startIdx === -1) return [];
    
    if (endMarker) {
        for (let i = startIdx + 1; i < lines.length; i++) {
            if (lines[i].includes(endMarker)) {
                endIdx = i;
                break;
            }
        }
    } else {
        let stack = 0;
        let inSection = false;
        for (let i = startIdx; i < lines.length; i++) {
            if (lines[i].includes('<section')) {
                stack++;
                inSection = true;
            }
            if (lines[i].includes('</section>')) {
                stack--;
                if (inSection && stack === 0) {
                    endIdx = i;
                    break;
                }
            }
        }
    }
    return lines.slice(startIdx, endIdx + 1);
}

const hero = getBlock('{/* Hero Section */}', '</section>');
const gastronomia = getBlock('{/* Sección Gastronomía */}', '</section>');
const animacion = getBlock('id="animacion"', '</section>');
const paquetes = getBlock('id="paquetes"', '</section>');
const galeria = getBlock('id="galeria"', '</section>');
const tiktok = getBlock('id="tiktok-videos"', '</section>');
const testimonios = getBlock('id="testimonios"', '</section>');
const disponibilidad = getBlock('id="disponibilidad"', '</section>');
const ubicacion = getBlock('{/* Sección Ubicación */}', '</section>');

function adjustStart(block) {
    if(!block.length) return block;
    const firstLine = block[0];
    const idx = lines.indexOf(firstLine);
    if (idx > 0 && lines[idx-1].includes('{/*')) {
        return [lines[idx-1], ...block];
    }
    return block;
}

const animacionBlock = adjustStart(animacion);
const paquetesBlock = adjustStart(paquetes);
const galeriaBlock = adjustStart(galeria);
const tiktokBlock = adjustStart(tiktok);
const testimoniosBlock = adjustStart(testimonios);
const disponibilidadBlock = adjustStart(disponibilidad);

const startReplace = lines.indexOf(hero[0]);
const endReplace = lines.indexOf(ubicacion[ubicacion.length-1]);

if(startReplace === -1 || endReplace === -1) {
    console.log('Error finding boundaries');
    process.exit(1);
}

const newLines = [
    ...lines.slice(0, startReplace),
    ...hero, '',
    ...paquetesBlock, '',
    ...galeriaBlock, '',
    ...tiktokBlock, '',
    ...disponibilidadBlock, '',
    ...gastronomia, '',
    ...animacionBlock, '',
    ...testimoniosBlock, '',
    ...ubicacion,
    ...lines.slice(endReplace + 1)
];

fs.writeFileSync('src/app/page.tsx', newLines.join('\n'));
console.log('Reordered page.tsx successfully');
