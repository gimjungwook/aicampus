'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader, ImageUploader } from '@/components/admin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createCourse, getAdminCategories } from '@/lib/actions/admin'
import type { Category, CourseFormData } from '@/lib/types/admin'

export default function NewCoursePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    thumbnail_url: null,
    category_id: null,
    difficulty: 'beginner',
    estimated_hours: null,
    price: null,
    access_level: 'free',
  })

  useEffect(() => {
    async function loadCategories() {
      const data = await getAdminCategories()
      setCategories(data)
    }
    loadCategories()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.title) {
      setError('제목은 필수입니다.')
      return
    }

    startTransition(async () => {
      const result = await createCourse(formData)

      if (result.success && result.data) {
        router.push(`/admin/courses/${result.data.id}/modules`)
      } else {
        setError(result.error || '생성 실패')
      }
    })
  }

  return (
    <>
      <AdminHeader title="새 코스 만들기" description="새로운 코스를 생성합니다" />

      <main className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
          {/* 기본 정보 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">기본 정보</h2>

            <div className="space-y-4">
              <Input
                label="코스 제목"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="예: AI 프롬프트 마스터 클래스"
                required
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium">설명</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="코스에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  썸네일 이미지
                </label>
                <ImageUploader
                  value={formData.thumbnail_url}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, thumbnail_url: url }))
                  }
                  folder="courses"
                />
              </div>
            </div>
          </div>

          {/* 분류 정보 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">분류</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  카테고리
                </label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category_id: e.target.value || null,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">카테고리 없음</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">난이도</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value as CourseFormData['difficulty'],
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="beginner">입문</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </select>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">추가 정보</h2>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="예상 학습 시간 (시간)"
                type="number"
                value={formData.estimated_hours || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimated_hours: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                placeholder="예: 10"
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  접근 레벨
                </label>
                <select
                  value={formData.access_level}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      access_level: e.target.value as CourseFormData['access_level'],
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="free">무료</option>
                  <option value="lite">Lite</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button type="submit" isLoading={isPending}>
              코스 생성
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
