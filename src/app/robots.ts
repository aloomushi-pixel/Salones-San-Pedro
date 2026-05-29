import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://sanpedro.aionia.com.mx';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
export const dynamic = 'force-static';
