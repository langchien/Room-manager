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

export default async function WaterStatsPage({ searchParams }: PageProps) {
  const headerBadgeText = await transactionApi.getTodayBadgeText(TransationType.WATER)

  return (
    <StatsDashboard
      type={TransationType.WATER}
      title="THỐNG KÊ ĐỔ NƯỚC"
      description="Vinh danh những bờ vai gánh vác nguồn sống cho phòng 508."
      iconName="Droplet"
      primaryColor="sky"
      leaderboardTitle='Bảng Phong Thần "Kỳ Tài Gánh Nước"'
      leaderboardDescription="Số lần vác bình nước 20L được ghi nhận."
      logTitle="Nhật Ký Bơm Nước"
      logDescription="Danh sách lần đổi gần đây."
      bannerTitle="Thống kê tiêu thụ"
      bannerIconName="BarChart2"
      bannerBgClass="from-sky-500 to-indigo-600"
      getBannerDescription={(totalCount) =>
        `Cả phòng đã tiêu thụ tổng cộng ${totalCount} bình nước (tương đương ${totalCount * 20} Lít nước). Sức khỏe dồi dào, da dẻ hồng hào!`
      }
      headerBadgeIconName="RefreshCw"
      headerBadgeText={headerBadgeText}
      searchParams={searchParams}
    />
  )
}
