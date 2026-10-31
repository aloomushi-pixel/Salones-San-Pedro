import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import UXMonitorProvider from "@/components/UXMonitorProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SALONES SAN PEDRO | Eventos de Alta Gama en Gustavo A. Madero, CDMX",
  description:
    "Salón de eventos exclusivos en la alcaldía Gustavo A. Madero, CDMX. Creamos experiencias de alta gama y banquetes de lujo con elegancia contemporánea.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EventVenue", "LocalBusiness"],
        "name": "Salones San Pedro Plus",
        "alternateName": "Salones San Pedro CDMX - Salón Diamante y Salón Platino",
        "description":
          "Salones de eventos de lujo en Gustavo A. Madero, Ciudad de México para bodas, XV años, graduaciones, bautizos y eventos empresariales. Paquetes todo incluido desde $530 MXN por persona con capacidad de 50 a 300 invitados.",
        "image": [
          "https://sanpedro.aionia.com.mx/hero_bg.jpg",
          "https://sanpedro.aionia.com.mx/galeria/diamante/diamante_1.jpg",
          "https://sanpedro.aionia.com.mx/galeria/platino/platino_1.jpg"
        ],
        "@id": "https://sanpedro.aionia.com.mx/#venue",
        "url": "https://sanpedro.aionia.com.mx",
        "telephone": "+525557516268",
        "priceRange": "$530 - $1,010 MXN por persona",
        "maximumAttendeeCapacity": 300,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Calle Nte 84 No. 6507, San Pedro el Chico",
          "addressLocality": "Gustavo A. Madero",
          "addressRegion": "Ciudad de México",
          "postalCode": "07800",
          "addressCountry": "MX"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 19.469571,
          "longitude": -99.098881
        },
        "areaServed": [
          { "@type": "AdministrativeArea", "name": "Gustavo A. Madero, CDMX" },
          { "@type": "AdministrativeArea", "name": "Miguel Hidalgo, CDMX" },
          { "@type": "AdministrativeArea", "name": "Cuauhtémoc, CDMX" },
          { "@type": "AdministrativeArea", "name": "Venustiano Carranza, CDMX" },
          { "@type": "AdministrativeArea", "name": "Azcapotzalco, CDMX" },
          { "@type": "AdministrativeArea", "name": "Tlalnepantla de Baz, Estado de México" },
          { "@type": "AdministrativeArea", "name": "Tecámac y Ecatepec, Estado de México" }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "350",
          "bestRating": "5"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "10:00",
          "closes": "19:00"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Paquetes Todo Incluido Salones San Pedro Plus 2026-2027",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Paquete Premier",
              "description":
                "Disponible desde 50 personas. Incluye 6 horas de servicio + 1/2 hr recepción, menú formal a 3 tiempos y tornafiesta, barra libre de mezcladores con descorche libre, DJ, iluminación, pista LED, batucada clásica y montaje imperial con mesa de cristal.",
              "price": "530",
              "priceCurrency": "MXN",
              "eligibleQuantity": {
                "@type": "QuantitativeValue",
                "minValue": 50,
                "maxValue": 300,
                "unitText": "personas"
              }
            },
            {
              "@type": "Offer",
              "name": "Paquete Plus (El Más Elegido)",
              "description":
                "Disponible a partir de 100 personas. Incluye todo el Paquete Premier más: 7 horas de servicio, menú formal a 4 tiempos, batucada espectacular con Robot LED, mesa de dulces, cabina fotográfica, letras gigantes, carrito de shots y pre-fiesta de cortesía para 30 personas (Lunes a Jueves, 4 hrs).",
              "price": "710",
              "priceCurrency": "MXN",
              "eligibleQuantity": {
                "@type": "QuantitativeValue",
                "minValue": 100,
                "maxValue": 300,
                "unitText": "personas"
              }
            },
            {
              "@type": "Offer",
              "name": "Paquete All Inclusive",
              "description":
                "Disponible a partir de 100 personas. Incluye todo el Paquete Plus más: Batucada con Robot Iron Man, 1 hora de Mariachi en vivo, Servicio de Limusina, video filmación y fotos con álbum, vino espumoso, 1 botella de licor por mesa y Cabina 360 (1.30 hrs).",
              "price": "1010",
              "priceCurrency": "MXN",
              "eligibleQuantity": {
                "@type": "QuantitativeValue",
                "minValue": 100,
                "maxValue": 300,
                "unitText": "personas"
              }
            }
          ]
        },
        "sameAs": [
          "https://www.facebook.com/salonsanpedroplus/",
          "https://www.tiktok.com/@salones_sanpedroplus"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://sanpedro.aionia.com.mx/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cuáles son los precios por persona y paquetes en Salones San Pedro Plus CDMX?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Contamos con 3 niveles de paquetes todo incluido en Gustavo A. Madero, CDMX: 1) Paquete Premier desde $530 MXN por persona (disponible desde 50 invitados), 2) Paquete Plus desde $710 MXN por persona (a partir de 100 invitados, incluye 7 horas, menú de 4 tiempos, Robot LED, mesa de dulces, cabina de fotos, letras gigantes y carrito de shots), y 3) Paquete All Inclusive desde $1,010 MXN por persona (incluye además Limusina, 1 hora de Mariachi, foto y video, Cabina 360 y botella por mesa)."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuál es el mínimo de personas para rentar un salón en Salones San Pedro Plus?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El mínimo es de 50 personas con nuestro Paquete Premier ($530 MXN p/p). A partir de 100 personas se habilitan además los paquetes Plus ($710 MXN p/p) y All Inclusive ($1,010 MXN p/p)."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué beneficios hay por reservar en Viernes o Domingo en lugar de Sábado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Al elegir Viernes o Domingo obtienes nuestra Tarifa Preferencial más baja por persona y 1 Cortesía VIP adicional sin cargo (como Letras Gigantes iluminadas o recepción especial), además de mayor disponibilidad de fechas en temporada alta."
            }
          },
          {
            "@type": "Question",
            "name": "¿Dónde están ubicados los Salones Diamante y Platino de San Pedro Plus?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Estamos ubicados en Calle Norte 84 No. 6507, Col. San Pedro el Chico, Alcaldía Gustavo A. Madero, CP 07800, Ciudad de México (a 5 minutos de Eduardo Molina y Circuito Interior), con fácil acceso desde Miguel Hidalgo, Cuauhtémoc, Venustiano Carranza, Tlalnepantla y Tecámac."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        <UXMonitorProvider>{children}</UXMonitorProvider>
      </body>
    </html>
  );
}
