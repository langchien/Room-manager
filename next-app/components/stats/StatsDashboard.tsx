import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Droplet, 
  Trash2, 
  Award, 
  Trophy, 
  Calendar, 
  Clock, 
  BarChart2, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react'
import { transactionApi } from '@/apis/transaction.api'
import { TransationType } from '@/generated/prisma/client'
import { SemesterFilter } from './SemesterFilter'
import { SEMESTERS } from '@/lib/constants'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Map tên icon sang Component thực tế
const iconMap = {
  Droplet: Droplet,
  Trash2: Trash2,
  BarChart2: BarChart2,
  RefreshCw: RefreshCw,
  AlertCircle: AlertCircle,
  Award: Award,
  Trophy: Trophy,
  Calendar: Calendar,
  Clock: Clock,
}

export interface StatsDashboardProps {
  type: TransationType
  title: string
  description: string
  iconName: 'Droplet' | 'Trash2'
  primaryColor: 'sky' | 'rose'
  leaderboardTitle: string
  leaderboardDescription: string
  logTitle: string
  logDescription: string
  bannerTitle: string
  bannerIconName: 'BarChart2' | 'Trash2'
  bannerBgClass: string
  getBannerDescription: (totalCount: number) => string
  headerBadgeIconName: 'RefreshCw' | 'AlertCircle'
  headerBadgeText: string
  headerBadgeClass?: string
  searchParams: Promise<{
    semester?: string
    startDate?: string
    endDate?: string
  }> | {
    semester?: string
    startDate?: string
    endDate?: string
  }
}

export async function StatsDashboard(props: StatsDashboardProps) {
  // Giải quyết searchParams (có thể là Promise trong các phiên bản Next.js mới)
  const resolvedSearchParams = 'then' in props.searchParams ? await props.searchParams : props.searchParams
  
  const semesterId = resolvedSearchParams.semester || '2025.2'
  let startDate: Date | undefined
  let endDate: Date | undefined

  if (semesterId === 'custom' && resolvedSearchParams.startDate && resolvedSearchParams.endDate) {
    startDate = new Date(`${resolvedSearchParams.startDate}T00:00:00Z`)
    endDate = new Date(`${resolvedSearchParams.endDate}T23:59:59Z`)
  } else {
    // Mặc định hoặc học kỳ xác định
    const selectedSem = SEMESTERS.find((s) => s.id === semesterId) || SEMESTERS.find((s) => s.id === '2025.2')
    if (selectedSem) {
      startDate = new Date(`${selectedSem.start}T00:00:00Z`)
      endDate = new Date(`${selectedSem.end}T23:59:59Z`)
    }
  }

  // 1. Fetch data thực tế từ DB
  const { leaderboard, recentLogs, totalCount } = await transactionApi.getStats({
    type: props.type,
    startDate,
    endDate,
  })

  // Tìm count lớn nhất để tính tỉ lệ phần trăm cho biểu đồ cột
  const maxCount = Math.max(...leaderboard.map((item) => item.count), 1)

  // Lấy các Icon Components tương ứng
  const TitleIcon = iconMap[props.iconName]
  const HeaderBadgeIcon = iconMap[props.headerBadgeIconName]
  const BannerIcon = iconMap[props.bannerIconName]
  
  // Icon cho phần bảng vàng / bảng phong thần
  const LeaderboardIcon = props.type === TransationType.WATER ? Award : Trophy
  const LogIcon = props.type === TransationType.WATER ? Droplet : Clock
  const LogHeaderIcon = props.type === TransationType.WATER ? Calendar : Clock

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-200/60 dark:border-neutral-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2.5">
            <TitleIcon className={`h-8 w-8 text-${props.primaryColor}-500 animate-pulse`} />
            {props.title}
          </h1>
          <p className="text-muted-foreground mt-1">{props.description}</p>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant="outline" 
            className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 border-${props.primaryColor}-500/20 bg-${props.primaryColor}-500/10 text-${props.primaryColor}-500 ${props.headerBadgeClass || ''}`}
          >
            <HeaderBadgeIcon className={`h-4 w-4 ${props.headerBadgeIconName === 'RefreshCw' ? 'animate-spin-slow' : ''}`} /> 
            {props.headerBadgeText}
          </Badge>
        </div>
      </div>

      {/* Bộ lọc học kỳ & khoảng thời gian */}
      <SemesterFilter />

      {/* Nội dung chính Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Bảng Xếp Hạng - Biểu Đồ Cột Trực Quan */}
        <Card className="lg:col-span-2 border-neutral-200/50 dark:border-neutral-800/50 shadow-xs">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <LeaderboardIcon className={`h-5 w-5 text-${props.type === TransationType.WATER ? 'sky' : 'amber'}-500`} /> 
              {props.leaderboardTitle}
            </CardTitle>
            <CardDescription>{props.leaderboardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Không có dữ liệu trong khoảng thời gian này.
              </div>
            ) : (
              leaderboard.map((item, index) => {
                const percentage = (item.count / maxCount) * 100
                const displayRank = index + 1
                
                // Class cho huy hiệu thứ hạng
                let rankBadgeClass = 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                if (displayRank === 1) {
                  rankBadgeClass = props.type === TransationType.WATER
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                } else if (displayRank === 2) {
                  rankBadgeClass = 'bg-zinc-300 text-zinc-800 dark:bg-neutral-700 dark:text-neutral-200'
                } else if (displayRank === 3) {
                  rankBadgeClass = 'bg-amber-700 text-white dark:bg-amber-800 dark:text-amber-100'
                }

                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${rankBadgeClass}`}>
                          {displayRank}
                        </span>
                        <span className="font-semibold">{item.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] px-1.5 py-0 border-${props.primaryColor}-500/30 text-${props.primaryColor}-600 dark:text-${props.primaryColor}-400 bg-${props.primaryColor}-500/5`}
                        >
                          {item.rating}
                        </Badge>
                      </div>
                      <span className="font-bold">
                        {item.count} {props.type === TransationType.WATER ? 'bình' : 'lần'}
                      </span>
                    </div>
                    
                    {/* Thanh phần trăm */}
                    <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Cột phải: Nhật ký & Banner tổng hợp */}
        <div className="space-y-6">
          <Card className="border-neutral-200/50 dark:border-neutral-800/50 shadow-xs">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <LogHeaderIcon className={`h-5 w-5 text-${props.type === TransationType.WATER ? 'emerald' : 'indigo'}-500`} />
                {props.logTitle}
              </CardTitle>
              <CardDescription>{props.logDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {recentLogs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Chưa có lịch sử.
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 items-start border-b border-neutral-100 dark:border-neutral-800/50 pb-3 last:border-0 last:pb-0">
                    <div className={`p-2 bg-${props.primaryColor}-500/10 text-${props.primaryColor}-500 rounded-xl mt-0.5`}>
                      <LogIcon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {log.name}{' '}
                        <span className="font-normal text-muted-foreground">
                          {props.type === TransationType.WATER ? 'đã bê lắp' : 'đã dọn đổ'}
                        </span>{' '}
                        {log.note}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> 
                        {format(new Date(log.date), 'dd/MM/yyyy, HH:mm', { locale: vi })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Banner Thống kê tổng hợp */}
          <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg space-y-3 bg-gradient-to-br ${props.bannerBgClass}`}>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <BannerIcon className="h-32 w-32" />
            </div>
            <h3 className="text-lg font-bold">{props.bannerTitle}</h3>
            <p className="text-sm text-white/90">
              {props.getBannerDescription(totalCount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
