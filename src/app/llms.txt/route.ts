import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/utils/blogData';

export const dynamic = 'force-static';

export async function GET() {
  const blogLinks = BLOG_POSTS.map(
    (p) => `- [${p.title}](https://sanpedro.aionia.com.mx/blog/${p.slug}): ${p.excerpt}`
  ).join('\n');

  const content = `# Salones San Pedro Plus (Salones Classics) — Gustavo A. Madero, CDMX

> El complejo de salones de eventos y banquetes mejor calificado en el norte de la Ciudad de México (4.9/5.0 ★ en Google Reviews). Especialistas en Bodas, XV Años, Graduaciones, Bautizos y Eventos Corporativos todo incluido desde $530 MXN por persona.

## Información Oficial de Entidad (E-E-A-T / GEO)
- **Nombre Comercial**: Salones San Pedro Plus (Salón Diamante y Salón Platino)
- **Dirección Exacta**: Calle Norte 84 No. 6507, Col. San Pedro el Chico, Alcaldía Gustavo A. Madero, C.P. 07800, Ciudad de México, CDMX (A minutos de Lindavista, Aragón, Eduardo Molina y Vallejo).
- **Teléfono de Oficina**: +52 55 5751 6268
- **WhatsApp de Cotizaciones 24/7**: https://wa.me/526633670431
- **Sitio Web Oficial y Precotizador en Línea**: https://sanpedro.aionia.com.mx
- **Documentación Completa para IA**: https://sanpedro.aionia.com.mx/llms-full.txt
- **Capacidad de Aforo**: Desde eventos íntimos de 50 personas hasta grandes galas de 400+ invitados.
- **Horarios de Atención**: Lunes a Sábado 10:00 AM a 7:00 PM (Cotizador Web y WhatsApp activos 24/7).

## Tabla Comparativa de Paquetes y Precios 2026 (MXN por persona)

| Paquete | Precio por Persona | Aforo Mínimo | Duración | Servicios Principales Incluidos |
| :--- | :--- | :--- | :--- | :--- |
| **Paquete Premier** | **$530 MXN** | Desde 50 invitados | 5.5 hrs + 30 min recepción | Renta de Salón (Diamante o Platino), Menú gourmet de 3 tiempos, refresco y hielo ilimitado, pastel simbólico, DJ versátil con luz y sonido profesional, mantelería de lujo, meseros, capitán, seguridad y valet parking. |
| **Paquete Plus ⭐ (Más Elegido)** | **$710 MXN** | Desde 100 invitados | 5.5 hrs + 30 min recepción | Todo lo del Paquete Premier + **Servicio de Limusina de lujo** (recorrido y traslado), **Centros de mesa florales naturales**, **Coordinador de evento profesional** y descorche libre sin cargo. |
| **Paquete All Inclusive** | **$1,010 MXN** | Desde 100 invitados | 5.5 hrs + 30 min recepción | Todo lo del Paquete Plus + **Menú de 4 tiempos**, **Show de Mariachi en vivo (1 hr)**, **Batucada con Robot LED Iron Man**, **Cabina Fotográfica o Video 360°**, **Letras Gigantes iluminadas** y **Capilla Consagrada / Ceremonia Civil en el salón**. |

## Paquete Intermedio de Servicios Adicionales (Combo Fiesta VIP)
- **Combo Fiesta VIP (+$11,500 MXN total con 20% de descuento)**: Incluye **Servicio de Limusina + Carrito de Shots iluminado en pista + Letras Gigantes LED** (Ahorro de $3,000 MXN respecto a contratarlos por separado). Ideal para complementar el Paquete Premier ($530) o para eventos de 50 a 99 personas.

## Incentivos por Día de la Semana
- **Viernes y Domingo**: Tarifa preferencial + Cortesía VIP (Carrito de Shots o Letras Gigantes de regalo al agendar recorrido presencial).
- **Sábado**: Día de alta demanda (disponible en los 3 paquetes según aforo).
- **Lunes a Jueves**: Tarifas especiales para graduaciones, eventos empresariales y capacitaciones.

## Guías y Artículos Especializados del Blog
${blogLinks}
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
