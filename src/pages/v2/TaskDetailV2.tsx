import { useEffect, useState } from 'react'
import { ArrowLeft, Clock3, LockKeyhole, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react'
import type { ActivityTaskV2 } from '../../types/profile'

interface TaskDetailV2Props {
  task: ActivityTaskV2
  onBack: () => void
  onRequest: () => void
}

export default function TaskDetailV2({ task, onBack, onRequest }: TaskDetailV2Props) {
  const countdown = useCountdown(task.expiresInSec)

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <section className="signal-field shrink-0 px-4 pb-5 pt-safe-t text-white">
        <div className="signal-vignette absolute inset-0" />
        <div className="relative z-10">
        <button type="button" onClick={onBack} className="mb-7 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/10 backdrop-blur-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="max-w-[21rem]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Activity request</p>
          <h1 className="mt-3 text-[35px] font-semibold leading-[1.02] tracking-[-0.035em]">{task.title}</h1>
          <p className="mt-4 text-[14px] leading-6 text-white/64">{task.compatibilityReason}</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-white/12 pt-4">
          <Metric icon={<Clock3 size={15} />} label="开始" value={task.startsAtLabel} />
          <Metric icon={<Users size={15} />} label="人数" value={`${task.currentGroupSize}/${task.desiredGroupSize}`} />
          <Metric icon={<MapPin size={15} />} label="区域" value={task.fuzzyArea} />
          <Metric icon={<Sparkles size={15} />} label="发起人" value={task.hostAlias} />
        </div>
        <div className="mt-5 inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/78 backdrop-blur-xl">
          {countdown}
        </div>
        </div>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        <div className="space-y-0 pb-4">
          <section className="border-b border-[#1f1b18]/10 py-4">
            <div className="flex items-center gap-3">
              <BlurredHostPhoto src={task.hostPhotoUrl} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles size={16} />
                  <span>{task.hostAlias}</span>
                </div>
                <p className="text-[13px] leading-5 text-[#5f5750]">
                  {task.hostMatchReason ?? 'TA 和你的活动偏好、时间窗口或校园范围有明显重叠。'}
                </p>
              </div>
            </div>
          </section>

          <section className="border-b border-[#1f1b18]/10 py-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={16} />
              <span>你发出请求后，对方先看到这些</span>
            </div>
            <div className="space-y-3 text-[13px] leading-5 text-[#5f5750]">
              <InfoLine text="你的抽象头像、年级和少量匹配标签。" />
              <InfoLine text="你为什么适合这个活动的一句话说明。" />
              <InfoLine text="不会直接显示真实头像、完整资料或精确位置。" />
            </div>
          </section>

          <section className="py-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <LockKeyhole size={16} />
              <span>加入前的小约定</span>
            </div>
            <p className="text-[13px] leading-6 text-[#5f5750]">这不是开放聊天邀请。对方确认后，你们会先进入带倒计时的 match chat，头像、位置、自由聊天都可以单独请求。</p>
          </section>
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

function useCountdown(initialSeconds?: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds ?? 48 * 60 * 60)

  useEffect(() => {
    setSecondsLeft(initialSeconds ?? 48 * 60 * 60)
  }, [initialSeconds])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  if (hours >= 1) return `${hours}h ${String(minutes).padStart(2, '0')}m 后消失`
  return `${minutes}:${String(seconds).padStart(2, '0')} 后消失`
}

function BlurredHostPhoto({ src }: { src?: string }) {
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[22px] bg-[#1f1b18]/10 shadow-[0_12px_30px_rgba(31,27,24,0.1)]">
      {src ? (
        <img src={src} alt="模糊的发起人头像" className="h-full w-full scale-110 object-cover blur-[4px] saturate-[0.86]" />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_35%_25%,#fff7df,#b9d5c2_48%,#1f1b18_88%)] blur-[3px]" />
      )}
      <div className="absolute inset-0 bg-[#1f1b18]/12" />
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/42">
        {icon}
        <span>{label}</span>
      </div>
      <p className="truncate text-[13px] font-semibold text-white/88">{value}</p>
    </div>
  )
}

function InfoLine({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f1b18]/35" />
      <p>{text}</p>
    </div>
  )
}
