import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="animate-fade-in mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-6 border-b border-neutral-200/60 pb-6 md:flex-row md:items-center dark:border-neutral-800/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-56 sm:w-72" />
          </div>
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Leaderboard Graph */}
        <div className="rounded-xl border border-neutral-200/50 shadow-xs lg:col-span-2 dark:border-neutral-800/50 bg-card p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          
          <div className="space-y-6 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Log & Banner */}
        <div className="space-y-6">
          {/* Log Card */}
          <div className="rounded-xl border border-neutral-200/50 shadow-xs dark:border-neutral-800/50 bg-card p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>

            <div className="space-y-4 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0 dark:border-neutral-800/50">
                  <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner Card */}
          <div className="rounded-2xl p-6 space-y-3 bg-muted dark:bg-zinc-900/60 border border-neutral-200/40 dark:border-neutral-800/40">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
