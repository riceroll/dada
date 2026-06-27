import { useEffect, useState } from 'react'
import { Check, Clock3, EyeOff, Send } from 'lucide-react'
import type { ActivityTaskV2 } from '../../types/profile'

interface RequestMatchingV2Props {
  task: ActivityTaskV2
  onMatched: () => void
}

export default function RequestMatchingV2({ task, onMatched }: RequestMatchingV2Props) {
  const [matched, setMatched] = useState(false)

  useEffect(() => {
    const replyTimer = window.setTimeout(() => setMatched(true), 1800)
    const enterTimer = window.setTimeout(onMatched, 3200)
    return () => {
      window.clearTimeout(replyTimer)
      window.clearTimeout(enterTimer)
    }
  }, [onMatched])

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#1f1b18] px-6 pb-safe-b pt-safe-t text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_32%,rgba(255,247,223,0.2),transparent_28%),radial-gradient(circle_at_12%_82%,rgba(185,213,194,0.18),transparent_32%)]" />
      <section className="relative flex flex-1 flex-col justify-center">
        <div className="mx-auto mb-10 flex h-48 w-48 items-center justify-center rounded-full border border-white/12 bg-white/5 shadow-[0_0_120px_rgba(255,247,223,0.18)] backdrop-blur-xl">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full ${matched ? 'bg-[#b9d5c2] text-[#1f1b18]' : 'bg-white/10 text-white'}`}>
            {matched ? <Check size={34} strokeWidth={2.5} /> : <Send size={30} />}
          </div>
        </div>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-white/42">{matched ? 'accepted' : 'request sent'}</p>
        <h1 className="mt-4 text-center text-[42px] font-semibold leading-[1.02] tracking-[-0.035em]">
          {matched ? '搭成了。' : '已经帮你发过去了。'}
        </h1>
        <p className="mx-auto mt-5 max-w-[19rem] text-center text-sm leading-7 text-white/62">
          {matched ? '正在进入带任务上下文的 match chat。' : `${task.hostAlias} 会先看到你的模糊资料、匹配理由和这次活动。`}
        </p>
        <div className="mt-10 space-y-3 rounded-[30px] border border-white/10 bg-white/8 p-4 backdrop-blur">
          <StatusRow icon={<Clock3 size={15} />} label={matched ? '对方已确认时间' : '等待对方确认'} done={matched} />
          <StatusRow icon={<EyeOff size={15} />} label="真实头像仍然隐藏" done />
          <StatusRow icon={<Check size={15} />} label="自由聊天需要双方同意" done />
        </div>
      </section>
    </main>
  )
}

function StatusRow({ icon, label, done }: { icon: React.ReactNode; label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/72">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${done ? 'bg-white text-[#1f1b18]' : 'bg-white/10 text-white'}`}>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
