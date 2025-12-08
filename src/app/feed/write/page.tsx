'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { createNewsPost, getNewsTags } from '@/lib/actions/news'
import { ChevronLeft, Send } from 'lucide-react'
import type { NewsTag } from '@/lib/types/news'

export default function FeedWritePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tags, setTags] = useState<NewsTag[]>([])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isPublished, setIsPublished] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTags() {
      const data = await getNewsTags()
      setTags(data)
    }
    loadTags()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('제목을 입력해주세요')
      return
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요')
      return
    }

    startTransition(async () => {
      const result = await createNewsPost({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        thumbnail_url: null,
        tag_ids: selectedTags,
        is_published: isPublished,
      })

      if (result.success && result.data) {
        router.push(`/feed/${result.data.id}`)
      } else {
        setError(result.error || '저장에 실패했습니다')
      }
    })
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-xl mx-auto">
          {/* 상단 바 */}
          <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex items-center justify-between h-14 px-4">
              <Link
                href="/feed"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
                취소
              </Link>
              <h1 className="text-base font-semibold">새 피드</h1>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isPending || !title.trim() || !content.trim()}
                isLoading={isPending}
                className="rounded-full"
              >
                <Send className="h-4 w-4 mr-1" />
                게시
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* 제목 */}
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="text-lg font-semibold border-0 border-b border-border rounded-none px-0 focus-visible:ring-0"
              />
            </div>

            {/* 요약 */}
            <div>
              <Input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="한 줄 요약 (선택)"
                maxLength={150}
                className="text-sm border-0 border-b border-border rounded-none px-0 focus-visible:ring-0"
              />
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 py-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>

            {/* 내용 */}
            <div>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="무슨 일이 일어나고 있나요?"
                height="300px"
              />
            </div>

            {/* 발행 옵션 */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-border"
                />
                바로 게시
              </label>
            </div>

            {/* 에러 */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
