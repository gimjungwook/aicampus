'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import {
  getWishlistIds,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
} from '@/lib/actions/wishlist'

interface WishlistContextType {
  wishlistIds: string[]
  count: number
  isLoading: boolean
  isInWishlist: (courseId: string) => boolean
  addToWishlist: (courseId: string) => Promise<{ success: boolean; error?: string }>
  removeFromWishlist: (courseId: string) => Promise<{ success: boolean; error?: string }>
  toggleWishlist: (courseId: string) => Promise<{ success: boolean; error?: string }>
  refetch: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  count: 0,
  isLoading: true,
  isInWishlist: () => false,
  addToWishlist: async () => ({ success: false }),
  removeFromWishlist: async () => ({ success: false }),
  toggleWishlist: async () => ({ success: false }),
  refetch: async () => {},
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 위시리스트 데이터 로드
  const refetch = useCallback(async () => {
    if (!user) {
      setWishlistIds([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const ids = await getWishlistIds()
      setWishlistIds(ids)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setWishlistIds([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // 로그인 상태 변경 시 데이터 로드
  useEffect(() => {
    refetch()
  }, [refetch])

  // 위시리스트에 있는지 확인
  const isInWishlist = useCallback(
    (courseId: string) => wishlistIds.includes(courseId),
    [wishlistIds]
  )

  // 위시리스트에 추가 (Optimistic Update)
  const addToWishlist = useCallback(
    async (courseId: string) => {
      if (!user) {
        return { success: false, error: '로그인이 필요합니다' }
      }

      // Optimistic update
      setWishlistIds(prev => [...prev, courseId])

      const result = await addToWishlistAction(courseId)

      if (!result.success) {
        // 롤백
        setWishlistIds(prev => prev.filter(id => id !== courseId))
      }

      return result
    },
    [user]
  )

  // 위시리스트에서 삭제 (Optimistic Update)
  const removeFromWishlist = useCallback(
    async (courseId: string) => {
      if (!user) {
        return { success: false, error: '로그인이 필요합니다' }
      }

      // Optimistic update
      const previousIds = wishlistIds
      setWishlistIds(prev => prev.filter(id => id !== courseId))

      const result = await removeFromWishlistAction(courseId)

      if (!result.success) {
        // 롤백
        setWishlistIds(previousIds)
      }

      return result
    },
    [user, wishlistIds]
  )

  // 토글 (추가/삭제)
  const toggleWishlist = useCallback(
    async (courseId: string) => {
      if (isInWishlist(courseId)) {
        return removeFromWishlist(courseId)
      } else {
        return addToWishlist(courseId)
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  )

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        count: wishlistIds.length,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        refetch,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
