'use client'

import { TransactionStatus, TransationType } from '@/types/schedule'
import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Trash } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export type ScheduleTransaction = {
  id: number
  memberId: number
  type: TransationType
  status: TransactionStatus
  scheduledAt: Date
  createdAt: Date
  completedAt: Date | null
  note: string | null
  member: {
    fullName: string
  }
}

interface ActionHandlers {
  onComplete: (id: number) => void
  onCancel: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
  loadingStates: Record<number, boolean>
}

export const getScheduleColumns = (handlers: ActionHandlers): ColumnDef<ScheduleTransaction>[] => [
  {
    id: 'STT',
    header: () => <div className='w-10 text-center'>STT</div>,
    cell: ({ row }) => (
      <div className='text-center font-mono text-xs font-medium text-muted-foreground'>
        {String(row.index + 1).padStart(2, '0')}
      </div>
    ),
  },
  {
    id: 'Loại',
    accessorKey: 'type',
    header: 'Công việc',
    cell: ({ row }) => {
      const type = row.original.type
      const isGarbage = type === TransationType.GARBAGE
      return (
        <Badge
          className={
            isGarbage
              ? 'border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15'
              : 'border-sky-500/20 bg-sky-500/10 text-sky-500 hover:bg-sky-500/15'
          }
          variant='outline'
        >
          {isGarbage ? '🗑️ Đổ rác' : '💧 Đổi nước'}
        </Badge>
      )
    },
  },
  {
    id: 'Thành viên',
    accessorKey: 'member.fullName',
    header: 'Người thực hiện',
    cell: ({ row }) => (
      <span className='font-semibold text-foreground'>{row.original.member.fullName}</span>
    ),
  },
  {
    id: 'Ngày lên lịch',
    accessorKey: 'scheduledAt',
    header: 'Ngày lên lịch',
    cell: ({ row }) => {
      try {
        return (
          <span className='font-mono text-sm text-foreground/80'>
            {format(new Date(row.original.scheduledAt), 'dd/MM/yyyy', { locale: vi })}
          </span>
        )
      } catch {
        return <span className='text-muted-foreground'>-</span>
      }
    },
  },
  {
    id: 'Trạng thái',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.status
      if (status === TransactionStatus.COMPLETED) {
        return (
          <Badge
            className='border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15'
            variant='outline'
          >
            Hoàn thành
          </Badge>
        )
      }
      if (status === TransactionStatus.PENDING) {
        return (
          <Badge
            className='border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/15'
            variant='outline'
          >
            Chờ thực hiện
          </Badge>
        )
      }
      return (
        <Badge
          className='border-neutral-500/20 bg-neutral-500/10 text-neutral-500 hover:bg-neutral-500/15'
          variant='outline'
        >
          Đã hủy
        </Badge>
      )
    },
  },
  {
    id: 'Ngày hoàn thành',
    accessorKey: 'completedAt',
    header: 'Ngày hoàn thành',
    cell: ({ row }) => {
      const completedAt = row.original.completedAt
      if (!completedAt) return <span className='font-mono text-muted-foreground/60'>-</span>
      try {
        return (
          <span className='font-mono text-sm text-foreground/80'>
            {format(new Date(completedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
          </span>
        )
      } catch {
        return <span className='text-muted-foreground'>-</span>
      }
    },
  },
  {
    id: 'Thao tác',
    header: () => <div className='w-36 text-center'>Thao tác</div>,
    cell: ({ row }) => {
      const tx = row.original
      const isLoading = handlers.loadingStates[tx.id] || false

      if (tx.status !== TransactionStatus.PENDING) {
        // Khóa sửa đổi: chỉ hiển thị nút Xóa
        return (
          <div className='flex items-center justify-center'>
            <Button
              size='sm'
              variant='outline'
              className='h-7 border-neutral-200/50 px-2.5 text-[10px] font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive dark:border-neutral-800/50'
              onClick={() => handlers.onDelete(tx.id)}
              disabled={isLoading}
              title='Xóa lịch sử'
            >
              <Trash className='mr-1 h-3 w-3' /> Xóa
            </Button>
          </div>
        )
      }

      return (
        <div className='flex items-center justify-center gap-1.5'>
          <Button
            size='sm'
            className='h-7 rounded-lg bg-emerald-600 px-2.5 text-[10px] font-bold text-white shadow-sm shadow-emerald-600/10 hover:bg-emerald-500'
            onClick={() => handlers.onComplete(tx.id)}
            disabled={isLoading}
          >
            Ghi nhận
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='h-7 rounded-lg border-rose-200 px-2.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/20'
            onClick={() => handlers.onCancel(tx.id)}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
        </div>
      )
    },
  },
]
