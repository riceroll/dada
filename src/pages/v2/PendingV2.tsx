import { useEffect, useState } from 'react'
import { ArrowUpRight, Clock3, MapPin, Search } from 'lucide-react'
import type { Task } from '../../types'
import { pendingTasks } from '../../data'
import { TaskIcon, UserAvatar } from '../../components/IconKit'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function PendingV2({
  onOpenTask,
  onAccept,
  onGoHome,
}: {
  onOpenTask: (t: Task) => void
  onAccept: (t: Task) => void
  onGoHome: () => void
}) {
  const [secs, setSecs] = useState<number[]>(pendingTasks.map((p) => p.expiresInSec))

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecs((arr) => arr.map((s) => (s > 0 ? s - 1 : s)))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const activeCount = secs.filter((sec) => sec > 0).length

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-5 pt-safe-t">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Holding room</p>
        <h1 className="mt-3 text-[35px] font-semibold leading-[1.04] tracking-[-0.03em]">这些机会正在等你确认。</h1>
        <div className="mt-5 flex items-center gap-2 rounded-full border border-[#1f1b18]/10 bg-white/72 px-4 py-3 text-sm text-[#6f655d] shadow-[0_12px_30px_rgba(31,27,24,0.06)]">
          <Search size={16} />
          <span>{activeCount} 个还来得及，错过的会自动沉到下面。</span>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
        <div className="space-y-3 pb-4">
          {pendingTasks.map((item, index) => {
            const active = secs[index] > 0
            return (
              <article
                key={item.task.id}
                className={`rounded-[30px] border p-4 shadow-[0_18px_45px_rgba(31,27,24,0.08)] ${
                  active ? 'border-[#1f1b18]/10 bg-white/78' : 'border-dashed border-[#1f1b18]/16 bg-white/42 opacity-70'
                }`}
              >
                <button type="button" onClick={() => onOpenTask(item.task)} className="flex w-full gap-3 text-left">
                  <TaskIcon task={item.task} size="md" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e74]">
                      <Clock3 size={12} />
                      <span>{active ? `剩 ${fmt(secs[index])}` : '已结束'}</span>
                    </div>
                    <h2 className="text-lg font-semibold leading-snug tracking-[-0.01em]">{item.task.title}</h2>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#6f655d]">
                      <MapPin size={14} />
                      <span className="truncate">{item.task.place}</span>
                    </p>
                  </div>
                </button>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f7f2eb] px-3 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <UserAvatar user={item.task.host} size="sm" />
                    <span className="truncate text-sm text-[#5f5750]">{item.task.host.grade} · {item.task.host.college}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => (active ? onAccept(item.task) : onOpenTask(item.task))}
                    className={`ml-3 flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-semibold ${
                      active ? 'bg-[#1f1b18] text-white' : 'border border-[#1f1b18]/10 bg-white text-[#1f1b18]'
                    }`}
                  >
                    {active ? '确认去' : '看看'}
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </article>
            )
          })}
          {pendingTasks.length === 0 && (
            <button type="button" onClick={onGoHome} className="mt-10 w-full rounded-[30px] border border-dashed border-[#1f1b18]/18 bg-white/50 p-8 text-center text-sm text-[#6f655d]">
              暂时没有待确认活动，回雷达看看附近。
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
