import { notFound } from 'next/navigation'
import { LessonContent } from '@/components/lesson/LessonContent'
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

  if (!id) {
    notFound()
  }

  const context = await getLessonContext(id)

  if (!context) {
    notFound()
  }

  const completed = await isLessonCompleted(id)

  return (
    <div className="h-screen overflow-hidden">
      <LessonContent context={context} isCompleted={completed} />
    </div>
  )
}
