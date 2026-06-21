import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Member } from '@/generated/prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { Button } from '../ui/button'

// Component riêng quản lý trạng thái hiển thị CCCD của từng hàng độc lập
function CccdCell({ rawCccd }: { rawCccd: string }) {
  const [isVisible, setIsVisible] = React.useState(false)
  const maskedCccd = rawCccd !== 'Chưa cập nhật' ? '••••••••••••' : 'Chưa cập nhật'

  if (rawCccd === 'Chưa cập nhật') {
    return <p className='text-xs text-muted-foreground italic'>{rawCccd}</p>
  }

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{isVisible ? rawCccd : maskedCccd}</span>
        </TooltipTrigger>
        <TooltipContent>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              setIsVisible((prev) => !prev)
            }}
            title={isVisible ? 'Ẩn số CCCD' : 'Hiển thị số CCCD'}
          >
            {isVisible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
          </Button>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export const memberColumns: ColumnDef<Member>[] = [
  {
    id: 'STT',
    accessorKey: 'numberOrder',
    header: () => <div className='w-15 text-center'>STT</div>,
    cell: ({ row }) => (
      <div className='text-center font-mono text-xs font-medium text-muted-foreground'>
        {String(row.original.numberOrder).padStart(2, '0')}
      </div>
    ),
  },
  {
    id: 'Họ và Tên',
    accessorKey: 'fullName',
    header: 'Họ và Tên',
    cell: ({ row }) => (
      <span className='font-semibold text-foreground'>{row.original.fullName}</span>
    ),
  },
  {
    id: 'MSSV',
    accessorKey: 'studentID',
    header: 'MSSV',
    cell: ({ row }) => (
      <span className='font-mono text-sm font-medium tracking-tight text-foreground/80'>
        {row.original.studentID}
      </span>
    ),
  },
  {
    id: 'Khóa',
    accessorKey: 'major',
    header: 'Khóa',
    cell: ({ row }) => <span className='text-foreground/80'>{row.original.major}</span>,
  },
  {
    id: 'Lớp',
    accessorKey: 'class',
    header: 'Lớp',
    cell: ({ row }) => <span className='text-foreground/80'>{row.original.class}</span>,
  },
  {
    id: 'SĐT',
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }) => (
      <span className='font-mono text-sm text-foreground/80'>{row.original.phoneNumber}</span>
    ),
  },
  {
    id: 'Ngày sinh',
    accessorKey: 'birthDate',
    header: 'Ngày sinh',
    cell: ({ row }) => (
      <span className='whitespace-nowrap text-foreground/80'>{row.original.birthDate}</span>
    ),
  },
  {
    id: 'Số thẻ CCCD',
    accessorKey: 'cccd',
    header: () => <div className='w-30'>Số CCCD</div>,
    cell: ({ row }) => {
      const rawCccd = row.original.cccd || 'Chưa cập nhật'
      return <CccdCell rawCccd={rawCccd} />
    },
  },
  {
    id: 'Quê quán',
    accessorKey: 'homeTown',
    header: 'Quê quán',
    cell: ({ row }) => (
      <div className='max-w-37.5 truncate text-foreground/80' title={row.original.homeTown}>
        {row.original.homeTown}
      </div>
    ),
  },
  {
    id: 'Địa chỉ',
    accessorKey: 'address',
    header: 'Địa chỉ',
    cell: ({ row }) => (
      <div className='truncate text-foreground/80' title={row.original.address}>
        {row.original.address}
      </div>
    ),
  },
]
