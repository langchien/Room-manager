import { memberApi } from '@/apis/member.api'
import { prisma } from '@/lib/prisma'
import { ScheduleManagerClient } from './ScheduleManagerClient'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ScheduleManagerPage() {
  const members = await memberApi.getListMember()

  // Đọc học kỳ từ cookie
  const cookieStore = await cookies()
  const semesterCookie = cookieStore.get('selected_semester')
  let startDate: Date | undefined
  let endDate: Date | undefined

  if (semesterCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(semesterCookie.value))
      if (parsed.startDate && parsed.endDate) {
        startDate = new Date(`${parsed.startDate}T00:00:00Z`)
        endDate = new Date(`${parsed.endDate}T23:59:59Z`)
      }
    } catch (e) {
      console.error('Lỗi khi đọc selected_semester cookie:', e)
    }
  }

  // Nếu không đọc được cookie, lấy mặc định kỳ 2025.2
  if (!startDate || !endDate) {
    startDate = new Date('2026-02-01T00:00:00Z')
    endDate = new Date('2026-07-31T23:59:59Z')
  }

  // Lấy danh sách giao dịch trực nhật được lọc theo học kỳ đang chọn
  const transactions = await prisma.roomTransaction.findMany({
    where: {
      scheduledAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      member: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      scheduledAt: 'desc',
    },
  })

  return (
    <ScheduleManagerClient members={members as any} initialTransactions={transactions as any} />
  )
}
