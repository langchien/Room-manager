'use client'

import { cn } from '@/lib/utils'
import { Droplet, Home, Trash2, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '../themes/mode-toggle'

export function AppHeader() {
  const pathname = usePathname()
  const navItems = [
    { to: '/', label: 'Trang chủ', icon: Home },
    { to: '/members', label: 'Thành viên', icon: Users },
    { to: '/garbage-stats', label: 'Đổ rác', icon: Trash2 },
    { to: '/water-stats', label: 'Đổ nước', icon: Droplet },
  ]

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 shadow-[0_1px_10px_rgba(0,0,0,0.03)] backdrop-blur-md supports-backdrop-filter:bg-background/60 dark:shadow-[0_1px_15px_rgba(0,0,0,0.2)]'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo & Title */}
        <Link
          href='/'
          className='group flex items-center transition-all duration-300 hover:opacity-90'
        >
          <Image
            src='/508 pro max logo.png'
            alt='508 Pro Max Logo'
            width={290}
            height={65}
            priority
            className='object-contain transition-transform duration-500 group-hover:scale-105'
          />
        </Link>

        {/* Navigation Menu */}
        <nav className='flex items-center gap-1 sm:gap-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.to
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  'group relative flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'border-primary/20 bg-primary/10 text-primary shadow-[inset_0_0_12px_rgba(var(--primary),0.05)]'
                    : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                )}
              >
                <Icon className='h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110' />
                <span className='hidden sm:inline'>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Theme Toggle Button */}
        <div className='flex items-center gap-2'>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
