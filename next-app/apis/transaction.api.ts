import { TransactionStatus, TransationType } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export interface LeaderboardItem {
  name: string
  count: number
  avatar: string
  rating: string
  color: string
}

export interface RecentLogItem {
  id: number
  name: string
  date: Date
  note: string
}

export interface StatsData {
  leaderboard: LeaderboardItem[]
  recentLogs: RecentLogItem[]
  totalCount: number
}

const waterColors = [
  'from-blue-500 to-sky-400',
  'from-sky-500 to-cyan-400',
  'from-cyan-500 to-indigo-400',
  'from-indigo-500 to-blue-400',
  'from-teal-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
]

const garbageColors = [
  'from-rose-500 to-red-400',
  'from-red-500 to-orange-400',
  'from-orange-500 to-amber-400',
  'from-amber-500 to-yellow-400',
  'from-teal-500 to-emerald-400',
  'from-green-500 to-emerald-400',
]

function getTodayRangeICT() {
  const now = new Date()
  const tzOffset = 7 * 60 * 60 * 1000
  const localTime = new Date(now.getTime() + tzOffset)

  const localStart = new Date(localTime)
  localStart.setUTCHours(0, 0, 0, 0)

  const localEnd = new Date(localTime)
  localEnd.setUTCHours(23, 59, 59, 999)

  const dbStart = new Date(localStart.getTime() - tzOffset)
  const dbEnd = new Date(localEnd.getTime() - tzOffset)

  return { dbStart, dbEnd }
}

const getShortName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/)
  return parts[parts.length - 1]
}

