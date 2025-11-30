"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryFilter } from "./CategoryFilter";
import { CourseGrid } from "./CourseGrid";
import type { Category, CourseWithProgress } from "@/lib/types/course";

interface CoursesPageClientProps {
  categories: Category[];
  courses: CourseWithProgress[];
}

export function CoursesPageClient({
  categories,
  courses,
}: CoursesPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 카테고리 필터링
  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter((c) => c.category?.slug === selectedCategory);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* 헤더 */}
          {/* <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">코스</h1>
            <p className="text-muted-foreground">
              AI 활용 능력을 키워보세요. 실습 중심의 강의로 배워봐요.
            </p>
          </div> */}

          {/* 카테고리 필터 */}
          {categories.length > 0 && (
            <div className="mb-6">
              <CategoryFilter
                categories={categories}
                selectedSlug={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          )}

          {/* 코스 그리드 */}
          <CourseGrid courses={filteredCourses} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
