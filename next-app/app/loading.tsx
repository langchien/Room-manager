import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="animate-fade-in mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-10 xl:px-20">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200/60 pb-6 md:flex-row md:items-center dark:border-neutral-800/60">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 sm:w-64" />
            <Skeleton className="h-4 w-72 sm:w-96" />
          </div>
        </div>
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-neutral-200/50 p-4 space-y-3 dark:border-neutral-800/50 bg-card">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-neutral-200/50 shadow-md dark:border-neutral-800/50 bg-card">
        <div className="border-b border-neutral-100 p-4 dark:border-neutral-800/50 space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="p-6 space-y-4">
          {/* Table Header */}
          <div className="flex gap-4 pb-2 border-b border-neutral-100 dark:border-neutral-800/50">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
          </div>
          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-2">
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
