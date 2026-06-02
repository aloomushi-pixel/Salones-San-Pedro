import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

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
  description: "Salón de eventos exclusivos en la alcaldía Gustavo A. Madero, CDMX. Creamos experiencias de alta gama y banquetes de lujo con elegancia contemporánea.",
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
    "@type": "EventVenue",
    "name": "Salones San Pedro plus",
    "image": "https://sanpedro.aionia.com.mx/hero_bg.jpg",
    "@id": "https://sanpedro.aionia.com.mx/#venue",
    "url": "https://sanpedro.aionia.com.mx",
    "telephone": "+525557516268",
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
    "sameAs": [
      "https://www.facebook.com/salonsanpedroplus/"
    ]
  };

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
