'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { EnrolledCourses, ProfileEditForm, AccountSettings } from '@/components/mypage'
import { useAuth } from '@/components/auth/AuthProvider'
import { getProfile, getEnrolledCourses } from '@/lib/actions/profile'
import type { Profile, EnrolledCourseWithProgress } from '@/lib/types/user'
import { BookOpen, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/Skeleton'

type TabType = 'courses' | 'profile' | 'settings'

// 스켈레톤 로딩 컴포넌트
function MyPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* 페이지 헤더 스켈레톤 */}
          <div className="mb-8">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="mt-3 h-5 w-64" />
          </div>

          {/* 탭 스켈레톤 */}
          <div className="mb-8 flex gap-4 border-b border-border pb-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>

          {/* 콘텐츠 스켈레톤 - 코스 카드 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-sm border border-border bg-card">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                  <div className="mb-2 flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="mb-3 h-6 w-full" />
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="mb-4 h-2 w-full rounded-full" />
                  <Skeleton className="h-10 w-full rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MyPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [courses, setCourses] = useState<EnrolledCourseWithProgress[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('courses')
  const [isLoading, setIsLoading] = useState(true)

  // 로그인 확인
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/?login=required&next=/mypage')
    }
  }, [user, authLoading, router])

  // 데이터 로드
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setIsLoading(true)
      const [profileData, coursesData] = await Promise.all([
        getProfile(),
        getEnrolledCourses(),
      ])
      setProfile(profileData)
      setCourses(coursesData)
      setIsLoading(false)
    }

    loadData()
  }, [user])

  const handleProfileUpdate = async () => {
    const newProfile = await getProfile()
    setProfile(newProfile)
  }

  const tabs = [
    { id: 'courses' as const, label: '학습 중인 코스', icon: BookOpen },
    { id: 'profile' as const, label: '프로필', icon: User },
    { id: 'settings' as const, label: '설정', icon: Settings },
  ]

  if (authLoading || isLoading) {
    return <MyPageSkeleton />
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              마이페이지
            </h1>
            <p className="mt-2 text-muted-foreground">
              학습 현황을 확인하고 프로필을 관리하세요.
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mb-8 flex gap-2 overflow-x-auto border-b border-border pb-px">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          <div>
            {activeTab === 'courses' && (
              <EnrolledCourses courses={courses} />
            )}

            {activeTab === 'profile' && (
              <div className="mx-auto max-w-md">
                <div className="rounded-sm border border-border bg-card p-6">
                  <ProfileEditForm
                    profile={profile}
                    onUpdate={handleProfileUpdate}
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="mx-auto max-w-md">
                <AccountSettings />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
