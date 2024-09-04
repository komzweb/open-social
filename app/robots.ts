import { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/login/', '/register/', '/verify-request/', '/new/', '/u/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
