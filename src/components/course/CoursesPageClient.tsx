"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArticleBanner,
  PopularCoursesSection,
  NewCoursesSection,
} from "@/components/home";
import type { Category, CourseWithProgress } from "@/lib/types/course";
import type { ArticleBanner as BannerType } from "@/lib/types/banner";

interface CoursesPageClientProps {
  categories: Category[];
  courses: CourseWithProgress[];
  banners: BannerType[];
  popularCourses: CourseWithProgress[];
  newCourses: CourseWithProgress[];
}

export function CoursesPageClient({
  categories,
  banners,
  popularCourses,
  newCourses,
}: CoursesPageClientProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-[1289px] mx-auto px-5 lg:px-0">
          {/* 아티클 배너 */}
          <section className="pt-6">
            <ArticleBanner banners={banners} />
          </section>

          {/* 인기 강의 섹션 */}
          <PopularCoursesSection
            courses={popularCourses}
            categories={categories}
          />

          {/* 신규 강의 섹션 */}
          <NewCoursesSection
            courses={newCourses}
            categories={categories}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
