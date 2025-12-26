'use client'

import { useState } from 'react'

export default function ResetProgressPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    deleted?: Record<string, unknown>
  } | null>(null)

  const handleReset = async () => {
    if (!confirm('정말로 yera040618@gmail.com 계정의 수강 정보를 초기화하시겠습니까?')) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/dev/reset-progress', {
        method: 'POST',
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        error: '요청 중 오류가 발생했습니다.',
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">테스트 계정 초기화</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <p className="text-gray-300 mb-4">
            <span className="font-semibold text-white">대상 계정:</span>{' '}
            yera040618@gmail.com
          </p>
          <p className="text-gray-400 text-sm mb-6">
            이 버튼을 누르면 다음 데이터가 삭제됩니다:
          </p>
          <ul className="text-gray-400 text-sm list-disc list-inside mb-6 space-y-1">
            <li>수강 등록 정보 (user_enrollments)</li>
            <li>레슨 진도 (lesson_progress)</li>
            <li>샌드박스 사용량 (sandbox_usage)</li>
            <li>샌드박스 대화 (sandbox_conversations)</li>
            <li>코스 리뷰 (course_reviews)</li>
          </ul>

          <button
            onClick={handleReset}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            }`}
          >
            {loading ? '초기화 중...' : '수강 정보 초기화'}
          </button>
        </div>

        {result && (
          <div
            className={`rounded-lg p-4 ${
              result.success
                ? 'bg-green-900/50 border border-green-700'
                : 'bg-red-900/50 border border-red-700'
            }`}
          >
            {result.success ? (
              <>
                <p className="text-green-400 font-semibold mb-2">
                  초기화 완료
                </p>
                <p className="text-green-300 text-sm">{result.message}</p>
                {result.deleted && (
                  <pre className="mt-3 text-xs text-green-200 bg-black/30 p-2 rounded overflow-auto">
                    {JSON.stringify(result.deleted, null, 2)}
                  </pre>
                )}
              </>
            ) : (
              <>
                <p className="text-red-400 font-semibold mb-2">오류 발생</p>
                <p className="text-red-300 text-sm">{result.error}</p>
              </>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
