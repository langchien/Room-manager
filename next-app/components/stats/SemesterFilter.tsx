'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'

import { SEMESTERS } from '@/lib/constants'

export function SemesterFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlSemester = searchParams.get('semester') || '2025.2'
  const urlStart = searchParams.get('startDate') || '2026-02-01'
  const urlEnd = searchParams.get('endDate') || '2026-07-31'

  const [semester, setSemester] = useState(urlSemester)
  const [startDate, setStartDate] = useState(urlStart)
  const [endDate, setEndDate] = useState(urlEnd)

  // Đồng bộ hóa với URL khi URL thay đổi (nhấn back/forward)
  useEffect(() => {
    setSemester(urlSemester)
    if (urlSemester === 'custom') {
      setStartDate(urlStart)
      setEndDate(urlEnd)
    } else {
      const sem = SEMESTERS.find((s) => s.id === urlSemester)
      if (sem) {
        setStartDate(sem.start)
        setEndDate(sem.end)
      }
    }
  }, [urlSemester, urlStart, urlEnd])

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSemester(value)

    if (value !== 'custom') {
      const selectedSem = SEMESTERS.find((s) => s.id === value)
      if (selectedSem) {
        setStartDate(selectedSem.start)
        setEndDate(selectedSem.end)
        
        // Cập nhật URL ngay lập tức
        const params = new URLSearchParams()
        params.set('semester', value)
        router.push(`?${params.toString()}`)
      }
    }
  }

  const handleApplyCustomDate = () => {
    if (semester === 'custom') {
      const params = new URLSearchParams()
      params.set('semester', 'custom')
      params.set('startDate', startDate)
      params.set('endDate', endDate)
      router.push(`?${params.toString()}`)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 bg-neutral-50 dark:bg-neutral-900/40 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
      <div className="w-full sm:w-auto space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Chọn Kỳ Học</label>
        <select
          value={semester}
          onChange={handleSemesterChange}
          className="w-full sm:w-72 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-background px-3.5 py-2 text-sm font-semibold shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary/20 dark:text-neutral-100"
        >
          {SEMESTERS.map((sem) => (
            <option key={sem.id} value={sem.id}>
              {sem.label}
            </option>
          ))}
          <option value="custom">📅 Tùy chỉnh khoảng ngày</option>
        </select>
      </div>

      {semester === 'custom' && (
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-end sm:items-center gap-3 animate-fade-in">
          <div className="w-full sm:w-auto space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Từ Ngày</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-40 rounded-xl"
            />
          </div>
          <div className="w-full sm:w-auto space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Đến Ngày</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-40 rounded-xl"
            />
          </div>
          <Button
            onClick={handleApplyCustomDate}
            className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 text-sm flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" /> Áp dụng
          </Button>
        </div>
      )}
    </div>
  )
}
