'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, ChevronRight } from 'lucide-react'

import { SEMESTERS } from '@/lib/constants'
import { useSemesterStore } from '@/hooks/use-semester-store'

interface CustomDateFilterProps {
  startDate: string
  endDate: string
  onApply: (start: string, end: string) => void
}

function CustomDateFilter({ startDate, endDate, onApply }: CustomDateFilterProps) {
  const [localStart, setLocalStart] = useState(startDate)
  const [localEnd, setLocalEnd] = useState(endDate)

  return (
    <div className='animate-fade-in mt-1.5 flex items-center gap-1.5 sm:mt-0'>
      <Input
        type='date'
        value={localStart}
        onChange={(e) => setLocalStart(e.target.value)}
        className='h-7 w-28 rounded-lg border-neutral-200 px-2 text-[11px] dark:border-neutral-800'
      />
      <ChevronRight className='h-3 w-3 shrink-0 text-muted-foreground' />
      <Input
        type='date'
        value={localEnd}
        onChange={(e) => setLocalEnd(e.target.value)}
        className='h-7 w-28 rounded-lg border-neutral-200 px-2 text-[11px] dark:border-neutral-800'
      />
      <Button
        onClick={() => onApply(localStart, localEnd)}
        className='flex h-7 items-center justify-center rounded-lg bg-indigo-600 px-2.5 text-[11px] font-bold text-white shadow-sm hover:bg-indigo-500'
      >
        Áp dụng
      </Button>
    </div>
  )
}

export function SemesterFilter() {
  const router = useRouter()
  const { semesterId, startDate, endDate, setSemester } = useSemesterStore()

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value !== 'custom') {
      setSemester(value)
      // Trì hoãn một chút để đảm bảo cookie được ghi xong trước khi refresh
      setTimeout(() => {
        router.refresh()
      }, 50)
    } else {
      // Khi chọn custom, ta truyền ngày hiện tại của store làm giá trị ban đầu
      setSemester('custom', startDate, endDate)
    }
  }

  const handleApplyCustomDate = (start: string, end: string) => {
    setSemester('custom', start, end)
    setTimeout(() => {
      router.refresh()
    }, 50)
  }

  return (
    <div className='flex flex-col items-stretch gap-1.5 text-foreground sm:flex-row sm:items-center'>
      {/* Dropdown chọn học kỳ gọn gàng */}
      <div className='flex items-center gap-1.5'>
        <Calendar className='hidden h-4.5 w-4.5 shrink-0 text-muted-foreground md:inline' />
        <select
          value={semesterId}
          onChange={handleSemesterChange}
          className='w-full cursor-pointer rounded-xl border border-neutral-200 bg-background px-2.5 py-1.5 text-xs font-bold shadow-xs transition-colors hover:bg-muted/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden sm:w-44 lg:w-48 dark:border-neutral-800 dark:text-neutral-100'
        >
          {SEMESTERS.map((sem) => (
            <option key={sem.id} value={sem.id}>
              {sem.label.replace('Học kỳ ', 'Kỳ ').split(' (')[0]}
            </option>
          ))}
          <option value='custom'>📅 Tùy chỉnh ngày</option>
        </select>
      </div>

      {/* Inputs chọn ngày tùy chỉnh gọn gàng */}
      {semesterId === 'custom' && (
        <CustomDateFilter
          key={`${startDate}-${endDate}`}
          startDate={startDate}
          endDate={endDate}
          onApply={handleApplyCustomDate}
        />
      )}
    </div>
  )
}
