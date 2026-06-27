import { ArrowLeft, Clock3, LockKeyhole, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react'
import type { ActivityTaskV2 } from '../../types/profile'

interface TaskDetailV2Props {
  task: ActivityTaskV2
  onBack: () => void
  onRequest: () => void
}

export default function TaskDetailV2({ task, onBack, onRequest }: TaskDetailV2Props) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-4 pt-safe-t">
        <button type="button" onClick={onBack} className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Activity request</p>
        <h1 className="mt-3 text-[39px] font-semibold leading-[1.02] tracking-[-0.035em]">{task.title}</h1>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
        <div className="space-y-3 pb-4">
          <article className="overflow-hidden rounded-[34px] bg-[#1f1b18] p-5 text-white shadow-[0_24px_70px_rgba(31,27,24,0.2)]">
            <div className="relative mb-6 h-44 rounded-[28px] bg-[radial-gradient(circle_at_22%_22%,#fff7df,transparent_24%),radial-gradient(circle_at_74%_60%,#b9d5c2,transparent_30%),linear-gradient(135deg,#3a332e,#1f1b18)]">
              <div className="absolute left-5 top-5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold backdrop-blur">{task.expiresAtLabel}</div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Why this appeared</p>
                <p className="mt-2 text-sm leading-6 text-white/78">{task.compatibilityReason}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Metric icon={<Clock3 size={15} />} label="开始" value={task.startsAtLabel} dark />
              <Metric icon={<Users size={15} />} label="人数" value={`${task.currentGroupSize}/${task.desiredGroupSize}`} dark />
              <Metric icon={<MapPin size={15} />} label="区域" value={task.fuzzyArea} dark />
              <Metric icon={<Sparkles size={15} />} label="发起人" value={task.hostAlias} dark />
            </div>
          </article>

          <article className="rounded-[30px] border border-[#1f1b18]/10 bg-white/74 p-4 shadow-[0_18px_45px_rgba(31,27,24,0.07)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={16} />
              <span>你发出请求后，对方先看到这些</span>
            </div>
            <div className="space-y-2 text-sm leading-6 text-[#5f5750]">
              <p>你的抽象头像、年级和少量匹配标签。</p>
              <p>你为什么适合这个活动的一句话说明。</p>
              <p>不会直接显示真实头像、完整资料或精确位置。</p>
            </div>
          </article>

          <article className="rounded-[30px] border border-[#1f1b18]/10 bg-white/74 p-4 shadow-[0_18px_45px_rgba(31,27,24,0.07)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <LockKeyhole size={16} />
              <span>加入前的小约定</span>
            </div>
            <p className="text-sm leading-6 text-[#5f5750]">这不是开放聊天邀请。对方确认后，你们会先进入带倒计时的 match chat，头像、位置、自由聊天都可以单独请求。</p>
          </article>
        </div>
      </section>

      <footer className="border-t border-[#1f1b18]/8 bg-white/76 px-5 pb-safe-b pt-3 backdrop-blur-xl">
        <button type="button" onClick={onRequest} className="h-14 w-full rounded-full bg-[#1f1b18] text-[15px] font-semibold text-white shadow-[0_18px_45px_rgba(31,27,24,0.2)]">
          发出加入请求
        </button>
      </footer>
    </main>
  )
}

function Metric({ icon, label, value, dark = false }: { icon: React.ReactNode; label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 ${dark ? 'bg-white/10 text-white' : 'bg-[#f7f2eb] text-[#1f1b18]'}`}>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] opacity-55">
        {icon}
        <span>{label}</span>
      </div>
      <p className="truncate font-semibold">{value}</p>
    </div>
  )
}
