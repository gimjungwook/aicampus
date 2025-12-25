'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WishlistCourseCard } from '@/components/wishlist/WishlistCourseCard'
import { useWishlist } from '@/components/wishlist/WishlistProvider'
import type { WishlistItem } from '@/lib/types'

interface WishlistContentProps {
  initialItems: WishlistItem[]
}

export function WishlistContent({ initialItems }: WishlistContentProps) {
  const { wishlistIds, removeFromWishlist } = useWishlist()
  const [showToast, setShowToast] = useState(false)

  // 실시간으로 업데이트된 아이템 목록 (Optimistic UI 반영)
  const items = initialItems.filter(item => wishlistIds.includes(item.course_id))

  // 총 가격 계산
  const totalPrice = items.reduce((sum, item) => sum + (item.course.price || 0), 0)

  const handleCheckout = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // 빈 상태
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-bold">찜한 강의가 없습니다</h2>
        <p className="mt-2 text-muted-foreground">
          관심있는 강의를 찜해보세요!
        </p>
        <Link href="/courses">
          <Button className="mt-6">코스 둘러보기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="rounded-sm bg-foreground px-6 py-3 text-background shadow-lg">
            현재 모든 강의가 무료입니다!
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">위시리스트</h1>
        <span className="text-muted-foreground">총 {items.length}개의 강의</span>
      </div>

      {/* 콘텐츠 */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* 코스 목록 */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(item => (
            <WishlistCourseCard key={item.id} item={item} />
          ))}
        </div>

        {/* 사이드바 - 결제 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-sm border border-border bg-card p-6">
            <h2 className="text-lg font-bold">선택한 강의</h2>

            {/* 강의 목록 */}
            <div className="mt-4 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 flex-1 pr-4">{item.course.title}</span>
                  <span className="shrink-0 font-medium">
                    {item.course.price === 0 || !item.course.price
                      ? '무료'
                      : `₩${item.course.price.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>

            {/* 구분선 */}
            <div className="my-4 h-px bg-border" />

            {/* 총 금액 */}
            <div className="flex items-center justify-between">
              <span className="font-bold">총 결제 금액</span>
              <span className="text-xl font-bold text-primary">
                {totalPrice === 0 ? '무료' : `₩${totalPrice.toLocaleString()}`}
              </span>
            </div>

            {/* 결제 버튼 */}
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={handleCheckout}
            >
              결제하기 ({items.length})
            </Button>

            {/* 안내 문구 */}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              결제 후 바로 학습을 시작할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
