import { Check, MapPin, Navigation, ShieldCheck } from 'lucide-react'
import type { ActivityTaskV2 } from '../../types/profile'

interface MeetingV2Props {
  task: ActivityTaskV2
  onFinish: () => void
}

export default function MeetingV2({ task, onFinish }: MeetingV2Props) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-4 pt-safe-t">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Before meeting</p>
        <h1 className="mt-3 text-[39px] font-semibold leading-[1.02] tracking-[-0.035em]">见面前最后十分钟。</h1>
      </header>
      <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
        <div className="relative mb-4 h-[330px] overflow-hidden rounded-[34px] border border-[#1f1b18]/10 bg-[#e9dfd2] shadow-[0_26px_70px_rgba(31,27,24,0.12)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_45%,rgba(255,255,255,0.8),transparent_22%),radial-gradient(circle_at_70%_70%,rgba(185,213,194,0.52),transparent_30%)]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 330" aria-hidden="true">
            <path d="M34 256 C110 194 184 226 286 168" fill="none" stroke="#fffaf1" strokeWidth="22" strokeLinecap="round" />
            <path d="M110 -20 C142 86 132 204 92 355" fill="none" stroke="#fffaf1" strokeWidth="18" strokeLinecap="round" />
            <path d="M214 -10 C196 112 222 204 282 350" fill="none" stroke="#1f1b18" strokeOpacity="0.08" strokeWidth="34" strokeLinecap="round" />
          </svg>
          <div className="absolute left-[42%] top-[54%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#1f1b18] p-2 shadow-[0_20px_50px_rgba(31,27,24,0.24)]">
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_32%_24%,#fff7df,#b9d5c2_48%,#df8f83_88%)]" />
          </div>
          <div className="absolute left-[66%] top-[38%] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1f1b18]/10 bg-white/80 p-1.5 shadow-[0_16px_35px_rgba(31,27,24,0.16)]">
            <div className="h-full w-full rounded-full bg-[#1f1b18]/70" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-[#1f1b18]/10 bg-white/78 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7e74]">
              <MapPin size={13} />
              <span>Confirmed area</span>
            </div>
            <h2 className="text-lg font-semibold">{task.place}</h2>
            <p className="mt-1 text-sm text-[#6f655d]">精确位置只在这次活动中显示。</p>
          </div>
        </div>

        <div className="space-y-3">
          <Status icon={<Navigation size={16} />} title="双方都在路上" desc={`${task.hostAlias} 距离约 180m，预计 4 分钟。`} />
          <Status icon={<ShieldCheck size={16} />} title="隐私仍然开启" desc="活动结束前不会自动沉淀完整资料。" />
          <Status icon={<Check size={16} />} title="结束后进入关系卡" desc="完成后会把这次活动保存在关系页。" />
        </div>
      </section>
      <footer className="border-t border-[#1f1b18]/8 bg-white/76 px-5 pb-safe-b pt-3 backdrop-blur-xl">
        <button type="button" onClick={onFinish} className="h-14 w-full rounded-full bg-[#1f1b18] text-[15px] font-semibold text-white shadow-[0_18px_45px_rgba(31,27,24,0.2)]">
          完成活动，存入关系
        </button>
      </footer>
    </main>
  )
}

function Status({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <article className="flex gap-3 rounded-[24px] border border-[#1f1b18]/10 bg-white/74 p-4 shadow-[0_18px_45px_rgba(31,27,24,0.06)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f1b18] text-white">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#6f655d]">{desc}</p>
      </div>
    </article>
  )
}
