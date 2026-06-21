'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { CalendarRange, Droplet, Menu, Trash2, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { SemesterFilter } from '../stats/SemesterFilter'
import { ModeToggle } from '../themes/mode-toggle'

export function AppHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Đã xóa nút Trang chủ (vì click vào logo cũng về Trang chủ)
  const navItems = [
    { to: '/members', label: 'Thành viên', icon: Users },
    { to: '/garbage-stats', label: 'Đổ rác', icon: Trash2 },
    { to: '/water-stats', label: 'Đổ nước', icon: Droplet },
    { to: '/schedule-manager', label: 'Quản lý lịch', icon: CalendarRange },
  ]

  return (
    <header className='sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 shadow-[0_1px_10px_rgba(0,0,0,0.03)] backdrop-blur-md supports-backdrop-filter:bg-background/60 dark:shadow-[0_1px_15px_rgba(0,0,0,0.2)]'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* MOBILE MENU (Hamburger button on the Left) */}
        <div className='md:hidden'>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className='flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/50 hover:bg-muted focus:ring-2 focus:ring-indigo-500/20 focus:outline-none'
                aria-label='Open Menu'
              >
                <Menu className='h-5 w-5 text-foreground' />
              </button>
            </SheetTrigger>

            <SheetContent
              side='left'
              className='flex w-[280px] flex-col justify-between p-6 sm:w-[320px]'
            >
              <div className='space-y-6'>
                <SheetHeader className='border-b border-border/40 p-0 pb-4 text-left'>
                  <SheetTitle className='text-lg font-black tracking-tight'>
                    DASHBOARD 508
                  </SheetTitle>
                  <SheetDescription className='text-[10px] text-muted-foreground'>
                    Hệ thống quản lý trực nhật phòng 508.
                  </SheetDescription>
                </SheetHeader>

                {/* Vertical Navigation Links */}
                <nav className='flex flex-col gap-2'>
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.to
                    return (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-semibold transition-all duration-200',
                          isActive
                            ? 'border-primary/20 bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                        )}
                      >
                        <Icon className='h-4.5 w-4.5' />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Mobile global tools (Semester filter + Theme toggle) */}
              <div className='mt-auto space-y-5 border-t border-border/40 pt-5'>
                <div className='space-y-2'>
                  <span className='block text-[10px] font-black tracking-wider text-muted-foreground uppercase'>
                    Lọc theo học kỳ
                  </span>
                  <SemesterFilter />
                </div>

                <div className='flex items-center justify-between border-t border-border/20 pt-4'>
                  <span className='text-[10px] font-black tracking-wider text-muted-foreground uppercase'>
                    Chế độ tối/sáng
                  </span>
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* LOGO (Left on Desktop, Right on Mobile) */}
        <Link
          href='/'
          className='group order-last flex items-center transition-all duration-300 hover:opacity-90 md:order-first'
        >
          <Image
            src='/508 pro max logo.png'
            alt='508 Pro Max Logo'
            width={290}
            height={65}
            priority
            className='object-contain transition-transform duration-500 group-hover:scale-103'
          />
        </Link>

        {/* DESKTOP MENU (Centered, Hidden on Mobile) */}
        <nav className='hidden items-center gap-1.5 md:flex lg:gap-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.to
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  'group relative flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-2 text-sm font-semibold transition-all duration-300',
                  isActive
                    ? 'border-primary/20 bg-primary/10 text-primary shadow-[inset_0_0_12px_rgba(var(--primary),0.05)]'
                    : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                )}
              >
                <Icon className='h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110' />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* DESKTOP GLOBAL TOOLS (Right, Hidden on Mobile) */}
        <div className='hidden items-center gap-3 sm:gap-4 md:flex'>
          <SemesterFilter />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
