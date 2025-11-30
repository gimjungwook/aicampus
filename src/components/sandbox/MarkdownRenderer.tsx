'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match

            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>
          },
          ul({ children }) {
            return <ul className="mb-2 list-disc pl-4">{children}</ul>
          },
          ol({ children }) {
            return <ol className="mb-2 list-decimal pl-4">{children}</ol>
          },
          li({ children }) {
            return <li className="mb-1">{children}</li>
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {children}
              </a>
            )
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                {children}
              </blockquote>
            )
          },
          h1({ children }) {
            return <h1 className="mb-2 text-xl font-bold">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="mb-2 text-lg font-bold">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="mb-2 text-base font-bold">{children}</h3>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

interface CodeBlockProps {
  children: string
  language?: string
}

function CodeBlock({ children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  return (
    <div className="group relative mb-3 rounded-lg bg-zinc-900 dark:bg-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-700 px-3 py-1.5">
        <span className="text-xs text-zinc-400">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              복사됨
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              복사
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className="text-sm text-zinc-100">{children}</code>
      </pre>
    </div>
  )
}
