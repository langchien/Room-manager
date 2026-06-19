import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ArrowRight, Droplet, ShieldCheck, Trash2, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in'>
      {/* Hero Section */}
      <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 sm:p-12 text-white shadow-2xl'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50' />
        <div className='relative z-10 max-w-2xl space-y-4'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-white/90'>
            <Activity className='h-3.5 w-3.5 animate-pulse' />
            Live Dashboard
          </span>
          <h1 className='text-4xl sm:text-5xl font-black tracking-tight leading-none'>
            ROOM 508 <span className='text-yellow-300'>PRO MAX</span>
          </h1>
          <p className='text-lg text-white/90 font-medium'>
            Hệ thống quản lý tối cao cho căn hộ công nghệ 508. Tự động hóa lịch trực nhật, theo dõi
            đóng góp và duy trì hòa bình nội bộ.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Card Thành Viên */}
        <Card className='group relative overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
          <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
            <Users className='h-24 w-24 text-primary' />
          </div>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle className='text-xl font-bold'>Thành Viên</CardTitle>
              <CardDescription>Danh sách cư dân 508</CardDescription>
            </div>
            <div className='h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400'>
              <Users className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-3xl font-extrabold tracking-tight'>12 Thành Viên</div>
            <Link
              href='/members'
              className='inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group/btn'
            >
              Xem chi tiết{' '}
              <ArrowRight className='h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1' />
            </Link>
          </CardContent>
        </Card>

        {/* Card Đổ Rác */}
        <Card className='group relative overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
          <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
            <Trash2 className='h-24 w-24 text-primary' />
          </div>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle className='text-xl font-bold'>Lịch Đổ Rác</CardTitle>
              <CardDescription>Nhiệm vụ bảo vệ môi trường</CardDescription>
            </div>
            <div className='h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400'>
              <Trash2 className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-3xl font-extrabold tracking-tight'>
              Hôm nay: <span className='text-amber-500'>Lăng Trọng Tiến</span>
            </div>
            <Link
              href='/garbage-stats'
              className='inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group/btn'
            >
              Xem thống kê{' '}
              <ArrowRight className='h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1' />
            </Link>
          </CardContent>
        </Card>

        {/* Card Đổ Nước */}
        <Card className='group relative overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
          <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity'>
            <Droplet className='h-24 w-24 text-primary' />
          </div>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle className='text-xl font-bold'>Đổi Bình Nước</CardTitle>
              <CardDescription>Duy trì nguồn nước sạch</CardDescription>
            </div>
            <div className='h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 dark:text-sky-400'>
              <Droplet className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-3xl font-extrabold tracking-tight'>
              Bình nước: <span className='text-sky-500'>~60%</span>
            </div>
            <Link
              href='/water-stats'
              className='inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group/btn'
            >
              Xem lịch sử{' '}
              <ArrowRight className='h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1' />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Rules & Info Banner */}
      <Card className='border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-zinc-900/50'>
        <CardHeader className='flex flex-row items-center gap-4'>
          <div className='p-3 bg-green-500/10 text-green-500 rounded-2xl'>
            <ShieldCheck className='h-6 w-6' />
          </div>
          <div>
            <CardTitle className='text-lg font-bold'>Nội quy phòng 508</CardTitle>
            <CardDescription>
              Đồng lòng xây dựng tập thể văn minh, tự giác và đoàn kết.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground'>
          <div className='flex gap-2.5 items-start'>
            <span className='h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-foreground flex items-center justify-center font-bold text-xs shrink-0'>
              1
            </span>
            <p>Đổ rác đúng lịch trực nhật, không để rác ùn ứ qua đêm gây mất vệ sinh.</p>
          </div>
          <div className='flex gap-2.5 items-start'>
            <span className='h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-foreground flex items-center justify-center font-bold text-xs shrink-0'>
              2
            </span>
            <p>Phát hiện bình nước hết chủ động bê bình nước mới lắp vào, ghi nhận công lao.</p>
          </div>
          <div className='flex gap-2.5 items-start'>
            <span className='h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-foreground flex items-center justify-center font-bold text-xs shrink-0'>
              3
            </span>
            <p>Giữ gìn không gian chung sạch sẽ, tôn trọng giấc ngủ của người khác sau 23h.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
