import { useEffect } from 'react'
import type { GeneratedProfile } from '../../types/profile'

interface ProfileRevealProps {
  profile: GeneratedProfile | null
  onDone: () => void
}

export default function ProfileReveal({ profile, onDone }: ProfileRevealProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2600)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-[#1f1b18] px-7 py-safe-t text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,246,219,0.28),transparent_34%),radial-gradient(circle_at_22%_78%,rgba(173,207,184,0.22),transparent_28%)]" />
      <div className="relative h-64 w-64 animate-[pulse_3s_ease-in-out_infinite] rounded-full border border-white/15 bg-white/5 shadow-[0_0_120px_rgba(255,246,219,0.22)] backdrop-blur-xl">
        <div className="absolute inset-8 rounded-full bg-[conic-gradient(from_140deg,#f8e5b2,#b9d5c2,#df8f83,#f8e5b2)] opacity-80 blur-sm" />
        <div className="absolute inset-16 rounded-full bg-[#1f1b18]" />
      </div>
      <div className="relative mt-10 space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Profile assembled</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-[-0.02em]">{profile?.headline ?? '你的搭搭雷达已开启'}</h1>
        <p className="mx-auto max-w-[18rem] text-sm leading-6 text-white/62">正在把你的兴趣、时间和校园范围折叠进第一批推荐。</p>
      </div>
    </main>
  )
}
