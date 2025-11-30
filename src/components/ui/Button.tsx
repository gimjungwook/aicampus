import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--primary-shadow)] hover:brightness-110 active:translate-y-1 active:shadow-none',
        secondary: 'rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        outline: 'rounded-2xl border-2 border-border bg-transparent hover:bg-muted hover:text-foreground',
        ghost: 'rounded-md hover:bg-muted hover:text-foreground',
        danger: 'rounded-2xl bg-destructive text-destructive-foreground shadow-[0_4px_0_0_#b91c1c] hover:brightness-110 active:translate-y-1 active:shadow-none',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
