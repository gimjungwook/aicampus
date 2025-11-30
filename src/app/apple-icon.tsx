import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(135deg, #58cc02 0%, #46a302 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '40px',
          fontWeight: 'bold',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '-0.05em',
        }}
      >
        AI
      </div>
    ),
    {
      ...size,
    }
  )
}
