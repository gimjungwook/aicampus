import { Check } from 'lucide-react'

interface TargetItem {
  id: string
  text: string
}

interface LearningTargetSectionProps {
  items?: TargetItem[]
}

const defaultItems: TargetItem[] = [
  { id: '1', text: 'AI를 업무에 활용하고 싶지만 어디서부터 시작해야 할지 모르는 분' },
  { id: '2', text: '반복적인 업무를 자동화하여 생산성을 높이고 싶은 분' },
  { id: '3', text: 'ChatGPT, Notion AI 등 AI 도구를 제대로 활용하고 싶은 분' },
  { id: '4', text: '비개발자로서 AI 시대에 경쟁력을 갖추고 싶은 분' },
]

export function LearningTargetSection({ items = defaultItems }: LearningTargetSectionProps) {
  if (items.length === 0) return null

  return (
    <div className="py-8">
      <h2 className="mb-6 text-2xl font-bold">
        이런 분들에게 추천해요
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <p className="text-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
