'use client'

import { useState, useEffect, useTransition } from 'react'
import { AdminHeader, SortableList, ImageUploader } from '@/components/admin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, ModalFooter } from '@/components/ui/Modal'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import {
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  toggleBannerActive,
} from '@/lib/actions/admin'
import type { Banner, BannerFormData } from '@/lib/types/admin'

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)

  // Form state
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    badge_text: 'Article',
    image_url: '',
    link_url: '',
    gradient_color: '#1a1a2e',
    accent_color: '',
  })
  const [formError, setFormError] = useState<string | null>(null)

  // Load banners
  useEffect(() => {
    loadBanners()
  }, [])

  async function loadBanners() {
    setIsLoading(true)
    try {
      const data = await getAdminBanners()
      setBanners(data)
    } catch (error) {
      console.error('Failed to load banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Open modal for create/edit
  function openModal(banner?: Banner) {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        badge_text: banner.badge_text || 'Article',
        image_url: banner.image_url || '',
        link_url: banner.link_url || '',
        gradient_color: banner.gradient_color || '#1a1a2e',
        accent_color: banner.accent_color || '',
      })
    } else {
      setEditingBanner(null)
      setFormData({
        title: '',
        subtitle: '',
        badge_text: 'Article',
        image_url: '',
        link_url: '',
        gradient_color: '#1a1a2e',
        accent_color: '',
      })
    }
    setFormError(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingBanner(null)
    setFormError(null)
  }

  // Submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!formData.title) {
      setFormError('제목은 필수입니다.')
      return
    }

    startTransition(async () => {
      const result = editingBanner
        ? await updateBanner(editingBanner.id, formData)
        : await createBanner(formData)

      if (result.success) {
        closeModal()
        loadBanners()
      } else {
        setFormError(result.error || '저장 실패')
      }
    })
  }

  // Delete banner
  async function handleDelete() {
    if (!deleteTarget) return

    startTransition(async () => {
      const result = await deleteBanner(deleteTarget.id)

      if (result.success) {
        setDeleteTarget(null)
        loadBanners()
      } else {
        alert(result.error || '삭제 실패')
      }
    })
  }

  // Reorder banners
  async function handleReorder(newBanners: Banner[]) {
    setBanners(newBanners)

    startTransition(async () => {
      const ids = newBanners.map((b) => b.id)
      await reorderBanners(ids)
    })
  }

  // Toggle active
  async function handleToggleActive(banner: Banner) {
    startTransition(async () => {
      const result = await toggleBannerActive(banner.id, !banner.is_active)
      if (result.success) {
        loadBanners()
      }
    })
  }

  return (
    <>
      <AdminHeader title="배너 관리" description="코스 페이지 상단 배너를 관리합니다" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            드래그하여 순서를 변경할 수 있습니다
          </p>
          <Button onClick={() => openModal()}>
            <Plus className="mr-2 h-4 w-4" />
            배너 추가
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
            <p className="text-muted-foreground">아직 배너가 없습니다</p>
            <Button variant="outline" className="mt-4" onClick={() => openModal()}>
              첫 배너 만들기
            </Button>
          </div>
        ) : (
          <SortableList
            items={banners}
            onReorder={handleReorder}
            getItemId={(item) => item.id}
            renderItem={(banner) => (
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* 미리보기 박스 */}
                  <div
                    className="h-12 w-20 rounded-lg flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: banner.gradient_color }}
                  >
                    {banner.badge_text}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">
                      {banner.title.replace(/\n/g, ' ')}
                    </p>
                    {banner.subtitle && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Active toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(banner)}
                    className={banner.is_active ? 'text-green-500' : 'text-muted-foreground'}
                  >
                    {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(banner)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(banner)}
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
        title={editingBanner ? '배너 수정' : '배너 추가'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">제목 *</label>
              <textarea
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder={"AI 개발자,\n**비전공자**도 가능할까?"}
                required
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter로 줄바꿈 · **텍스트**로 악센트 색상 적용
              </p>
            </div>
            <Input
              label="부제목"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="예: 비전공자가 실무에서 반드시 갖춰야 할 마인드셋"
            />
            <Input
              label="뱃지 텍스트"
              value={formData.badge_text || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, badge_text: e.target.value }))}
              placeholder="Article"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="배경색 (Hex)"
                value={formData.gradient_color || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, gradient_color: e.target.value }))}
                placeholder="#1a1a2e"
              />
              <Input
                label="악센트색 (Hex)"
                value={formData.accent_color || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, accent_color: e.target.value }))}
                placeholder="#00c3ea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">배너 이미지</label>
              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                folder="banners"
                aspectRatio="banner"
              />
              <p className="text-xs text-muted-foreground mt-1">
                권장 크기: 1920 x 384px (5:1 비율)
              </p>
            </div>
            <Input
              label="링크 URL"
              value={formData.link_url || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
              placeholder="/articles/1 또는 https://..."
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
              {editingBanner ? '수정' : '추가'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="배너 삭제"
      >
        <p>
          <strong>{deleteTarget?.title.replace(/\n/g, ' ')}</strong> 배너를 삭제하시겠습니까?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          이 작업은 되돌릴 수 없습니다.
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
