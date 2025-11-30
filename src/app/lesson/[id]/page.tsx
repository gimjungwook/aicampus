import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { YouTubePlayer } from '@/components/lesson/YouTubePlayer'
import { LessonSandbox } from '@/components/lesson/LessonSandbox'
import { LessonNavigation } from '@/components/lesson/LessonNavigation'
import { getLessonContext, isLessonCompleted } from '@/lib/actions/lesson'

interface LessonPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { id } = await params
  const context = await getLessonContext(id)

  if (!context) {
    return { title: '레슨을 찾을 수 없습니다 | AI Campus' }
  }

  return {
    title: `${context.lesson.title} | ${context.courseTitle} | AI Campus`,
    description: context.lesson.description || `${context.lesson.title} 레슨을 학습해보세요.`,
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params
  const context = await getLessonContext(id)

  if (!context) {
    notFound()
  }

  const completed = await isLessonCompleted(id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* 상단 네비게이션 */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href={`/courses/${context.courseId}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                {context.courseTitle}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium">{context.lesson.title}</span>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* lg 이상: 좌우 배치 */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* 왼쪽: 영상 + 네비게이션 (60%) */}
            <div className="flex flex-col gap-4 lg:w-[60%]">
              {/* 영상 플레이어 */}
              <YouTubePlayer
                videoId={context.lesson.youtube_video_id}
                title={context.lesson.title}
              />

              {/* 레슨 정보 */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <h1 className="mb-2 text-xl font-bold">{context.lesson.title}</h1>
                {context.lesson.description && (
                  <p className="text-sm text-muted-foreground">
                    {context.lesson.description}
                  </p>
                )}
                {context.lesson.duration_minutes && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    약 {context.lesson.duration_minutes}분
                  </p>
                )}
              </div>

              {/* 네비게이션 */}
              <LessonNavigation context={context} isCompleted={completed} />
            </div>

            {/* 오른쪽: AI 샌드박스 (40%) */}
            <div className="h-[600px] lg:h-auto lg:min-h-[700px] lg:w-[40%]">
              <LessonSandbox
                lessonId={context.lesson.id}
                lessonTitle={context.lesson.title}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
