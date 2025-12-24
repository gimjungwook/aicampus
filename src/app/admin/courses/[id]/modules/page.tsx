'use client'

import { useState, useEffect, useTransition, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminHeader, SortableList, MarkdownEditor } from '@/components/admin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import {
  getAdminCourse,
  getModulesByCourse,
  getLessonsByModule,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from '@/lib/actions/admin'
import type {
  Course,
  Module,
  Lesson,
  ModuleFormData,
  LessonFormData,
} from '@/lib/types/admin'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  ArrowLeft,
} from 'lucide-react'

interface ModulesPageProps {
  params: Promise<{ id: string }>
}

export default function ModulesPage({ params }: ModulesPageProps) {
  const { id: courseId } = use(params)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [lessonsByModule, setLessonsByModule] = useState<
    Record<string, Lesson[]>
  >({})
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  // Module Modal
  const [moduleModal, setModuleModal] = useState<{
    isOpen: boolean
    editing: Module | null
  }>({ isOpen: false, editing: null })
  const [moduleForm, setModuleForm] = useState<ModuleFormData>({
    title: '',
    description: '',
  })

  // Lesson Modal
  const [lessonModal, setLessonModal] = useState<{
    isOpen: boolean
    moduleId: string | null
    editing: Lesson | null
  }>({ isOpen: false, moduleId: null, editing: null })
  const [lessonForm, setLessonForm] = useState<LessonFormData>({
    title: '',
    description: '',
    content_type: 'video',
    youtube_video_id: '',
    markdown_content: '',
    duration_minutes: null,
    is_free: false,
  })

  // Delete targets
  const [deleteModule, setDeleteModule] = useState<Module | null>(null)
  const [deleteLesson, setDeleteLesson] = useState<Lesson | null>(null)

  const [error, setError] = useState<string | null>(null)

  // Load data
  useEffect(() => {
    loadData()
  }, [courseId])

  async function loadData() {
    setIsLoading(true)
    try {
      const [courseData, modulesData] = await Promise.all([
        getAdminCourse(courseId),
        getModulesByCourse(courseId),
      ])

      setCourse(courseData)
      setModules(modulesData)

      // Load lessons for each module
      const lessonsMap: Record<string, Lesson[]> = {}
      for (const module of modulesData) {
        lessonsMap[module.id] = await getLessonsByModule(module.id)
      }
      setLessonsByModule(lessonsMap)

      // Expand all modules by default
      setExpandedModules(new Set(modulesData.map((m) => m.id)))
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle module expansion
  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  // Module CRUD
  function openModuleModal(module?: Module) {
    if (module) {
      setModuleForm({
        title: module.title,
        description: module.description || '',
      })
      setModuleModal({ isOpen: true, editing: module })
    } else {
      setModuleForm({ title: '', description: '' })
      setModuleModal({ isOpen: true, editing: null })
    }
    setError(null)
  }

  function closeModuleModal() {
    setModuleModal({ isOpen: false, editing: null })
    setError(null)
  }

  async function handleModuleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!moduleForm.title) {
      setError('모듈 제목은 필수입니다.')
      return
    }

    startTransition(async () => {
      const result = moduleModal.editing
        ? await updateModule(moduleModal.editing.id, moduleForm)
        : await createModule(courseId, moduleForm)

      if (result.success) {
        closeModuleModal()
        loadData()
      } else {
        setError(result.error || '저장 실패')
      }
    })
  }

  async function handleDeleteModule() {
    if (!deleteModule) return

    startTransition(async () => {
      const { deleteModule: deleteModuleAction } = await import(
        '@/lib/actions/admin'
      )
      const result = await deleteModuleAction(deleteModule.id)

      if (result.success) {
        setDeleteModule(null)
        loadData()
      } else {
        alert(result.error || '삭제 실패')
      }
    })
  }

  async function handleReorderModules(newModules: Module[]) {
    setModules(newModules)
    startTransition(async () => {
      await reorderModules(
        courseId,
        newModules.map((m) => m.id)
      )
    })
  }

  // Lesson CRUD
  function openLessonModal(moduleId: string, lesson?: Lesson) {
    if (lesson) {
      setLessonForm({
        title: lesson.title,
        description: lesson.description || '',
        content_type: lesson.content_type,
        youtube_video_id: lesson.youtube_video_id || '',
        markdown_content: lesson.markdown_content || '',
        duration_minutes: lesson.duration_minutes,
        is_free: lesson.is_free,
      })
      setLessonModal({ isOpen: true, moduleId, editing: lesson })
    } else {
      setLessonForm({
        title: '',
        description: '',
        content_type: 'video',
        youtube_video_id: '',
        markdown_content: '',
        duration_minutes: null,
        is_free: false,
      })
      setLessonModal({ isOpen: true, moduleId, editing: null })
    }
    setError(null)
  }

  function closeLessonModal() {
    setLessonModal({ isOpen: false, moduleId: null, editing: null })
    setError(null)
  }

  async function handleLessonSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!lessonForm.title) {
      setError('레슨 제목은 필수입니다.')
      return
    }

    if (
      lessonForm.content_type === 'video' &&
      !lessonForm.youtube_video_id
    ) {
      setError('YouTube Video ID는 필수입니다.')
      return
    }

    if (
      lessonForm.content_type === 'blog' &&
      !lessonForm.markdown_content
    ) {
      setError('마크다운 콘텐츠는 필수입니다.')
      return
    }

    startTransition(async () => {
      const data: LessonFormData = {
        ...lessonForm,
        youtube_video_id:
          lessonForm.content_type === 'video'
            ? lessonForm.youtube_video_id
            : null,
        markdown_content:
          lessonForm.content_type === 'blog'
            ? lessonForm.markdown_content
            : null,
      }

      const result = lessonModal.editing
        ? await updateLesson(lessonModal.editing.id, data)
        : await createLesson(lessonModal.moduleId!, data)

      if (result.success) {
        closeLessonModal()
        loadData()
      } else {
        setError(result.error || '저장 실패')
      }
    })
  }

  async function handleDeleteLesson() {
    if (!deleteLesson) return

    startTransition(async () => {
      const { deleteLesson: deleteLessonAction } = await import(
        '@/lib/actions/admin'
      )
      const result = await deleteLessonAction(deleteLesson.id)

      if (result.success) {
        setDeleteLesson(null)
        loadData()
      } else {
        alert(result.error || '삭제 실패')
      }
    })
  }

  async function handleReorderLessons(moduleId: string, newLessons: Lesson[]) {
    setLessonsByModule((prev) => ({
      ...prev,
      [moduleId]: newLessons,
    }))
    startTransition(async () => {
      await reorderLessons(
        moduleId,
        newLessons.map((l) => l.id)
      )
    })
  }

  if (isLoading) {
    return (
      <>
        <AdminHeader title="모듈 관리" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded bg-muted" />
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
          <p className="text-muted-foreground">코스가 존재하지 않습니다</p>
        </main>
      </>
    )
  }

  return (
    <>
      <AdminHeader
        title="모듈 & 레슨 관리"
        description={course.title}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/admin/courses"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            코스 목록으로
          </Link>
          <Button onClick={() => openModuleModal()}>
            <Plus className="mr-2 h-4 w-4" />
            모듈 추가
          </Button>
        </div>

        {modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded border border-dashed border-border py-12">
            <p className="text-muted-foreground">아직 모듈이 없습니다</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => openModuleModal()}
            >
              첫 모듈 만들기
            </Button>
          </div>
        ) : (
          <SortableList
            items={modules}
            onReorder={handleReorderModules}
            getItemId={(m) => m.id}
            renderItem={(module) => (
              <div className="flex-1">
                {/* Module Header */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="flex items-center gap-2 font-medium"
                  >
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {module.title}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({lessonsByModule[module.id]?.length || 0}개 레슨)
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openLessonModal(module.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModuleModal(module)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModule(module)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Lessons */}
                {expandedModules.has(module.id) && (
                  <div className="mt-3 ml-6 space-y-2">
                    {lessonsByModule[module.id]?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        레슨이 없습니다
                      </p>
                    ) : (
                      <SortableList
                        items={lessonsByModule[module.id] || []}
                        onReorder={(newLessons) =>
                          handleReorderLessons(module.id, newLessons)
                        }
                        getItemId={(l) => l.id}
                        itemClassName="bg-muted/50"
                        renderItem={(lesson) => (
                          <div className="flex flex-1 items-center justify-between">
                            <div className="flex items-center gap-2">
                              {lesson.content_type === 'video' ? (
                                <Play className="h-4 w-4 text-blue-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-green-500" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                              {lesson.is_free && (
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                                  무료
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  openLessonModal(module.id, lesson)
                                }
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteLesson(lesson)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          />
        )}
      </main>

      {/* Module Modal */}
      <Modal
        isOpen={moduleModal.isOpen}
        onClose={closeModuleModal}
        title={moduleModal.editing ? '모듈 수정' : '모듈 추가'}
      >
        <form onSubmit={handleModuleSubmit}>
          <div className="space-y-4">
            <Input
              label="모듈 제목"
              value={moduleForm.title}
              onChange={(e) =>
                setModuleForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="예: Chapter 1. AI 기초"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium">설명</label>
              <textarea
                value={moduleForm.description || ''}
                onChange={(e) =>
                  setModuleForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="모듈에 대한 간단한 설명"
                rows={2}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={closeModuleModal}>
              취소
            </Button>
            <Button type="submit" isLoading={isPending}>
              {moduleModal.editing ? '수정' : '추가'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={lessonModal.isOpen}
        onClose={closeLessonModal}
        title={lessonModal.editing ? '레슨 수정' : '레슨 추가'}
      >
        <form onSubmit={handleLessonSubmit}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="레슨 제목"
              value={lessonForm.title}
              onChange={(e) =>
                setLessonForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="예: AI란 무엇인가?"
              required
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium">설명</label>
              <textarea
                value={lessonForm.description || ''}
                onChange={(e) =>
                  setLessonForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="레슨에 대한 간단한 설명"
                rows={2}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                콘텐츠 타입
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="content_type"
                    value="video"
                    checked={lessonForm.content_type === 'video'}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        content_type: 'video',
                      }))
                    }
                  />
                  <Play className="h-4 w-4 text-blue-500" />
                  영상
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="content_type"
                    value="blog"
                    checked={lessonForm.content_type === 'blog'}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        content_type: 'blog',
                      }))
                    }
                  />
                  <FileText className="h-4 w-4 text-green-500" />
                  블로그
                </label>
              </div>
            </div>

            {/* Conditional Fields */}
            {lessonForm.content_type === 'video' ? (
              <Input
                label="YouTube Video ID"
                value={lessonForm.youtube_video_id || ''}
                onChange={(e) =>
                  setLessonForm((prev) => ({
                    ...prev,
                    youtube_video_id: e.target.value,
                  }))
                }
                placeholder="예: dQw4w9WgXcQ"
                required
              />
            ) : (
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  마크다운 콘텐츠
                </label>
                <MarkdownEditor
                  value={lessonForm.markdown_content || ''}
                  onChange={(value) =>
                    setLessonForm((prev) => ({
                      ...prev,
                      markdown_content: value,
                    }))
                  }
                  height="300px"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="예상 시간 (분)"
                type="number"
                value={lessonForm.duration_minutes || ''}
                onChange={(e) =>
                  setLessonForm((prev) => ({
                    ...prev,
                    duration_minutes: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                placeholder="예: 15"
              />

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lessonForm.is_free}
                    onChange={(e) =>
                      setLessonForm((prev) => ({
                        ...prev,
                        is_free: e.target.checked,
                      }))
                    }
                    className="rounded border-border"
                  />
                  <span className="text-sm">무료 공개</span>
                </label>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={closeLessonModal}>
              취소
            </Button>
            <Button type="submit" isLoading={isPending}>
              {lessonModal.editing ? '수정' : '추가'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Module Modal */}
      <Modal
        isOpen={!!deleteModule}
        onClose={() => setDeleteModule(null)}
        title="모듈 삭제"
      >
        <p>
          <strong>{deleteModule?.title}</strong> 모듈을 삭제하시겠습니까?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          이 모듈의 모든 레슨도 함께 삭제됩니다.
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteModule(null)}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteModule}
            isLoading={isPending}
          >
            삭제
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Lesson Modal */}
      <Modal
        isOpen={!!deleteLesson}
        onClose={() => setDeleteLesson(null)}
        title="레슨 삭제"
      >
        <p>
          <strong>{deleteLesson?.title}</strong> 레슨을 삭제하시겠습니까?
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteLesson(null)}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteLesson}
            isLoading={isPending}
          >
            삭제
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
