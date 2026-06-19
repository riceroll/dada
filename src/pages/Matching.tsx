import { useEffect, useState } from 'react'
import type { Task } from '../types'
import DadaMascot from '../components/DadaMascot'

export default function Matching({
  task,
  onMatched,
}: {
  task: Task
  onMatched: () => void
}) {
  const [matched, setMatched] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setMatched(true), 2400)
    const t2 = window.setTimeout(onMatched, 3800)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [onMatched])

  return (
    <div className="flex-1 flex flex-col bg-cream overflow-hidden">
      <div className="flex-1 grid place-items-center px-6 text-center">
        <div className="w-full">
          <div className="relative mx-auto mb-8 w-32 h-32 grid place-items-center">
            <span className="absolute inset-0 rounded-full bg-brand-soft animate-ping" />
            <span className="absolute inset-4 rounded-full bg-brand/10 animate-ping [animation-delay:0.25s]" />
            <div className="relative z-10 bg-white rounded-[36px] shadow-float p-5">
              <DadaMascot size={64} bouncing />
            </div>
          </div>

          <div className="bg-white rounded-card shadow-float p-5 animate-slide-up">
            <div className="text-4xl mb-3">{matched ? '🎉' : task.emoji}</div>
            <h1 className="text-xl font-extrabold text-ink">
              {matched ? '搭成了！' : '已经帮你发过去了'}
            </h1>
            <p className="text-sm text-mute mt-2 leading-relaxed">
              {matched
                ? '对方确认了，正在进入会合界面。'
                : `等 ${task.host.avatarHidden ? '对方' : task.host.name} 回复一下，确认后再带你去会合。`}
            </p>
            <div className="mt-5 bg-cream rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-2xl bg-white grid place-items-center text-2xl shrink-0">
                {task.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-ink truncate">{task.title}</div>
                <div className="text-xs text-mute mt-0.5 truncate">{task.place}</div>
              </div>
            </div>
          </div>

          {!matched && (
            <p className="text-xs text-mute mt-5 animate-pulse">
              哒哒正在等对方确认…
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
