import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { LessonContent } from '@/components/lesson/LessonContent'
import { getLessonContext, isLessonCompleted } from '@/lib/actions/lesson'

interface LessonPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { id } = params
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
  const { id } = params

  if (!id) {
    notFound()
  }

  const context = await getLessonContext(id)

  if (!context) {
    notFound()
  }

  const completed = await isLessonCompleted(id)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* 상단 네비게이션 */}
        <div className="shrink-0 border-b border-border bg-card">
          <div className="px-4 py-3">
            <div className="flex items-center gap-4">
              <Link
                href={`/courses/${context.courseId}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                {context.courseTitle}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium truncate">{context.lesson.title}</span>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 (리사이즈 가능) */}
        <div className="flex-1 overflow-hidden">
          <LessonContent context={context} isCompleted={completed} />
        </div>
      </main>
    </div>
  )
}
