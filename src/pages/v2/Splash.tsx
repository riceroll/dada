import { useEffect, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'

const slogans = ['一个人也行，有人一起更好。', '48 小时内，找个现在能见的人。', '把校园里的小事，变成一次刚好的相遇。']

interface SplashProps {
  onContinue: () => void
}

export default function Splash({ onContinue }: SplashProps) {
  const [accepted, setAccepted] = useState(false)
  const [sloganIndex, setSloganIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSloganIndex((index) => (index + 1) % slogans.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] px-6 pb-safe-b pt-safe-t text-[#1f1b18]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-18%] top-12 h-72 w-72 rounded-full bg-[#f2c46d]/35 blur-3xl" />
        <div className="absolute right-[-24%] top-52 h-80 w-80 rounded-full bg-[#adcfb8]/45 blur-3xl" />
        <div className="absolute bottom-[-18%] left-10 h-72 w-72 rounded-full bg-[#df8f83]/30 blur-3xl" />
        <div className="absolute inset-x-5 bottom-44 h-px bg-[#1f1b18]/10" />
        <div className="absolute bottom-44 left-8 h-28 w-px rotate-12 bg-[#1f1b18]/10" />
        <div className="absolute bottom-44 right-16 h-32 w-px -rotate-12 bg-[#1f1b18]/10" />
      </div>

      <section className="relative z-10 flex flex-1 flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.22em] text-[#7a7068]">
          <span>Dada V2</span>
          <span>Campus Beta</span>
        </div>

        <div className="space-y-8">
          <div className="relative mx-auto h-56 w-56">
            <div className="absolute inset-8 animate-[pulse_4s_ease-in-out_infinite] rounded-full bg-[#1f1b18] shadow-[0_30px_90px_rgba(31,27,24,0.24)]" />
            <div className="absolute inset-12 rounded-full bg-[radial-gradient(circle_at_32%_26%,#fff7df_0,#f3c56d_23%,#b9d5c2_47%,#1f1b18_79%)] opacity-95" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-white/10 blur-[1px]" />
            <div className="absolute bottom-10 left-12 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/30 backdrop-blur">
              <Sparkles size={16} />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-medium text-[#7a7068]">搭搭正在读取你的校园雷达</p>
            <h1 className="min-h-[132px] text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-[#1f1b18]">
              {slogans[sloganIndex]}
            </h1>
            <p className="max-w-[18rem] text-[15px] leading-7 text-[#5f5750]">
              不是约会软件，也不是匿名树洞。这里先从一件可以一起做的小事开始。
            </p>
          </div>
        </div>

        <div className="space-y-4 pb-2">
          <button
            type="button"
            onClick={() => setAccepted((value) => !value)}
            className="flex w-full items-start gap-3 rounded-[18px] border border-[#1f1b18]/10 bg-white/55 p-4 text-left shadow-[0_18px_45px_rgba(31,27,24,0.08)] backdrop-blur"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                accepted ? 'border-[#1f1b18] bg-[#1f1b18] text-white' : 'border-[#1f1b18]/25 bg-white/50'
              }`}
            >
              {accepted && <Check size={13} strokeWidth={3} />}
            </span>
            <span className="text-[13px] leading-5 text-[#5f5750]">
              我同意搭搭在匹配前使用模糊身份、活动偏好和校园范围信息来推荐搭子。
            </span>
          </button>

          <button
            type="button"
            disabled={!accepted}
            onClick={onContinue}
            className="h-14 w-full rounded-full bg-[#1f1b18] text-[15px] font-semibold text-white shadow-[0_18px_45px_rgba(31,27,24,0.22)] transition disabled:cursor-not-allowed disabled:bg-[#c8beb5] disabled:shadow-none"
          >
            开始生成我的搭搭雷达
          </button>
        </div>
      </section>
    </main>
  )
}
