import { StatsDashboard } from '@/components/stats/StatsDashboard'
import { TransationType } from '@/generated/prisma/client'
import { transactionApi } from '@/apis/transaction.api'

interface PageProps {
  searchParams: Promise<{
    semester?: string
    startDate?: string
    endDate?: string
  }>
}

export default async function GarbageStatsPage({ searchParams }: PageProps) {
  const headerBadgeText = await transactionApi.getTodayBadgeText(TransationType.GARBAGE)

  return (
    <StatsDashboard
      type={TransationType.GARBAGE}
      title="THỐNG KÊ ĐỔ RÁC"
      description="Ghi nhận chiến công dọn dẹp vệ sinh phòng 508."
      iconName="Trash2"
      primaryColor="rose"
      leaderboardTitle='Bảng Vàng "Dũng Sĩ Diệt Rác"'
      leaderboardDescription="Số lần đổ rác ghi nhận trong học kỳ."
      logTitle="Nhật Ký Đổ Rác"
      logDescription="Các hoạt động gần nhất."
      bannerTitle="Thử thách học kỳ"
      bannerIconName="Trash2"
      bannerBgClass="from-rose-500 to-orange-500"
      getBannerDescription={(totalCount) =>
        `Cả phòng đã hoàn thành tổng cộng ${totalCount} lần đổ rác trong học kỳ này. Tiếp tục giữ gìn không gian sống sạch đẹp nhé!`
      }
      headerBadgeIconName="AlertCircle"
      headerBadgeText={headerBadgeText}
      searchParams={searchParams}
    />
  )
}
