import { ImageResponse } from 'next/og'

import { APP_NAME } from '@/lib/constants'

export const runtime = 'edge'

export const alt = APP_NAME
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const montserratExtraBold = fetch(
    new URL('./Montserrat-ExtraBold.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          color: '#14b8a6',
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {APP_NAME}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Montserrat',
          data: await montserratExtraBold,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
