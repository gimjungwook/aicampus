import type { Metadata } from 'next'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  ),
  title: 'AI Campus - AI 활용 교육 플랫폼',
  description: '비기술 직군을 위한 AI 활용 교육 플랫폼. Google Gemini를 활용한 실습 중심 학습.',
  keywords: ['AI', '인공지능', '교육', 'Gemini', '비기술직', '업무자동화'],
  authors: [{ name: 'AI Campus' }],
  openGraph: {
    title: 'AI Campus - AI 활용 교육 플랫폼',
    description: '비기술 직군을 위한 AI 활용 교육 플랫폼',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
