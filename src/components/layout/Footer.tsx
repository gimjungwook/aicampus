import Link from 'next/link'

const footerLinks = [
  { name: '이용약관', href: '/terms' },
  { name: '개인정보처리방침', href: '/privacy' },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="text-lg font-bold text-primary">AI Campus</span>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Campus. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            문의: <a href="mailto:support@aicampus.com" className="hover:text-foreground">support@aicampus.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
