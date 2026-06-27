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
      <header className="px-4 pb-3 pt-safe-t">
        <button type="button" onClick={onBack} className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70">
          <ArrowLeft size={18} />
        </button>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Activity request</p>
        <h1 className="mt-2 text-[31px] font-semibold leading-[1.04] tracking-[-0.03em]">{task.title}</h1>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        <div className="space-y-2.5 pb-4">
          <article className="overflow-hidden rounded-[26px] bg-[#1f1b18] p-4 text-white shadow-[0_18px_54px_rgba(31,27,24,0.18)]">
            <div className="relative mb-4 h-36 overflow-hidden rounded-[22px] bg-[#15120f]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#16120f_0%,#28231f_54%,#14110f_100%)]" />
              <div className="absolute -left-10 -top-12 h-44 w-44 rounded-full bg-[#f4d47f]/24 blur-3xl" />
              <div className="absolute -right-12 top-8 h-48 w-48 rounded-full bg-[#9fc7ae]/22 blur-3xl" />
              <div className="absolute bottom-[-72px] left-16 h-44 w-44 rounded-full bg-[#d77b6f]/16 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:18px_18px]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_36%,transparent_52%)]" />
              <div className="absolute left-4 top-4 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">{task.expiresAtLabel}</div>
              <div className="absolute bottom-4 left-4 right-4 rounded-[18px] border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Why this appeared</p>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-white/78">{task.compatibilityReason}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <Metric icon={<Clock3 size={15} />} label="开始" value={task.startsAtLabel} dark />
              <Metric icon={<Users size={15} />} label="人数" value={`${task.currentGroupSize}/${task.desiredGroupSize}`} dark />
              <Metric icon={<MapPin size={15} />} label="区域" value={task.fuzzyArea} dark />
              <Metric icon={<Sparkles size={15} />} label="发起人" value={task.hostAlias} dark />
            </div>
          </article>

          <article className="rounded-[22px] border border-[#1f1b18]/10 bg-white/74 p-3.5 shadow-[0_14px_34px_rgba(31,27,24,0.06)]">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={16} />
              <span>你发出请求后，对方先看到这些</span>
            </div>
            <div className="space-y-1.5 text-[13px] leading-5 text-[#5f5750]">
              <p>你的抽象头像、年级和少量匹配标签。</p>
              <p>你为什么适合这个活动的一句话说明。</p>
              <p>不会直接显示真实头像、完整资料或精确位置。</p>
            </div>
          </article>

          <article className="rounded-[22px] border border-[#1f1b18]/10 bg-white/74 p-3.5 shadow-[0_14px_34px_rgba(31,27,24,0.06)]">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
              <LockKeyhole size={16} />
              <span>加入前的小约定</span>
            </div>
            <p className="text-[13px] leading-5 text-[#5f5750]">这不是开放聊天邀请。对方确认后，你们会先进入带倒计时的 match chat，头像、位置、自由聊天都可以单独请求。</p>
          </article>
        </div>
      </section>

      <footer className="border-t border-[#1f1b18]/8 bg-white/76 px-4 pb-safe-b pt-3 backdrop-blur-xl">
        <button type="button" onClick={onRequest} className="h-14 w-full rounded-full bg-[#1f1b18] text-[15px] font-semibold text-white shadow-[0_18px_45px_rgba(31,27,24,0.2)]">
          发出加入请求
        </button>
      </footer>
    </main>
  )
}

function Metric({ icon, label, value, dark = false }: { icon: React.ReactNode; label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-[16px] p-2.5 ${dark ? 'bg-white/10 text-white' : 'bg-[#f7f2eb] text-[#1f1b18]'}`}>
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-55">
        {icon}
        <span>{label}</span>
      </div>
      <p className="truncate font-semibold">{value}</p>
    </div>
  )
}
