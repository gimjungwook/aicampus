import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, BookOpen, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { difficultyLabels } from '@/lib/types/course'
import type { Course, Category, ReviewStats } from '@/lib/types/course'

interface HeroSectionProps {
  course: Course & { category?: Category | null }
  reviewStats: ReviewStats
}

export function HeroSection({ course, reviewStats }: HeroSectionProps) {
  return (
    <section className="bg-[#f5f5f5]">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* 뒤로가기 */}
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          코스 목록
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* 좌측: 텍스트 정보 */}
          <div className="flex-1 space-y-4">
            {/* 뱃지 */}
            <div className="flex flex-wrap items-center gap-2">
              {course.category && (
                <span
                  className="rounded-full px-3 py-1 text-sm font-medium"
                  style={{
                    backgroundColor: course.category.color
                      ? `${course.category.color}20`
                      : 'var(--primary-10)',
                    color: course.category.color || 'var(--primary)',
                  }}
                >
                  {course.category.icon && (
                    <span className="mr-1">{course.category.icon}</span>
                  )}
                  {course.category.name}
                </span>
              )}
              {course.is_new && <Badge variant="new">NEW</Badge>}
              {course.is_best && <Badge variant="best">BEST</Badge>}
              {course.is_hot && <Badge variant="hot">HOT</Badge>}
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
              {course.title}
            </h1>

            {/* 설명 */}
            {course.description && (
              <p className="text-lg text-muted-foreground">
                {course.description}
              </p>
            )}

            {/* 평점 & 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* 평점 */}
              {reviewStats.reviewCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{reviewStats.avgRating}</span>
                  <span className="text-muted-foreground">
                    ({reviewStats.reviewCount}개 리뷰)
                  </span>
                </div>
              )}

              {/* 구분선 */}
              {reviewStats.reviewCount > 0 && (
                <span className="text-border">|</span>
              )}

              {/* 레슨 수 */}
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                {course.total_lessons}개 레슨
              </span>

              {/* 예상 시간 */}
              {course.estimated_hours && (
                <>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />약 {course.estimated_hours}시간
                  </span>
                </>
              )}

              {/* 난이도 */}
              <span className="text-border">|</span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                {difficultyLabels[course.difficulty]}
              </span>
            </div>

            {/* 강사 정보 */}
            {course.instructor_name && (
              <div className="pt-2 text-muted-foreground">
                강사: <span className="font-medium text-foreground">{course.instructor_name}</span>
              </div>
            )}
          </div>

          {/* 우측: 썸네일 */}
          <div className="w-full lg:w-[400px] xl:w-[480px]">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted shadow-lg">
              {course.thumbnail_url ? (
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary/5">
                  <BookOpen className="h-20 w-20 text-primary/40" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
