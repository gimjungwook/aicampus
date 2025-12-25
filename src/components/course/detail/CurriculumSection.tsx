import { ModuleAccordion } from '@/components/course'
import type { ModuleWithProgress } from '@/lib/types/course'

interface CurriculumSectionProps {
  modules: ModuleWithProgress[]
  isEnrolled: boolean
  courseId: string
}

export function CurriculumSection({
  modules,
  isEnrolled,
  courseId
}: CurriculumSectionProps) {
  return (
    <section id="curriculum" className="py-12 border-t border-border">
      <h2 className="mb-6 text-2xl font-bold">커리큘럼</h2>

      <div className="space-y-3">
        {modules.map((module, index) => (
          <ModuleAccordion
            key={module.id}
            module={module}
            moduleIndex={index}
            isEnrolled={isEnrolled}
            courseId={courseId}
            defaultOpen={index === 0}
          />
        ))}
      </div>

      {modules.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">
            아직 준비 중인 코스입니다. 곧 콘텐츠가 추가됩니다!
          </p>
        </div>
      )}
    </section>
  )
}
