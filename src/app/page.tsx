import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { BookOpen, Target, Lightbulb } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: '실습 중심',
    description: '이론보다 실습! 직접 해보며 배워요.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Target,
    title: '맞춤 커리큘럼',
    description: '비기술직을 위해 설계된 과정이에요.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Lightbulb,
    title: '무료 체험',
    description: 'AI 샌드박스를 무료로 체험해보세요.',
    color: 'bg-purple-100 text-purple-600',
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Duolingo Style */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            {/* Big Icon/Character */}
            <div className="mb-8 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-20 w-20 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
            </div>

            {/* Headline */}
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              AI 배우기, 쉽고 재미있게.
            </h1>

            {/* Subheadline */}
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              코딩 없이 AI를 업무에 활용하는 방법을 배워보세요.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <Link href="/courses">
                <Button size="xl">지금 시작하기</Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{' '}
                <Link href="/courses" className="font-semibold text-primary hover:underline">
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-y bg-muted/30 py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
              왜 AI Campus인가요?
            </h2>

            <div className="grid gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-sm"
                >
                  <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color}`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              지금 바로 시작하세요
            </h2>
            <p className="mb-8 text-muted-foreground">
              무료로 AI 활용법을 배워보세요. 5분이면 시작할 수 있어요.
            </p>
            <Link href="/courses">
              <Button size="lg">무료로 시작하기</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
