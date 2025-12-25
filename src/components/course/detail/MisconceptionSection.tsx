import { X } from 'lucide-react'

interface MisconceptionItem {
  id: string
  text: string
}

interface MisconceptionSectionProps {
  items?: MisconceptionItem[]
}

const defaultItems: MisconceptionItem[] = [
  { id: '1', text: 'AI는 개발자만 사용하는 거 아닌가요?' },
  { id: '2', text: '코딩을 모르면 AI를 활용할 수 없을 것 같아요' },
  { id: '3', text: 'AI 도구들이 너무 많아서 뭐부터 시작해야 할지 모르겠어요' },
  { id: '4', text: '기존 업무 방식을 바꾸기가 두려워요' },
]

export function MisconceptionSection({ items = defaultItems }: MisconceptionSectionProps) {
  if (items.length === 0) return null

  return (
    <div className="bg-[var(--section-dark)] py-16 -mx-4 px-4 lg:-mx-8 lg:px-8 my-8 rounded-lg">
      <div>
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--section-dark-text)] lg:text-3xl">
          혹시 이런 생각을 하고 계시나요?
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg bg-[var(--section-dark-alt)] p-5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cta-red)]/20">
                <X className="h-4 w-4 text-[var(--cta-red)]" />
              </div>
              <p className="text-[var(--section-dark-text)]">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-lg text-[var(--section-dark-muted)]">
          걱정하지 마세요! 이 코스에서 차근차근 알려드립니다.
        </p>
      </div>
    </div>
  )
}
