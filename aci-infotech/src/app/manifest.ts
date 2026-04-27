import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ACI Infotech',
    short_name: 'ACI',
    description: 'Production-Grade Engineering at Enterprise Scale',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0F4BB9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
