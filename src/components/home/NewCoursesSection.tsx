'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { CategoryFilter } from '@/components/course/CategoryFilter'
import { CourseGrid } from '@/components/course/CourseGrid'
import type { CourseWithProgress, Category } from '@/lib/types/course'

interface NewCoursesSectionProps {
  courses: CourseWithProgress[]
  categories: Category[]
}

export function NewCoursesSection({ courses, categories }: NewCoursesSectionProps) {
  const [selectedSlug, setSelectedSlug] = useState('all')

  const filteredCourses = selectedSlug === 'all'
    ? courses
    : courses.filter(c => c.category?.slug === selectedSlug)

  return (
    <section className="py-12">
      <SectionHeader
        title="신규 오픈 강의"
        subtitle="트렌디한 주제의 핫한 신규 강의를 살펴보세요."
      />
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
        />
      </div>
      <CourseGrid courses={filteredCourses.slice(0, 8)} showProgress={false} />
      <div className="flex justify-center mt-10">
        <Link
          href="/courses?sort=newest"
          className="inline-flex items-center gap-2 px-6 py-4 bg-[var(--more-button-bg)] rounded-sm font-bold hover:opacity-80 transition-opacity"
        >
          더 많은 신규 강의 보러 가기!
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
