import { memberApi } from '@/apis/member.api'
import { MembersTable } from '@/components/tables/MemberTable'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Crown, Sparkles, Users, Wallet } from 'lucide-react'

export default async function ListMember() {
  const members = await memberApi.getListMember()

  return (
    <div className='animate-fade-in mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-10 xl:px-20'>
      {/* Page Header */}
      <div className='flex flex-col justify-between gap-4 border-b border-neutral-200/60 pb-6 md:flex-row md:items-center dark:border-neutral-800/60'>
        <div className='flex items-center gap-3'>
          <div className='flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-md shadow-indigo-500/5 dark:text-indigo-400'>
            <Users className='size-6 animate-pulse' />
          </div>
          <div>
            <h1 className='flex items-center gap-2 text-3xl font-black tracking-tight'>
              CƯ DÂN 508
              <Sparkles className='animate-spin-slow h-5 w-5 text-yellow-500' />
            </h1>
            <p className='mt-0.5 text-sm text-muted-foreground'>
              Quản lý và cập nhật thông tin thành viên chính thức của đại gia đình 508.
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Badge className='flex items-center gap-1.5 rounded-xl border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500'>
            <span className='h-2 w-2 animate-ping rounded-full bg-emerald-500' />
            Đầy đủ: {members.length} thành viên
          </Badge>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Card 1: Trưởng Phòng */}
        <Card className='group relative overflow-hidden border border-neutral-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800/50'>
          <div className='absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10'>
            <Crown className='h-20 w-20 text-amber-500' />
          </div>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle className='text-sm font-semibold text-muted-foreground'>
                Trưởng Phòng
              </CardTitle>
              <CardDescription className='text-lg font-bold text-foreground'>
                Hữu Đạt
              </CardDescription>
            </div>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500'>
              <Crown className='h-4.5 w-4.5' />
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-xs text-muted-foreground'>
              Chịu trách nhiệm ngoại giao và bảo kê phòng.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Quỹ Phòng */}
        <Card className='group relative overflow-hidden border border-neutral-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800/50'>
          <div className='absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10'>
            <Wallet className='h-20 w-20 text-emerald-500' />
          </div>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle className='text-sm font-semibold text-muted-foreground'>
                Quỹ Phòng
              </CardTitle>
              <CardDescription className='text-lg font-bold text-red-500'>
                -1,200,000 đ
              </CardDescription>
            </div>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500'>
              <Wallet className='h-4.5 w-4.5' />
            </div>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <p className='text-xs text-muted-foreground'>Thủ quỹ nắm giữ: Khánh Linh</p>
            <Badge
              variant='outline'
              className='border-emerald-500/30 py-0 text-[10px] text-emerald-500'
            >
              Đã đối soát
            </Badge>
          </CardContent>
        </Card>

        {/* Card 3: Chỉ số gắn kết */}
        <Card className='group relative overflow-hidden border border-neutral-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800/50'>
          <div className='absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10'>
            <Activity className='h-20 w-20 text-rose-500' />
          </div>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div className='space-y-1'>
              <CardTitle className='text-sm font-semibold text-muted-foreground'>
                Chỉ Số Gắn Kết
              </CardTitle>
              <CardDescription className='text-lg font-bold text-foreground'>
                98% (Rất Cao)
              </CardDescription>
            </div>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500'>
              <Activity className='h-4.5 w-4.5' />
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-xs text-muted-foreground'>
              Phát sinh từ việc chăm chỉ dọn dẹp và chơi game chung.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Members List Table Box */}
      <Card className='border border-neutral-200/50 shadow-md dark:border-neutral-800/50'>
        <CardHeader className='border-b border-neutral-100 pb-4 dark:border-neutral-800/50'>
          <CardTitle className='text-lg font-bold'>Danh sách chi tiết</CardTitle>
          <CardDescription>
            Bảng tra cứu thông tin liên lạc và vai trò của từng thành viên.
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <MembersTable members={members} />
        </CardContent>
      </Card>
    </div>
  )
}
