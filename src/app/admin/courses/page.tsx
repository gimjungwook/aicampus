import Link from 'next/link'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/Button'
import { getAdminCourses } from '@/lib/actions/admin'
import { Plus, Pencil, FolderOpen } from 'lucide-react'
import Image from 'next/image'

export default async function CoursesPage() {
  const courses = await getAdminCourses()

  return (
    <>
      <AdminHeader title="코스 관리" description="모든 코스를 관리합니다" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {courses.length}개의 코스
          </p>
          <Link href="/admin/courses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 코스 만들기
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded border border-dashed border-border py-12">
            <p className="text-muted-foreground">아직 코스가 없습니다</p>
            <Link href="/admin/courses/new">
              <Button variant="outline" className="mt-4">
                첫 코스 만들기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded border border-border bg-card"
              >
                {/* 썸네일 */}
                <div className="relative aspect-video bg-muted">
                  {course.thumbnail_url ? (
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* 정보 */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold line-clamp-1">
                        {course.title}
                      </h3>
                      {course.category && (
                        <span className="text-xs text-muted-foreground">
                          {course.category.name}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        course.difficulty === 'beginner'
                          ? 'bg-green-500/10 text-green-500'
                          : course.difficulty === 'intermediate'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {course.difficulty === 'beginner'
                        ? '입문'
                        : course.difficulty === 'intermediate'
                        ? '중급'
                        : '고급'}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {course.description || '설명 없음'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{course.total_lessons}개 레슨</span>
                    <div className="flex gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/courses/${course.id}/modules`}>
                        <Button variant="outline" size="sm">
                          모듈 관리
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
