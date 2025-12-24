'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        h1: ({ children }) => (
          <h1 className="mt-8 mb-4 text-3xl font-bold">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-6 mb-3 text-2xl font-bold">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-5 mb-2 text-xl font-bold">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-foreground">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
                {children}
              </code>
            )
          }
          return (
            <code className="block overflow-x-auto rounded bg-muted p-4 text-sm font-mono">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded bg-muted p-4">
            {children}
          </pre>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt || ''}
            className="my-4 rounded"
          />
        ),
        hr: () => <hr className="my-8 border-border" />,
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted px-4 py-2 text-left font-bold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-4 py-2">{children}</td>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
