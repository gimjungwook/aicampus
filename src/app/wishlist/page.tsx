import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getWishlist } from '@/lib/actions/wishlist'
import { WishlistContent } from './WishlistContent'

export const metadata = {
  title: '위시리스트 | AI Campus',
  description: '찜한 강의 목록을 확인하고 관리하세요.',
}

export default async function WishlistPage() {
  const wishlist = await getWishlist()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          <WishlistContent initialItems={wishlist} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
