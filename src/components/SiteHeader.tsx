import Link from 'next/link'
import type {NavLink, SiteSettings} from '@/sanity/types'

const defaultNav: NavLink[] = [
  {label: 'Bots', href: '/bots'},
  {label: 'Research', href: '/research'},
  {label: 'Utilities', href: '/utilities'},
  {label: 'Downloads', href: '/downloads'},
]

type SiteHeaderProps = {
  settings: SiteSettings | null
}

export function SiteHeader({settings}: SiteHeaderProps) {
  const navLinks = settings?.navLinks?.length ? settings.navLinks : defaultNav
  const siteTitle = settings?.siteTitle ?? 'TradeOps Library'

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight text-white">
          {siteTitle}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-white/60 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-white transition hover:border-white/50"
          >
            Browse library
          </Link>
        </nav>
      </div>
    </header>
  )
}
