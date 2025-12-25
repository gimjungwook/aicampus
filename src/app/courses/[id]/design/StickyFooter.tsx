'use client'

interface StickyFooterProps {
  title: string
  onEnroll?: () => void
  onWatch?: () => void
}

export function StickyFooter({ title, onEnroll, onWatch }: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1d1d1d]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3.5">
        {/* 코스 제목 */}
        <p className="text-base font-medium text-white">{title}</p>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEnroll}
            className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-100"
          >
            수강 신청 하기
          </button>
          <button
            onClick={onWatch}
            className="rounded-md bg-[#ff153c] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
          >
            지금 당장 시청하기
          </button>
        </div>
      </div>
    </div>
  )
}
