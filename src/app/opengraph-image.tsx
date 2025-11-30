import { ImageResponse } from 'next/og'

export const alt = 'AI Campus - AI 활용 교육 플랫폼'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #58cc02 0%, #46a302 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 24,
              padding: '24px 48px',
              fontSize: 80,
              fontWeight: 'bold',
              color: '#58cc02',
            }}
          >
            AI Campus
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: 'white',
            fontSize: 36,
            fontWeight: 500,
            opacity: 0.95,
          }}
        >
          비기술 직군을 위한 AI 활용 교육 플랫폼
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
