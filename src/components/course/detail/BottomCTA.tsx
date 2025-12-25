'use client'

import Link from 'next/link'

interface BottomCTAProps {
  courseTitle: string
  courseId: string
  isEnrolled: boolean
  firstLessonId?: string
  onEnroll?: () => void
}

export function BottomCTA({
  courseTitle,
  courseId,
  isEnrolled,
  firstLessonId,
  onEnroll
}: BottomCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1d1d1d] h-[71px]">
      <div className="mx-auto max-w-4xl h-full px-4 flex items-center justify-between gap-4">
        {/* 강의 제목 */}
        <h3 className="text-white text-[16px] font-medium truncate flex-1">
          {courseTitle}
        </h3>

        {/* 버튼 영역 */}
        <div className="flex items-center gap-3">
          {!isEnrolled && (
            <button
              onClick={onEnroll}
              className="px-6 py-2.5 bg-white text-black text-[14px] font-medium rounded-[6px] hover:bg-gray-100 transition-colors"
            >
              수강 신청하기
            </button>
          )}

          {firstLessonId && (
            <Link
              href={`/lesson/${firstLessonId}`}
              className="px-6 py-2.5 bg-[#ff153c] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#e0122f] transition-colors"
            >
              지금 당장 시청하기
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