export const transactionApi = {
  getTodayBadgeText: async (type: TransationType): Promise<string> => {
    const { dbStart, dbEnd } = getTodayRangeICT()
    const tzOffset = 7 * 60 * 60 * 1000

    if (type === TransationType.GARBAGE) {
      const garbageTxs = await prisma.roomTransaction.findMany({
        where: {
          type: TransationType.GARBAGE,
          status: TransactionStatus.COMPLETED,
          scheduledAt: {
            gte: dbStart,
            lte: dbEnd,
          },
        },
        include: {
          member: true,
        },
      })

      if (garbageTxs.length > 0) {
        const names = garbageTxs.map((tx) => getShortName(tx.member.fullName)).join(' & ')
        return `Hôm nay đổ rác: ${names}`
      }
      return 'Hôm nay chưa có ai đổ rác'
    } else {
      const waterTxs = await prisma.roomTransaction.findMany({
        where: {
          type: TransationType.WATER,
          status: TransactionStatus.COMPLETED,
          scheduledAt: {
            gte: dbStart,
            lte: dbEnd,
          },
        },
        include: {
          member: true,
        },
      })

      if (waterTxs.length > 0) {
        const names = waterTxs.map((tx) => getShortName(tx.member.fullName)).join(' & ')
        return `Hôm nay đổi nước: ${names}`
      }

      // Tìm lần đổi nước gần nhất
      const lastWaterTx = await prisma.roomTransaction.findFirst({
        where: {
          type: TransationType.WATER,
          status: TransactionStatus.COMPLETED,
        },
        include: {
          member: true,
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      })

      if (lastWaterTx) {
        const txTime = new Date(lastWaterTx.scheduledAt)
        const txLocalTime = new Date(txTime.getTime() + tzOffset)

        const txLocalStart = new Date(txLocalTime)
        txLocalStart.setUTCHours(0, 0, 0, 0)

        const txLocalEnd = new Date(txLocalTime)
        txLocalEnd.setUTCHours(23, 59, 59, 999)

        const txDbStart = new Date(txLocalStart.getTime() - tzOffset)
        const txDbEnd = new Date(txLocalEnd.getTime() - tzOffset)

        const sameDayTxs = await prisma.roomTransaction.findMany({
          where: {
            type: TransationType.WATER,
            status: TransactionStatus.COMPLETED,
            scheduledAt: {
              gte: txDbStart,
              lte: txDbEnd,
            },
          },
          include: {
            member: true,
          },
        })

        const names = sameDayTxs.map((tx) => getShortName(tx.member.fullName)).join(' & ')

        const todayLocalStart = new Date(dbStart.getTime() + tzOffset)
        todayLocalStart.setUTCHours(0, 0, 0, 0)
        const lastLocalStart = new Date(txLocalStart)
        lastLocalStart.setUTCHours(0, 0, 0, 0)

        const diffTime = todayLocalStart.getTime() - lastLocalStart.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          return `Hôm qua đổi nước: ${names}`
        }
        return `Lần cuối đổi nước: ${names} (${diffDays} ngày trước)`
      }
      return 'Chưa có dữ liệu đổi nước'
    }
  },

  getStats: async (params: {
    type: TransationType
    startDate?: Date
    endDate?: Date
  }): Promise<StatsData> => {
    const { type, startDate, endDate } = params

    // 1. Xây dựng điều kiện lọc thời gian
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = startDate
    }
    if (endDate) {
      dateFilter.lte = endDate
    }

    const whereClause: any = {
      type,
      status: TransactionStatus.COMPLETED, // Chỉ thống kê các giao dịch đã hoàn thành
    }

    if (startDate || endDate) {
      whereClause.scheduledAt = dateFilter
    }

    // 2. Lấy toàn bộ giao dịch thỏa mãn điều kiện
    const transactions = await prisma.roomTransaction.findMany({
      where: whereClause,
      include: {
        member: true,
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    })

    // 3. Lấy tất cả thành viên trong phòng để khởi tạo bảng xếp hạng
    const allMembers = await prisma.member.findMany({
      orderBy: {
        numberOrder: 'asc',
      },
    })

    // Khởi tạo map đếm
    const memberStatsMap: { [key: number]: { name: string; count: number; avatar: string } } = {}
    allMembers.forEach((m) => {
      // Lấy chữ cái đầu của tên (ví dụ: Lăng Trọng Tiến -> LTT, Nguyễn Minh Hiếu -> NMH)
      const parts = m.fullName.trim().split(/\s+/)
      let avatar = ''
      if (parts.length > 0) {
        avatar = parts
          .map((p) => p[0])
          .join('')
          .toUpperCase()
        if (avatar.length > 3) {
          // Lấy tối đa 3 chữ cái cuối/đầu
          avatar = avatar.slice(-3)
        }
      }

      memberStatsMap[m.id] = {
        name: m.fullName,
        count: 0,
        avatar: avatar || 'TV',
      }
    })

    // Cộng dồn số lần thực hiện
    transactions.forEach((tx) => {
      if (memberStatsMap[tx.memberId]) {
        memberStatsMap[tx.memberId].count++
      }
    })

    // 4. Định hình bảng xếp hạng (Leaderboard)
    const colors = type === TransationType.WATER ? waterColors : garbageColors
    const leaderboard: LeaderboardItem[] = Object.values(memberStatsMap)
      .sort((a, b) => b.count - a.count)
      .map((item, index) => {
        let rating = ''
        if (type === TransationType.WATER) {
          if (index === 0 && item.count > 0) rating = 'Lực Sĩ Bê Nước'
          else if (index === 1 && item.count > 0) rating = 'Tích Cực'
          else if (index === 2 && item.count > 0) rating = 'Chăm Chỉ'
          else if (item.count >= 5) rating = 'Đạt Chỉ Tiêu'
          else if (item.count >= 2) rating = 'Trợ Thủ'
          else rating = 'Cổ Vũ'
        } else {
          if (index === 0 && item.count > 0) rating = 'Dũng Sĩ Diệt Rác'
          else if (index === 1 && item.count > 0) rating = 'Xuất Sắc'
          else if (index === 2 && item.count > 0) rating = 'Tích Cực'
          else if (item.count >= 8) rating = 'Chăm Chỉ'
          else if (item.count >= 4) rating = 'Đạt Yêu Cầu'
          else rating = 'Cần Cố Gắng'
        }

        return {
          ...item,
          rating,
          color: colors[index % colors.length],
        }
      })

    // 5. Nhật ký hoạt động gần đây (Lấy 10 dòng gần nhất)
    const recentLogs: RecentLogItem[] = transactions.slice(0, 10).map((tx) => ({
      id: tx.id,
      name: tx.member.fullName,
      date: tx.scheduledAt,
      note: tx.note || (type === TransationType.WATER ? 'Bình nước 20L Lavie' : 'Rác sinh hoạt'),
    }))

    // 6. Tổng số lần thực hiện
    const totalCount = transactions.length

    return {
      leaderboard,
      recentLogs,
      totalCount,
    }
  },
}
