import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center font-bold',
  {
    variants: {
      variant: {
        plus: 'bg-[var(--badge-plus-bg)] text-[var(--badge-plus-text)] rounded-[6px] px-1.5 py-0.5 text-sm',
        best: 'bg-[var(--badge-best-bg)] text-[var(--badge-best-text)] rounded-[2px] px-1 py-0.5 text-xs',
        new: 'bg-[var(--badge-new-bg)] text-[var(--badge-new-text)] rounded-[2px] px-1 py-0.5 text-xs',
        hot: 'bg-[var(--badge-hot-bg)] text-[var(--badge-hot-text)] rounded-[2px] px-1 py-0.5 text-xs tracking-[-0.24px]',
        article: 'bg-[var(--badge-article-bg)] text-[var(--badge-article-text)] rounded-full px-4 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'best',
    },
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  )
}
