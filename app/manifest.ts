import { MetadataRoute } from 'next'

import { APP_NAME } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: `${APP_NAME} is a social site for open discussion and collaboration focused on cutting-edge technology.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
