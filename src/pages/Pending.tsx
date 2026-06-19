import { useEffect, useState } from 'react'
import type { Task } from '../types'
import { pendingTasks } from '../data'
import { kindMeta } from '../data'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m >= 60) return `${Math.floor(m / 60)}小时${m % 60}分`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Pending({
  onOpenTask,
  onAccept,
  onGoHome,
}: {
  onOpenTask: (t: Task) => void
  onAccept: (t: Task) => void
  onGoHome: () => void
}) {
  // 本地倒计时（每秒 -1）
  const [secs, setSecs] = useState<number[]>(pendingTasks.map((p) => p.expiresInSec))

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((arr) => arr.map((s) => (s > 0 ? s - 1 : s)))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const active = pendingTasks.filter((_, i) => secs[i] > 0)
  const missed = pendingTasks.filter((_, i) => secs[i] <= 0)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="px-5 pt-safe-t pb-3 bg-cream/80 backdrop-blur">
        <h1 className="text-lg font-extrabold text-ink">等一会儿</h1>
        <p className="text-xs text-mute mt-0.5">想好了就点接受，倒计时结束会进「错过了」</p>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 space-y-5">
        {active.length === 0 && missed.length === 0 && (
          <Empty onGoHome={onGoHome} />
        )}

        {active.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs text-mute px-1 pt-2">还来得及（{active.length}）</p>
            {pendingTasks.map((p, i) =>
              secs[i] > 0 ? (
                <PendingCard
                  key={p.task.id}
                  task={p.task}
                  seconds={secs[i]}
                  onOpen={() => onOpenTask(p.task)}
                  onAccept={() => onAccept(p.task)}
                />
              ) : null,
            )}
          </section>
        )}

        {missed.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs text-mute px-1">错过了（{missed.length}）· 还能主动联系</p>
            {pendingTasks.map((p, i) =>
              secs[i] <= 0 ? (
                <MissedCard key={p.task.id} task={p.task} onOpen={() => onOpenTask(p.task)} />
              ) : null,
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function PendingCard({
  task,
  seconds,
  onOpen,
  onAccept,
}: {
  task: Task
  seconds: number
  onOpen: () => void
  onAccept: () => void
}) {
  const meta = kindMeta[task.kind]
  const urgent = seconds < 5 * 60
  return (
    <div className="bg-white rounded-card shadow-soft p-4 animate-slide-up">
      <button onClick={onOpen} className="w-full flex gap-3 text-left">
        <div
          className="w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0"
          style={{ backgroundColor: meta.color + '1A' }}
        >
          {task.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-ink truncate">{task.title}</h3>
          <p className="text-xs text-mute mt-0.5">
            {task.host.emoji} {task.host.grade} · {task.place}
          </p>
          <p className="text-xs text-mute mt-0.5">🕘 {task.whenLabel}</p>
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-sm font-bold tabular-nums ${urgent ? 'text-brand animate-pulse' : 'text-mute'}`}
        >
          ⏳ 还剩 {fmt(seconds)}
        </span>
        <button
          onClick={onAccept}
          className="bg-brand text-white font-bold text-sm px-5 py-2 rounded-full shadow-soft active:animate-pop"
        >
          我去！🙋
        </button>
      </div>
    </div>
  )
}

function MissedCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white/60 rounded-card p-4 flex gap-3 items-center opacity-80 active:scale-[0.98] transition-transform"
    >
      <div className="w-11 h-11 rounded-2xl grid place-items-center text-xl shrink-0 bg-cream grayscale">
        {task.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink/70 truncate">{task.title}</h3>
        <p className="text-xs text-mute mt-0.5">
          {task.host.emoji} {task.host.grade} · {task.whenLabel} · 已结束
        </p>
      </div>
      <span className="text-xs text-brand font-medium shrink-0">联系 TA →</span>
    </button>
  )
}

function Empty({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="pt-24 flex flex-col items-center text-center">
      <div className="text-5xl mb-3">🍵</div>
      <p className="font-bold text-ink">还没有在等的任务</p>
      <p className="text-xs text-mute mt-1 mb-5">看到心动的活动，点「等一会儿」先存着</p>
      <button
        onClick={onGoHome}
        className="bg-brand text-white font-bold px-6 py-2.5 rounded-full shadow-soft active:animate-pop"
      >
        看看周围
      </button>
    </div>
  )
}
