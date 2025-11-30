import { getDashboardStats } from '@/lib/actions/admin'
import { AdminHeader } from '@/components/admin'
import { BookOpen, GraduationCap, Users, Award } from 'lucide-react'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: '총 코스',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: '총 레슨',
      value: stats.totalLessons,
      icon: GraduationCap,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: '총 사용자',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: '총 수강 등록',
      value: stats.totalEnrollments,
      icon: Award,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  return (
    <>
      <AdminHeader title="대시보드" description="AI Campus 콘텐츠 관리" />

      <main className="flex-1 overflow-y-auto p-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빠른 액션 */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">빠른 액션</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/admin/courses/new"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">새 코스 만들기</p>
                <p className="text-sm text-muted-foreground">
                  새로운 코스를 생성합니다
                </p>
              </div>
            </a>

            <a
              href="/admin/categories"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors"
            >
              <div className="rounded-lg bg-green-500/10 p-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">카테고리 관리</p>
                <p className="text-sm text-muted-foreground">
                  코스 카테고리를 관리합니다
                </p>
              </div>
            </a>

            <a
              href="/admin/courses"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors"
            >
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">코스 목록</p>
                <p className="text-sm text-muted-foreground">
                  모든 코스를 확인합니다
                </p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
