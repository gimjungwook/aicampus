'use client'

import { useState, useTransition, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader, ImageUploader } from '@/components/admin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import {
  getAdminCourse,
  getAdminCategories,
  updateCourse,
  deleteCourse,
} from '@/lib/actions/admin'
import { getCourseSectionImages } from '@/lib/actions/course'
import { ImageSectionEditor } from '@/components/course/detail/ImageSectionEditor'
import type { Category, Course, CourseFormData } from '@/lib/types/admin'
import type { CourseSectionImage } from '@/lib/types/course'
import { Trash2 } from 'lucide-react'

interface CourseEditPageProps {
  params: Promise<{ id: string }>
}

export default function CourseEditPage({ params }: CourseEditPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sectionImages, setSectionImages] = useState<Record<string, CourseSectionImage[]>>({
    intro: [],
    features: [],
    instructor: [],
  })

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    thumbnail_url: null,
    category_id: null,
    difficulty: 'beginner',
    estimated_hours: null,
    price: null,
    access_level: 'free',
    is_hot: false,
    is_best: false,
    is_new: false,
  })

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [courseData, categoriesData, sectionImagesData] = await Promise.all([
        getAdminCourse(id),
        getAdminCategories(),
        getCourseSectionImages(id),
      ])

      setSectionImages(sectionImagesData)

      if (courseData) {
        setCourse(courseData)
        setFormData({
          title: courseData.title,
          description: courseData.description,
          thumbnail_url: courseData.thumbnail_url,
          category_id: courseData.category_id,
          difficulty: courseData.difficulty,
          estimated_hours: courseData.estimated_hours,
          price: courseData.price,
          access_level: courseData.access_level || 'free',
          is_hot: courseData.is_hot || false,
          is_best: courseData.is_best || false,
          is_new: courseData.is_new || false,
        })
      }
      setCategories(categoriesData)
      setIsLoading(false)
    }
    loadData()
  }, [id])

  // 섹션 이미지 새로고침
  async function refreshSectionImages() {
    const data = await getCourseSectionImages(id)
    setSectionImages(data)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.title) {
      setError('제목은 필수입니다.')
      return
    }

    startTransition(async () => {
      const result = await updateCourse(id, formData)

      if (result.success) {
        router.push('/admin/courses')
      } else {
        setError(result.error || '수정 실패')
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCourse(id)

      if (result.success) {
        router.push('/admin/courses')
      } else {
        alert(result.error || '삭제 실패')
      }
    })
  }

  if (isLoading) {
    return (
      <>
        <AdminHeader title="코스 편집" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </main>
      </>
    )
  }

  if (!course) {
    return (
      <>
        <AdminHeader title="코스를 찾을 수 없습니다" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">코스가 존재하지 않습니다</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/admin/courses')}
            >
              코스 목록으로
            </Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AdminHeader
        title="코스 편집"
        description={course.title}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
          {/* 기본 정보 */}
          <div className="rounded border border-border bg-card p-6">
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
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
          <div className="rounded border border-border bg-card p-6">
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
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="beginner">입문</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </select>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="rounded border border-border bg-card p-6">
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
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="free">무료</option>
                  <option value="lite">Lite</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* 배지 설정 */}
          <div className="rounded border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">배지 설정</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              코스 목록에서 표시될 배지를 선택하세요.
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_hot || false}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_hot: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">추천</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    - AI Campus가 추천하는 강의 섹션에 표시
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_best || false}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_best: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">BEST</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    - 실시간 BEST 인기 강의 섹션에 표시
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new || false}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_new: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">NEW</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    - 신규 강의 섹션에 표시
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 섹션 이미지 관리 */}
          <div className="rounded border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">섹션 이미지</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              클래스 소개, 클래스 특징, 강사 소개에 표시될 이미지를 관리합니다.
            </p>

            <div className="space-y-8">
              <ImageSectionEditor
                courseId={id}
                sectionType="intro"
                images={sectionImages.intro || []}
                onUpdate={refreshSectionImages}
              />

              <ImageSectionEditor
                courseId={id}
                sectionType="features"
                images={sectionImages.features || []}
                onUpdate={refreshSectionImages}
              />

              <ImageSectionEditor
                courseId={id}
                sectionType="instructor"
                images={sectionImages.instructor || []}
                onUpdate={refreshSectionImages}
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="rounded bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              코스 삭제
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button type="submit" isLoading={isPending}>
                저장
              </Button>
            </div>
          </div>
        </form>
      </main>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="코스 삭제"
      >
        <p>
          <strong>{course.title}</strong> 코스를 삭제하시겠습니까?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          이 작업은 되돌릴 수 없으며, 모든 모듈과 레슨도 함께 삭제됩니다.
        </p>

        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isPending}>
            삭제
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
