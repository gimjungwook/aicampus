'use client'

import { useState, useEffect, useCallback } from 'react'
import { StarRating } from './StarRating'
import { ReviewCard } from './ReviewCard'
import { ReviewForm } from './ReviewForm'
import { getCourseReviews, getReviewStats, canUserReview } from '@/lib/actions/review'
import type { CourseReview, ReviewStats } from '@/lib/types/course'

interface ReviewSectionProps {
  courseId: string
  isEnrolled: boolean
  progressPercent: number
  currentUserId?: string
  isAdmin?: boolean
}

export function ReviewSection({
  courseId,
  isEnrolled,
  progressPercent,
  currentUserId,
  isAdmin = false
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<CourseReview[]>([])
  const [stats, setStats] = useState<ReviewStats>({ avgRating: 0, reviewCount: 0 })
  const [canWrite, setCanWrite] = useState(false)
  const [existingReview, setExistingReview] = useState<CourseReview | undefined>()
  const [showForm, setShowForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const loadReviews = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true)
    const [reviewData, statsData, canReviewData] = await Promise.all([
      getCourseReviews(courseId, pageNum, 10),
      getReviewStats(courseId),
      canUserReview(courseId)
    ])

    if (pageNum === 1) {
      setReviews(reviewData.reviews)
    } else {
      setReviews(prev => [...prev, ...reviewData.reviews])
    }

    setStats(statsData)
    setCanWrite(canReviewData.canReview)
    setExistingReview(canReviewData.existingReview)
    setHasMore(reviewData.reviews.length === 10)
    setIsLoading(false)
  }, [courseId])

  useEffect(() => {
    loadReviews(1)
  }, [loadReviews])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadReviews(nextPage)
  }

  const handleReviewSuccess = () => {
    setShowForm(false)
    setIsEditMode(false)
    setPage(1)
    loadReviews(1)
  }

  const handleEditClick = () => {
    setIsEditMode(true)
    setShowForm(true)
  }

  return (
    <section id="reviews" className="py-12 border-t border-border">
      <div>
        {/* 헤더: 제목 + 평균 평점 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">수강후기</h2>
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(stats.avgRating)} readonly size="sm" />
              <span className="text-lg font-bold">{stats.avgRating}</span>
              <span className="text-muted-foreground">({stats.reviewCount}개)</span>
            </div>
          </div>
        </div>

        {/* 리뷰 작성 폼 버튼 */}
        {isEnrolled && canWrite && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            + 수강 후기 작성하기
          </button>
        )}

        {/* 리뷰 작성/수정 폼 */}
        {showForm && (
          <div className="mb-6">
            <ReviewForm
              courseId={courseId}
              existingReview={isEditMode ? existingReview : undefined}
              progressPercent={progressPercent}
              onSuccess={handleReviewSuccess}
              onCancel={() => {
                setShowForm(false)
                setIsEditMode(false)
              }}
            />
          </div>
        )}

        {/* 기존 리뷰 표시 (내 리뷰가 있는 경우) */}
        {existingReview && !showForm && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">내가 작성한 리뷰</p>
            <ReviewCard
              review={existingReview}
              isOwner={true}
              isAdmin={isAdmin}
              onEdit={handleEditClick}
              onDelete={() => loadReviews(1)}
              onUpdate={() => loadReviews(1)}
            />
          </div>
        )}

        {/* 리뷰 목록 */}
        {isLoading && reviews.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            로딩 중...
          </div>
        ) : reviews.length === 0 && !existingReview ? (
          <div className="py-8 text-center text-muted-foreground">
            아직 작성된 후기가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reviews
              .filter(r => r.id !== existingReview?.id)
              .map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwner={review.user_id === currentUserId}
                  isAdmin={isAdmin}
                  onEdit={handleEditClick}
                  onDelete={() => loadReviews(1)}
                  onUpdate={() => loadReviews(1)}
                />
              ))}
          </div>
        )}

        {/* 더보기 버튼 */}
        {hasMore && reviews.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full mt-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? '로딩 중...' : '더보기'}
          </button>
        )}
      </div>
    </section>
  )
}
