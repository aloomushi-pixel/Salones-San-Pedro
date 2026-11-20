import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://sanpedro.aionia.com.mx';
  return {
    rules: [
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Claude-SearchBot',
        ],
        allow: '/',
        disallow: ['/admin', '/admin/login'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
export const dynamic = 'force-static';
