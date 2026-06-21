'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { TransactionStatus, TransationType, type Member } from '@/types/schedule'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CustomTable } from '@/components/tables/custom-table'
import { getScheduleColumns, type ScheduleTransaction } from '@/components/tables/schedule.column'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import {
  CalendarRange,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Zap,
  CheckCircle2,
  Hourglass,
  XCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface ScheduleManagerClientProps {
  members: Member[]
  initialTransactions: ScheduleTransaction[]
}

export function ScheduleManagerClient({
  members,
  initialTransactions,
}: ScheduleManagerClientProps) {
  const router = useRouter()

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null)
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isAuthLoading, setIsAuthLoading] = React.useState(false)

  // Actions loading states
  const [loadingStates, setLoadingStates] = React.useState<Record<number, boolean>>({})

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [dialogType, setDialogType] = React.useState<TransationType>(TransationType.GARBAGE)
  const [dialogMode, setDialogMode] = React.useState<'QUICK' | 'PLAN'>('QUICK')
  const [selectedMemberId, setSelectedMemberId] = React.useState<number | null>(null)
  const [scheduledAt, setScheduledAt] = React.useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [note, setNote] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Approve Dialog state (duyệt nhanh kèm ghi chú)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = React.useState(false)
  const [approvingTxId, setApprovingTxId] = React.useState<number | null>(null)
  const [approveNote, setApproveNote] = React.useState('')
  const [isApproveSubmitting, setIsApproveSubmitting] = React.useState(false)

  // Phân trang & Lọc
  const [typeFilter, setTypeFilter] = React.useState<TransationType | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 10

  const filteredTransactions = React.useMemo(() => {
    if (typeFilter === 'ALL') return initialTransactions
    return initialTransactions.filter((t) => t.type === typeFilter)
  }, [initialTransactions, typeFilter])

  const paginatedTransactions = React.useMemo(() => {
    return filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filteredTransactions, currentPage, pageSize])

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)

  // Tự động quay về trang trước nếu trang hiện tại không còn phần tử nào (sau khi xóa)
  React.useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
    if (currentPage > maxPage) {
      const timer = setTimeout(() => {
        setCurrentPage(maxPage)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [filteredTransactions.length, currentPage, pageSize])

  // Đọc trạng thái xác thực từ sessionStorage sau khi component mount
  React.useEffect(() => {
    const auth = sessionStorage.getItem('duty_admin_auth')
    const isAuth = auth === 'true'
    const timer = setTimeout(() => {
      setIsAuthenticated(isAuth)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Xử lý xác thực mật khẩu qua API route
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      toast.error('Vui lòng nhập mật khẩu!')
      return
    }

    setIsAuthLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        sessionStorage.setItem('duty_admin_auth', 'true')
        setIsAuthenticated(true)
        toast.success('Xác thực thành công!')
      } else {
        toast.error(data.error || 'Mật khẩu sai!')
      }
    } catch {
      toast.error('Đã xảy ra lỗi kết nối!')
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Thao tác nhanh trên bảng: Mở Dialog hoàn thành công việc PENDING
  const handleComplete = (id: number) => {
    setApprovingTxId(id)
    setApproveNote('')
    setIsApproveDialogOpen(true)
  }

  // Gửi yêu cầu duyệt hoàn thành qua API route
  const handleConfirmApprove = async (e?: React.FormEvent, skipNote = false) => {
    if (e) e.preventDefault()
    if (!approvingTxId) return

    setIsApproveSubmitting(true)
    try {
      const res = await fetch('/api/schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: approvingTxId,
          status: TransactionStatus.COMPLETED,
          note: skipNote ? '' : approveNote,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Ghi nhận hoàn thành công việc!')
        setIsApproveDialogOpen(false)
        setApprovingTxId(null)
        setApproveNote('')
        router.refresh()
      } else {
        toast.error(data.error || 'Có lỗi xảy ra!')
      }
    } catch {
      toast.error('Không thể kết nối đến máy chủ!')
    } finally {
      setIsApproveSubmitting(false)
    }
  }

  // Thao tác nhanh trên bảng: Hủy lịch trực nhật PENDING qua API route
  const handleCancel = async (id: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await fetch('/api/schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: TransactionStatus.CANCELLED }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Đã hủy lịch trực nhật này!')
        router.refresh()
      } else {
        toast.error(data.error || 'Có lỗi xảy ra!')
      }
    } catch {
      toast.error('Không thể kết nối đến máy chủ!')
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Thao tác nhanh trên bảng: Xóa lịch sử trực nhật qua API route
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản ghi trực nhật này không?')) return

    setLoadingStates((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`/api/schedule?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Đã xóa bản ghi thành công!')
        router.refresh()
      } else {
        toast.error(data.error || 'Có lỗi xảy ra!')
      }
    } catch {
      toast.error('Không thể kết nối đến máy chủ!')
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Lấy avatar viết tắt của thành viên (Ví dụ: Nguyễn Minh Hiếu -> NMH)
  const getMemberInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    let initials = parts
      .map((p) => p[0])
      .join('')
      .toUpperCase()
    if (initials.length > 3) {
      initials = initials.slice(-3)
    }
    return initials || 'TV'
  }

  // Lấy tên ngắn của thành viên (Ví dụ: Lăng Trọng Tiến -> Tiến)
  const getShortName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    return parts[parts.length - 1]
  }

  // Tạo mới giao dịch trực nhật (Lên lịch hoặc Ghi nhận nhanh) qua API route
  const handleSubmitTransaction = async (memberId: number, options?: { forceQuick?: boolean }) => {
    const mode = options?.forceQuick ? 'QUICK' : dialogMode
    setIsSubmitting(true)
    try {
      const status = mode === 'QUICK' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING
      const dateStr =
        mode === 'QUICK' ? new Date().toISOString() : new Date(scheduledAt).toISOString()

      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          type: dialogType,
          status,
          scheduledAt: dateStr,
          note: mode === 'QUICK' ? '' : note,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(
          mode === 'QUICK'
            ? `Đã ghi nhận công việc cho ${getShortName(members.find((m) => m.id === memberId)?.fullName || '')}!`
            : `Đã lên lịch trực nhật thành công!`,
        )
        setIsDialogOpen(false)
        // Reset form
        setSelectedMemberId(null)
        setNote('')
        setScheduledAt(new Date().toISOString().split('T')[0])
        router.refresh()
      } else {
        toast.error(data.error || 'Có lỗi xảy ra!')
      }
    } catch (err) {
      toast.error('Không thể kết nối đến máy chủ!')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render cột cho table
  const columns = React.useMemo(
    () =>
      getScheduleColumns({
        onComplete: handleComplete,
        onCancel: handleCancel,
        onDelete: handleDelete,
        loadingStates,
      }),
    [loadingStates],
  )

  // Tính toán nhanh stats
  const stats = React.useMemo(() => {
    const total = initialTransactions.length
    const completed = initialTransactions.filter(
      (t) => t.status === TransactionStatus.COMPLETED,
    ).length
    const pending = initialTransactions.filter((t) => t.status === TransactionStatus.PENDING).length
    const cancelled = initialTransactions.filter(
      (t) => t.status === TransactionStatus.CANCELLED,
    ).length
    return { total, completed, pending, cancelled }
  }, [initialTransactions])

  // Trạng thái load ban đầu
  if (isAuthenticated === null) {
    return (
      <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  // 1. MÀN HÌNH KHÓA (NHẬP PASSWORD)
  if (!isAuthenticated) {
    return (
      <div className='relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-radial from-indigo-500/5 via-transparent to-transparent px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md border border-neutral-200/50 bg-background/65 p-6 shadow-2xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-zinc-950/65'>
          <CardHeader className='space-y-1 pb-4 text-center'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-inner dark:text-indigo-400'>
              <Lock className='h-6 w-6' />
            </div>
            <CardTitle className='mt-4 text-2xl font-black tracking-tight'>
              XÁC THỰC ADMIN
            </CardTitle>
            <CardDescription className='text-xs/relaxed text-muted-foreground'>
              Vui lòng nhập mật khẩu quản trị viên để vào khu vực quản lý trực nhật phòng 508.
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-2'>
            <form onSubmit={handleAuthSubmit} className='space-y-4'>
              <div className='relative flex items-center'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu Admin...'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='h-10 rounded-xl border border-input/60 bg-background pr-10 pl-3 dark:bg-background/50'
                  disabled={isAuthLoading}
                  autoFocus
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 text-muted-foreground transition-colors hover:text-foreground'
                  disabled={isAuthLoading}
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>

              <Button
                type='submit'
                className='h-10 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500'
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (
                  <span className='flex items-center justify-center gap-1.5'>
                    <span className='h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Đang xác thực...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster position='top-center' />
      </div>
    )
  }

  // 2. GIAO DIỆN QUẢN LÝ CHÍNH
  return (
    <div className='animate-fade-in mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-10 xl:px-20'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-4 border-b border-neutral-200/60 pb-6 md:flex-row md:items-center dark:border-neutral-800/60'>
        <div className='flex items-center gap-3'>
          <div className='flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-md shadow-indigo-500/5 dark:text-indigo-400'>
            <CalendarRange className='size-6 animate-pulse' />
          </div>
          <div>
            <h1 className='flex items-center gap-2 text-3xl font-black tracking-tight sm:text-4xl'>
              QUẢN LÝ LỊCH TRỰC NHẬT
              <Sparkles className='animate-spin-slow h-5.5 w-5.5 text-indigo-500 dark:text-indigo-400' />
            </h1>
            <p className='mt-1 text-sm text-muted-foreground sm:text-base'>
              Lên lịch hoặc ghi nhận nhanh hoạt động trực nhật (đổ rác & đổi nước) phòng 508.
            </p>
          </div>
        </div>

        <div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className='flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 sm:text-base'
          >
            <Plus className='h-5 w-5' /> Lên lịch trực nhật
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        <Card className='border border-neutral-200/50 dark:border-neutral-800/50'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2'>
            <CardTitle className='text-xs font-semibold text-muted-foreground'>Tổng số</CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='text-2xl font-black'>{stats.total}</div>
            <p className='mt-0.5 text-[10px] text-muted-foreground'>Bản ghi đã lưu</p>
          </CardContent>
        </Card>

        <Card className='border border-neutral-200/50 dark:border-neutral-800/50'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2'>
            <CardTitle className='text-xs font-semibold text-muted-foreground'>
              Hoàn thành
            </CardTitle>
            <CheckCircle2 className='h-4 w-4 text-emerald-500' />
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='text-2xl font-black text-emerald-500'>{stats.completed}</div>
            <p className='mt-0.5 text-[10px] text-muted-foreground'>Công việc đã làm</p>
          </CardContent>
        </Card>

        <Card className='border border-neutral-200/50 dark:border-neutral-800/50'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2'>
            <CardTitle className='text-xs font-semibold text-muted-foreground'>
              Chờ thực hiện
            </CardTitle>
            <Hourglass className='h-4 w-4 text-amber-500' />
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='text-2xl font-black text-amber-500'>{stats.pending}</div>
            <p className='mt-0.5 text-[10px] text-muted-foreground'>Đang chờ xác nhận</p>
          </CardContent>
        </Card>

        <Card className='border border-neutral-200/50 dark:border-neutral-800/50'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2'>
            <CardTitle className='text-xs font-semibold text-muted-foreground'>Đã hủy</CardTitle>
            <XCircle className='h-4 w-4 text-neutral-500' />
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='text-2xl font-black text-neutral-500'>{stats.cancelled}</div>
            <p className='mt-0.5 text-[10px] text-muted-foreground'>Lịch bị hủy bỏ</p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className='border border-neutral-200/50 shadow-md dark:border-neutral-800/50'>
        <CardHeader className='flex flex-col items-start justify-between gap-4 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center dark:border-neutral-800/50'>
          <div>
            <CardTitle className='text-lg font-bold'>Nhật Ký Trực Nhật</CardTitle>
            <CardDescription>
              Danh sách lịch đổ rác và đổi nước được ghi nhận trong phòng.
            </CardDescription>
          </div>
          <div className='flex w-full items-center gap-2 self-end sm:w-auto sm:self-auto'>
            <span className='hidden text-xs font-bold whitespace-nowrap text-muted-foreground sm:inline'>
              Loại công việc:
            </span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TransationType | 'ALL')
                setCurrentPage(1)
              }}
              className='w-full cursor-pointer rounded-xl border border-neutral-200 bg-background px-3 py-1.5 text-xs font-bold shadow-xs transition-colors hover:bg-muted/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden sm:w-36 dark:border-neutral-800 dark:text-neutral-100'
            >
              <option value='ALL'>✨ Tất cả</option>
              <option value={TransationType.GARBAGE}>🗑️ Đổ rác</option>
              <option value={TransationType.WATER}>💧 Đổi nước</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <CustomTable
            data={paginatedTransactions}
            columns={columns}
            className='border shadow-inner'
          />

          {/* Giao diện Phân Trang */}
          {totalPages > 1 && (
            <div className='mt-4 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-4 sm:flex-row dark:border-neutral-800/50'>
              <div className='text-xs text-muted-foreground'>
                Hiển thị từ{' '}
                <span className='font-semibold text-foreground'>
                  {(currentPage - 1) * pageSize + 1}
                </span>{' '}
                đến{' '}
                <span className='font-semibold text-foreground'>
                  {Math.min(currentPage * pageSize, filteredTransactions.length)}
                </span>{' '}
                trong tổng số{' '}
                <span className='font-semibold text-foreground'>{filteredTransactions.length}</span>{' '}
                bản ghi
              </div>

              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='icon-sm'
                  className='h-7 w-7 rounded-lg border border-neutral-200/50 dark:border-neutral-800/50'
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  title='Trang trước'
                >
                  <ChevronLeft className='h-3.5 w-3.5' />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isCurrent = currentPage === page
                  return (
                    <Button
                      key={page}
                      variant={isCurrent ? 'default' : 'outline'}
                      className={`h-7 min-w-7 rounded-lg px-2.5 text-[11px] font-semibold ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500'
                          : 'border border-neutral-200/50 text-muted-foreground hover:text-foreground dark:border-neutral-800/50'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant='outline'
                  size='icon-sm'
                  className='h-7 w-7 rounded-lg border border-neutral-200/50 dark:border-neutral-800/50'
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  title='Trang sau'
                >
                  <ChevronRight className='h-3.5 w-3.5' />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOG GHI NHẬN / LÊN LỊCH */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='w-full max-w-md rounded-2xl p-7 sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='text-xl font-black sm:text-2xl'>
              LÊN LỊCH & GHI NHẬN TRỰC NHẬT
            </DialogTitle>
            <DialogDescription className='text-xs sm:text-sm'>
              Chọn loại công việc, chế độ ghi nhận và thành viên thực hiện.
            </DialogDescription>
          </DialogHeader>

          <div className='my-2 space-y-5'>
            {/* 1. Chọn loại công việc */}
            <div className='space-y-2'>
              <label className='text-xs font-extrabold tracking-wide text-muted-foreground uppercase sm:text-sm'>
                1. Loại công việc
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <Button
                  type='button'
                  variant={dialogType === TransationType.GARBAGE ? 'default' : 'outline'}
                  className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-bold sm:h-14 sm:text-base ${
                    dialogType === TransationType.GARBAGE
                      ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/10 hover:bg-rose-600'
                      : 'hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20'
                  }`}
                  onClick={() => setDialogType(TransationType.GARBAGE)}
                >
                  <span className='text-lg'>🗑️</span> Đổ rác
                </Button>
                <Button
                  type='button'
                  variant={dialogType === TransationType.WATER ? 'default' : 'outline'}
                  className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-bold sm:h-14 sm:text-base ${
                    dialogType === TransationType.WATER
                      ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-500/10 hover:bg-sky-600'
                      : 'hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/20'
                  }`}
                  onClick={() => setDialogType(TransationType.WATER)}
                >
                  <span className='text-lg'>💧</span> Đổi nước
                </Button>
              </div>
            </div>

            {/* 2. Chọn chế độ ghi nhận */}
            <div className='space-y-2'>
              <label className='text-xs font-extrabold tracking-wide text-muted-foreground uppercase sm:text-sm'>
                2. Chế độ
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <Button
                  type='button'
                  variant={dialogMode === 'QUICK' ? 'default' : 'outline'}
                  className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold sm:h-14 sm:text-base ${
                    dialogMode === 'QUICK'
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700'
                      : 'hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/20'
                  }`}
                  onClick={() => setDialogMode('QUICK')}
                >
                  <Zap className='h-5 w-5 fill-amber-400 text-amber-400' /> Ghi nhận nhanh
                </Button>
                <Button
                  type='button'
                  variant={dialogMode === 'PLAN' ? 'default' : 'outline'}
                  className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold sm:h-14 sm:text-base ${
                    dialogMode === 'PLAN'
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700'
                      : 'hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/20'
                  }`}
                  onClick={() => setDialogMode('PLAN')}
                >
                  <CalendarRange className='h-5 w-5' /> Lên lịch trước
                </Button>
              </div>
              <p className='mt-1.5 text-[10px] text-muted-foreground/80 italic sm:text-xs'>
                {dialogMode === 'QUICK'
                  ? '* Ghi nhận nhanh: Click chọn thành viên sẽ tạo công việc ĐÃ HOÀN THÀNH ngay lập tức.'
                  : '* Lên lịch trước: Click chọn thành viên, sau đó nhập ngày tháng ở dưới và bấm Xác nhận.'}
              </p>
            </div>

            {/* 3. Chọn thành viên */}
            <div className='space-y-2'>
              <label className='text-xs font-extrabold tracking-wide text-muted-foreground uppercase sm:text-sm'>
                3. Chọn Thành Viên
              </label>
              <div className='grid max-h-56 grid-cols-3 gap-3 overflow-y-auto rounded-2xl border border-border/40 bg-muted/20 p-2'>
                {members.map((m) => {
                  const isSelected = selectedMemberId === m.id
                  const initials = getMemberInitials(m.fullName)
                  const shortName = getShortName(m.fullName)

                  return (
                    <button
                      key={m.id}
                      type='button'
                      disabled={isSubmitting}
                      onClick={() => {
                        if (dialogMode === 'QUICK') {
                          handleSubmitTransaction(m.id, { forceQuick: true })
                        } else {
                          setSelectedMemberId(m.id)
                        }
                      }}
                      className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'border-border bg-background hover:border-indigo-400/50 hover:bg-indigo-50/20 dark:bg-zinc-900/50'
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-black shadow-sm transition-all duration-200 sm:h-12 sm:w-12 sm:text-sm ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white dark:text-indigo-400'
                        }`}
                      >
                        {initials}
                      </div>
                      <span className='w-full truncate text-center text-xs font-bold tracking-tight'>
                        {shortName}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. Form nâng cao khi ở chế độ PLAN */}
            {dialogMode === 'PLAN' && (
              <div className='animate-fade-in space-y-4 border-t border-border/40 pt-3'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-extrabold text-muted-foreground uppercase'>
                      Ngày thực hiện
                    </label>
                    <Input
                      type='date'
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className='h-10 rounded-xl text-sm'
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-extrabold text-muted-foreground uppercase'>
                      Ghi chú (Tùy chọn)
                    </label>
                    <Input
                      type='text'
                      placeholder='Ví dụ: Rác sinh hoạt...'
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className='h-10 rounded-xl text-sm'
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className='flex justify-end gap-3 pt-1'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setIsDialogOpen(false)
                      setSelectedMemberId(null)
                      setNote('')
                    }}
                    disabled={isSubmitting}
                    className='h-10 rounded-xl px-5 text-xs font-bold sm:text-sm'
                  >
                    Hủy
                  </Button>
                  <Button
                    type='button'
                    disabled={isSubmitting || !selectedMemberId}
                    onClick={() => selectedMemberId && handleSubmitTransaction(selectedMemberId)}
                    className='h-10 rounded-xl bg-indigo-600 px-6 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 sm:text-sm'
                  >
                    {isSubmitting ? 'Đang tạo...' : 'Lên lịch ngay'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG XÁC NHẬN DUYỆT NHANH (GHI NHẬN KÈM GHI CHÚ) */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className='w-full max-w-md rounded-2xl p-6'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Duyệt hoàn thành công việc</DialogTitle>
            <DialogDescription className='text-xs sm:text-sm'>
              Bạn có thể điền thêm ghi chú (tùy chọn) hoặc duyệt luôn công việc này.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => handleConfirmApprove(e)} className='my-2 space-y-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-extrabold tracking-wide text-muted-foreground uppercase'>
                Ghi chú (Tùy chọn)
              </label>
              <Input
                type='text'
                placeholder='Ví dụ: Đã đổ rác sạch sẽ, bình nước Lavie 20L...'
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                className='h-10 rounded-xl text-sm'
                disabled={isApproveSubmitting}
                autoFocus
              />
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsApproveDialogOpen(false)
                  setApprovingTxId(null)
                  setApproveNote('')
                }}
                disabled={isApproveSubmitting}
                className='h-10 rounded-xl px-4 text-xs font-semibold sm:text-sm'
              >
                Hủy
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={(e) => handleConfirmApprove(e, true)}
                disabled={isApproveSubmitting}
                className='h-10 rounded-xl px-4 text-xs font-semibold sm:text-sm'
              >
                Duyệt luôn
              </Button>
              <Button
                type='submit'
                disabled={isApproveSubmitting}
                className='h-10 rounded-xl bg-emerald-600 px-5 text-xs font-bold text-white hover:bg-emerald-500 sm:text-sm'
              >
                {isApproveSubmitting ? 'Đang duyệt...' : 'Xác nhận'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster position='top-right' />
    </div>
  )
}
