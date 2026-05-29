import { Resend } from 'resend';

const apiKey = 're_Q2YrnDaU_P8mEqdaB1H6AfdgLsBCoS7Sy';
const resend = new Resend(apiKey);

async function run() {
  try {
    console.log('--- Probando API Key de Resend ---');
    console.log('Listando dominios...');
    
    // Podemos usar fetch directo para obtener más detalles si es necesario
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Respuesta de /domains:', JSON.stringify(data, null, 2));

    console.log('\nIntentando enviar un correo de prueba...');
    const sendRes = await resend.emails.send({
      from: 'Salones San Pedro <ventas@sanpedro.com.mx>',
      to: 'juangarcia@ccurity.com.mx',
      subject: 'Prueba de Conexión Resend',
      html: '<p>Este es un correo de prueba para verificar la configuración de Resend.</p>'
    });
    
    console.log('Respuesta de envío:', JSON.stringify(sendRes, null, 2));
  } catch (error) {
    console.error('Error durante la prueba:', error);
  }
}

run();
