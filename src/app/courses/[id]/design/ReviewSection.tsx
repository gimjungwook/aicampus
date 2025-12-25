'use client'

import { useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  getCourseReviews,
  getReviewStats,
  createReview,
  canUserReview,
  getUserReviewStats,
} from '@/lib/actions/review'
import type { CourseReview, ReviewStats } from '@/lib/types/course'

interface ReviewSectionProps {
  courseId: string
  currentUser?: {
    id: string
    nickname: string
    avatar_url: string | null
  } | null
}

export function ReviewSection({ courseId, currentUser }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<CourseReview[]>([])
  const [stats, setStats] = useState<ReviewStats>({ avgRating: 0, reviewCount: 0 })
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [canReview, setCanReview] = useState(false)
  const [reviewReason, setReviewReason] = useState<string | undefined>()
  const [userStats, setUserStats] = useState<Record<string, { reviewCount: number; avgRating: number }>>({})

  // 리뷰 작성 폼 상태
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const REVIEWS_PER_PAGE = 5

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData()
  }, [courseId])

  async function loadInitialData() {
    setLoading(true)
    const [reviewsData, statsData] = await Promise.all([
      getCourseReviews(courseId, 1, REVIEWS_PER_PAGE),
      getReviewStats(courseId),
    ])
    setReviews(reviewsData.reviews)
    setTotal(reviewsData.total)
    setStats(statsData)

    // 사용자 리뷰 가능 여부 확인
    if (currentUser) {
      const reviewPermission = await canUserReview(courseId)
      setCanReview(reviewPermission.canReview)
      setReviewReason(reviewPermission.reason)
    }

    // 리뷰어들의 통계 로드
    const userStatsMap: Record<string, { reviewCount: number; avgRating: number }> = {}
    for (const review of reviewsData.reviews) {
      if (!userStatsMap[review.user_id]) {
        const stats = await getUserReviewStats(review.user_id)
        userStatsMap[review.user_id] = stats
      }
    }
    setUserStats(userStatsMap)

    setLoading(false)
  }

  // 더보기 로드
  async function loadMore() {
    const nextPage = page + 1
    const { reviews: moreReviews } = await getCourseReviews(courseId, nextPage, REVIEWS_PER_PAGE)
    setReviews((prev) => [...prev, ...moreReviews])
    setPage(nextPage)

    // 새로운 리뷰어들의 통계 로드
    for (const review of moreReviews) {
      if (!userStats[review.user_id]) {
        const stats = await getUserReviewStats(review.user_id)
        setUserStats((prev) => ({ ...prev, [review.user_id]: stats }))
      }
    }
  }

  // 리뷰 작성
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError('리뷰 내용을 입력해주세요.')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await createReview(courseId, rating, content)
      if (result.success) {
        setContent('')
        setRating(5)
        loadInitialData()
      } else {
        setError(result.error || '리뷰 작성 실패')
      }
    })
  }

  // 날짜 포맷
  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`
  }

  // 별 렌더링
  function renderStars(rating: number, size: 'sm' | 'lg' = 'sm') {
    const starSize = size === 'lg' ? 'h-8 w-8' : 'h-4 w-4'
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <section id="reviews" className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="h-96 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reviews" className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* 제목 */}
          <h2 className="mb-8 text-2xl font-bold text-gray-900">후기 남기기</h2>

          {/* 평점 요약 */}
          <div className="mb-8 rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-4xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
            <div className="mt-2 flex justify-center">{renderStars(Math.round(stats.avgRating), 'lg')}</div>
            <p className="mt-2 text-sm text-gray-500">{stats.reviewCount}개의 수강평</p>
          </div>

          {/* 내 수강 후기 남기기 */}
          <div className="mb-8">
            <h3 className="mb-4 font-bold text-gray-900">내 수강 후기 남기기</h3>
            <form onSubmit={handleSubmit}>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  {/* 프로필 이미지 */}
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {currentUser?.avatar_url ? (
                      <Image
                        src={currentUser.avatar_url}
                        alt={currentUser.nickname}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <span className="text-sm">{currentUser?.nickname?.[0] || '?'}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {currentUser?.nickname || '사용자 닉네임'}
                    </p>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={
                        !currentUser
                          ? '로그인 후 후기를 작성할 수 있습니다.'
                          : !canReview
                            ? reviewReason || '강의를 수강한 사람만 후기를 남길 수 있습니다.'
                            : '후기를 작성해주세요.'
                      }
                      disabled={!currentUser || !canReview}
                      rows={3}
                      className="mt-2 w-full resize-none rounded border-0 bg-transparent p-0 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* 별점 및 등록 버튼 */}
              <div className="mt-4 flex items-center justify-end gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">별점 남기기</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    disabled={!currentUser || !canReview}
                    className="rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {'★'.repeat(r)}{'☆'.repeat(5 - r)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!currentUser || !canReview || isPending}
                  className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? '등록 중...' : '등록하기'}
                </button>
              </div>

              {error && <p className="mt-2 text-right text-sm text-red-500">{error}</p>}
            </form>
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                userStats={userStats[review.user_id]}
                formatDate={formatDate}
                renderStars={renderStars}
              />
            ))}
          </div>

          {/* 더보기 버튼 */}
          {reviews.length < total && (
            <button
              onClick={loadMore}
              className="mt-8 w-full rounded-lg border border-gray-200 py-4 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              더보기
            </button>
          )}

          {reviews.length === 0 && (
            <p className="py-8 text-center text-gray-500">아직 작성된 후기가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  )
}

// 개별 리뷰 아이템
function ReviewItem({
  review,
  userStats,
  formatDate,
  renderStars,
}: {
  review: CourseReview
  userStats?: { reviewCount: number; avgRating: number }
  formatDate: (date: string) => string
  renderStars: (rating: number, size?: 'sm' | 'lg') => React.ReactNode
}) {
  return (
    <div className="border-b border-gray-100 pb-6">
      {/* 리뷰 작성자 정보 */}
      <div className="flex items-start gap-3">
        {/* 프로필 이미지 */}
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          {review.user?.avatar_url ? (
            <Image
              src={review.user.avatar_url}
              alt={review.user.nickname}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <span className="text-sm">{review.user?.nickname?.[0] || '?'}</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* 이름 및 통계 */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{review.user?.nickname || '알 수 없음'}</span>
            {userStats && (
              <span className="text-sm text-gray-400">
                수강평 {userStats.reviewCount} · 평균 평점 {userStats.avgRating.toFixed(1)}
              </span>
            )}
          </div>
          {/* 날짜 */}
          <p className="text-sm text-gray-400">{formatDate(review.created_at)}</p>

          {/* 별점 및 진도 */}
          <div className="mt-2 flex items-center gap-2">
            {renderStars(review.rating)}
            <span className="font-bold text-gray-900">{review.rating}</span>
            <span className="text-xs text-red-500">{review.progress_percent}% 수강 후 작성</span>
          </div>

          {/* 리뷰 내용 */}
          <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.content}</p>

          {/* 강의자 답글 */}
          {review.reply && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {review.reply.user?.nickname || '강의자'}
                </span>
                <span className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
                  강의자
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">{formatDate(review.reply.created_at)}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{review.reply.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
