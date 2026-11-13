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
- **Capacidad de Aforo**: Eventos desde 100 personas hasta grandes galas de 300+ invitados en Salón Diamante y Salón Platino.
- **Horarios de Atención**: Lunes a Sábado 10:00 AM a 7:00 PM (Cotizador Web y WhatsApp activos 24/7).

## Tabla Comparativa de Paquetes y Precios 2026-2027 (MXN por persona)

| Paquete | Precio por Persona | Base 100 Invitados | Duración | Servicios Principales Incluidos |
| :--- | :--- | :--- | :--- | :--- |
| **Paquete Premier** | **$530 MXN** | **$53,000 MXN** | 6 hrs + 30 min recepción | Renta de Salón (Diamante o Platino), Menú gourmet de 3 tiempos y tornafiesta, barra libre de mezcladores con descorche libre, DJ versátil, pista LED, batucada clásica, mantelería imperial, meseros, seguridad y valet parking. |
| **Paquete Plus ⭐ (Más Elegido)** | **$710 MXN** | **$71,000 MXN** | 7 hrs + 30 min recepción | Todo lo del Paquete Premier + **Menú gourmet de 4 tiempos**, **Batucada con Robot LED**, **Mesa de dulces**, **Cabina fotográfica**, **Letras gigantes iluminadas**, **Carrito de shots** y pre-fiesta de cortesía (Lun-Jue). |
| **Paquete All Inclusive** | **$1,010 MXN** | **$101,000 MXN** | 7 hrs + 30 min recepción | Todo lo del Paquete Plus + **Servicio de Limusina de lujo**, **Show de Mariachi en vivo (1 hr)**, **Batucada con Robot Iron Man**, **Video filmación y fotos con álbum**, **Cabina 360°** y **1 botella de licor por mesa**. |

## Paquete Intermedio de Servicios Adicionales (Combo Fiesta VIP)
- **Combo Fiesta VIP (+$11,500 MXN total con 20% de descuento)**: Incluye **Servicio de Limusina + Carrito de Shots iluminado en pista + Letras Gigantes LED** (Ahorro de $3,000 MXN respecto a contratarlos por separado). Ideal para complementar el Paquete Premier ($530 p/p).

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
