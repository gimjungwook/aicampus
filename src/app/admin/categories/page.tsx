'use client'

import { useState, useEffect, useTransition } from 'react'
import { AdminHeader, SortableList } from '@/components/admin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '@/lib/actions/admin'
import type { Category, CategoryFormData } from '@/lib/types/admin'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    icon: '',
    color: '',
  })
  const [formError, setFormError] = useState<string | null>(null)

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setIsLoading(true)
    try {
      const data = await getAdminCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Open modal for create/edit
  function openModal(category?: Category) {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        icon: category.icon || '',
        color: category.color || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', slug: '', icon: '', color: '' })
    }
    setFormError(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormError(null)
  }

  // Auto-generate slug from name
  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
    }))
  }

  // Submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!formData.name || !formData.slug) {
      setFormError('이름과 슬러그는 필수입니다.')
      return
    }

    startTransition(async () => {
      const result = editingCategory
        ? await updateCategory(editingCategory.id, formData)
        : await createCategory(formData)

      if (result.success) {
        closeModal()
        loadCategories()
      } else {
        setFormError(result.error || '저장 실패')
      }
    })
  }

  // Delete category
  async function handleDelete() {
    if (!deleteTarget) return

    startTransition(async () => {
      const result = await deleteCategory(deleteTarget.id)

      if (result.success) {
        setDeleteTarget(null)
        loadCategories()
      } else {
        alert(result.error || '삭제 실패')
      }
    })
  }

  // Reorder categories
  async function handleReorder(newCategories: Category[]) {
    setCategories(newCategories)

    startTransition(async () => {
      const ids = newCategories.map((c) => c.id)
      await reorderCategories(ids)
    })
  }

  return (
    <>
      <AdminHeader title="카테고리 관리" description="코스 카테고리를 관리합니다" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            드래그하여 순서를 변경할 수 있습니다
          </p>
          <Button onClick={() => openModal()}>
            <Plus className="mr-2 h-4 w-4" />
            카테고리 추가
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
            <p className="text-muted-foreground">아직 카테고리가 없습니다</p>
            <Button variant="outline" className="mt-4" onClick={() => openModal()}>
              첫 카테고리 만들기
            </Button>
          </div>
        ) : (
          <SortableList
            items={categories}
            onReorder={handleReorder}
            getItemId={(item) => item.id}
            renderItem={(category) => (
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-3">
                  {category.icon && (
                    <span className="text-xl">{category.icon}</span>
                  )}
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      /{category.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(category)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          />
        )}
      </main>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? '카테고리 수정' : '카테고리 추가'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="이름"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="예: AI 기초"
              required
            />
            <Input
              label="슬러그 (URL)"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="예: ai-basics"
              required
            />
            <Input
              label="아이콘 (이모지)"
              value={formData.icon || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon: e.target.value }))
              }
              placeholder="예: 🤖"
            />
            <Input
              label="색상 (Hex)"
              value={formData.color || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
              placeholder="예: #3B82F6"
            />

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit" isLoading={isPending}>
              {editingCategory ? '수정' : '추가'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="카테고리 삭제"
      >
        <p>
          <strong>{deleteTarget?.name}</strong> 카테고리를 삭제하시겠습니까?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          이 카테고리에 속한 코스들은 카테고리 없음으로 변경됩니다.
        </p>

        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
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
