interface SectionHeaderProps {
  title: string
  subtitle: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm text-[var(--section-subtitle)] mt-2">{subtitle}</p>
    </div>
  )
}
