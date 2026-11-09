import { Notice } from '../ui/Ui';

type SkeletonVariant = 'list' | 'dashboard' | 'calendar' | 'detail';

function Block({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-md bg-slate-200/90 ${className}`} />;
}

function SkeletonRows() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0 sm:px-5">
          <Block className="size-10 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Block className={`h-3.5 ${index % 2 ? 'w-2/5' : 'w-1/2'}`} />
            <Block className="h-3 w-1/3 bg-slate-100" />
          </div>
          <Block className="hidden h-3 w-20 sm:block" />
          <Block className="size-4 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#244f78] to-[#3979a8] p-6 shadow-sm sm:p-8">
        <Block className="h-3 w-40 bg-white/25" />
        <Block className="mt-4 h-7 w-64 max-w-full bg-white/30" />
        <Block className="mt-3 h-3.5 w-80 max-w-full bg-white/20" />
        <Block className="mt-6 h-10 w-44 rounded-lg bg-white/90" />
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <Block className="h-3 w-28" />
            <Block className="mt-4 h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {[0, 1].map((section) => (
          <div key={section} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <Block className="h-5 w-36" />
            <Block className="mt-2 h-3 w-48" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <Block className="size-9 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Block className="h-3.5 w-3/5" />
                    <Block className="h-3 w-2/5 bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Block className="h-9 w-9 rounded-lg" />
          <Block className="h-9 w-44 rounded-lg" />
          <Block className="h-9 w-16 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Block className="h-9 w-32 rounded-lg" />
          <Block className="h-9 w-36 rounded-lg" />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="space-y-2 border-l border-slate-200 px-3 py-3 first:border-l-0">
              <Block className="mx-auto h-2.5 w-10" />
              <Block className="mx-auto h-3 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5">
          {Array.from({ length: 20 }, (_, index) => (
            <div key={index} className="h-14 border-b border-l border-slate-100 p-1.5 first:border-l-0 sm:h-16">
              {index % 6 === 2 && <Block className="h-10 rounded-md bg-blue-100/80" />}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <Block className="h-4 w-36" />
            <Block className="mt-4 h-4 w-3/5" />
            <Block className="mt-2 h-3 w-2/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <Block className="h-3 w-28" />
        <Block className="mt-4 h-7 w-3/5 max-w-full" />
        <Block className="mt-3 h-3.5 w-2/5 max-w-full" />
        <div className="mt-8 space-y-3">
          <Block className="h-3.5 w-full" />
          <Block className="h-3.5 w-11/12" />
          <Block className="h-3.5 w-4/5" />
          <Block className="h-3.5 w-2/3" />
        </div>
        <Block className="mt-8 h-36 w-full rounded-xl bg-slate-100" />
      </section>
      <aside className="space-y-4">
        {[0, 1].map((index) => (
          <section key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <Block className="h-4 w-32" />
            <Block className="mt-4 h-3 w-full" />
            <Block className="mt-2 h-3 w-4/5" />
            <Block className="mt-5 h-9 w-full rounded-lg" />
          </section>
        ))}
      </aside>
    </div>
  );
}

function LoadingSkeleton({ variant }: { variant: SkeletonVariant }) {
  if (variant === 'dashboard') return <DashboardSkeleton />;
  if (variant === 'calendar') return <CalendarSkeleton />;
  if (variant === 'detail') return <DetailSkeleton />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Block className="h-9 w-48 rounded-lg" />
        <Block className="h-9 w-28 rounded-lg" />
      </div>
      <SkeletonRows />
    </div>
  );
}

export function ResourceState({
  loading,
  error,
  variant = 'list',
}: {
  loading: boolean;
  error: string;
  variant?: SkeletonVariant;
}) {
  if (loading) {
    return (
      <div role="status" aria-live="polite" aria-label="Loading page content" className="w-full">
        <span className="sr-only">Loading campus information…</span>
        <LoadingSkeleton variant={variant} />
      </div>
    );
  }
  if (error) return <Notice>{error}</Notice>;
  return null;
}
