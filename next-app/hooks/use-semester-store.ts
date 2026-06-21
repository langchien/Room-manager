import { create } from 'zustand'
import { SEMESTERS } from '@/lib/constants'

interface SemesterState {
  semesterId: string
  startDate: string
  endDate: string
  setSemester: (semesterId: string, customStart?: string, customEnd?: string) => void
}

const setSemesterCookie = (semesterId: string, startDate: string, endDate: string) => {
  if (typeof window !== 'undefined') {
    const cookieValue = encodeURIComponent(JSON.stringify({ semesterId, startDate, endDate }))
    // Cookie hết hạn sau 365 ngày
    document.cookie = `selected_semester=${cookieValue}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
  }
}

const getInitialSemester = () => {
  if (typeof window !== 'undefined') {
    const matches = document.cookie.match(/(^| )selected_semester=([^;]*)/)
    if (matches) {
      try {
        const parsed = JSON.parse(decodeURIComponent(matches[2]))
        if (parsed && parsed.semesterId) {
          return parsed
        }
      } catch (e) {
        console.error('Lỗi phân tích cookie selected_semester:', e)
      }
    }
  }
  // Mặc định là học kỳ 2025.2
  return {
    semesterId: '2025.2',
    startDate: '2026-02-01',
    endDate: '2026-07-31',
  }
}

export const useSemesterStore = create<SemesterState>((set) => {
  const initial = getInitialSemester()

  // Khởi tạo cookie mặc định ở client nếu chưa có
  if (typeof window !== 'undefined') {
    const matches = document.cookie.match(/(^| )selected_semester=([^;]*)/)
    if (!matches) {
      setSemesterCookie(initial.semesterId, initial.startDate, initial.endDate)
    }
  }

  return {
    semesterId: initial.semesterId,
    startDate: initial.startDate,
    endDate: initial.endDate,
    setSemester: (semesterId, customStart, customEnd) => {
      let start = ''
      let end = ''
      if (semesterId === 'custom') {
        start = customStart || ''
        end = customEnd || ''
      } else {
        const sem = SEMESTERS.find((s) => s.id === semesterId)
        if (sem) {
          start = sem.start
          end = sem.end
        }
      }

      set({ semesterId, startDate: start, endDate: end })
      setSemesterCookie(semesterId, start, end)
    },
  }
})
