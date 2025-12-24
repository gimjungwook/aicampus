'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Menu, X, User, LogOut, Globe, ShoppingCart } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { SearchBar } from '@/components/ui/SearchBar'

const navigation = [
  { name: '코스', href: '/courses' },
  { name: '피드', href: '/feed' },
  { name: '샌드박스', href: '/sandbox' },
]

export function Header() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 프로필 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Left: Logo + SearchBar (Desktop) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">AI Campus</span>
          </Link>
          {/* Search Bar - Desktop only */}
          <SearchBar className="hidden w-[350px] md:flex" />
        </div>

        {/* Right: Navigation + Icons + Profile (Desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Navigation */}
          <nav className="flex items-center gap-[42px]">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-base transition-colors hover:text-foreground',
                    isActive
                      ? 'font-bold text-foreground'
                      : 'font-bold text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Icon Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted" aria-label="언어 선택">
              <Globe className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted relative" aria-label="장바구니">
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>

          {/* Profile */}
          {loading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="relative" ref={profileMenuRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="프로필"
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-14 w-72 rounded-2xl border bg-card shadow-xl">
                  {/* User Info */}
                  <div className="px-5 py-4">
                    <p className="text-base font-semibold text-card-foreground">
                      {user.user_metadata?.full_name || '사용자'}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/mypage"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
                    >
                      <User className="h-5 w-5 text-muted-foreground" />
                      마이페이지
                    </Link>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Theme Toggle */}
                  <div className="p-2">
                    <div className="flex items-center justify-between rounded-xl px-4 py-3">
                      <span className="text-sm font-medium text-card-foreground">테마</span>
                      <ThemeToggle />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Logout */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        signOut()
                        setProfileMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              로그인
            </Link>
          )}
        </div>

        {/* Mobile: Menu Button */}
        <button
          className="rounded-xl p-2 hover:bg-muted md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'overflow-hidden border-t transition-all duration-200 md:hidden',
          mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0 border-t-0'
        )}
      >
        <div className="space-y-1 px-4 py-3">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-xl px-4 py-3 text-base transition-colors hover:bg-muted hover:text-foreground',
                  isActive
                    ? 'font-bold text-foreground'
                    : 'font-semibold text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          })}

          {loading ? (
            <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
          ) : user ? (
            <>
              {/* User Info */}
              <div className="border-t px-4 py-3">
                <p className="font-semibold">{user.user_metadata?.full_name || '사용자'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <Link
                href="/mypage"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                마이페이지
              </Link>

              {/* Theme */}
              <div className="flex items-center justify-between rounded-xl px-4 py-3">
                <span className="text-base font-semibold text-muted-foreground">테마</span>
                <ThemeToggle />
              </div>

              <button
                onClick={() => {
                  signOut()
                  setMobileMenuOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                로그아웃
              </button>
            </>
          ) : (
            <div className="border-t pt-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
