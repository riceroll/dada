import { ArrowUpRight, Repeat2, ShieldCheck } from 'lucide-react'
import { buddies, me } from '../../data'
import { TaskIcon, UserAvatar } from '../../components/IconKit'

export default function BuddiesV2({
  onChat,
  onGoHome,
  onOpenProfile,
}: {
  onChat: () => void
  onGoHome: () => void
  onOpenProfile: () => void
}) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-5 pt-safe-t">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">People you met</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-[1.04] tracking-[-0.03em]">关系不是列表，是一起做过的事。</h1>
      </header>
      <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
        <button
          type="button"
          onClick={onOpenProfile}
          className="mb-4 w-full rounded-[32px] bg-[#1f1b18] p-5 text-left text-white shadow-[0_24px_70px_rgba(31,27,24,0.18)]"
        >
          <div className="flex items-center gap-3">
            <UserAvatar user={me} size="md" />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold">我的搭搭资料</h2>
              <p className="mt-1 text-sm text-white/58">{me.grade} · {me.college} · 信用 {me.credit}</p>
            </div>
            <ArrowUpRight size={18} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {me.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/72">
                {tag}
              </span>
            ))}
          </div>
        </button>

        <div className="space-y-3 pb-4">
          {buddies.map((buddy) => (
            <article key={buddy.user.id} className="rounded-[30px] border border-[#1f1b18]/10 bg-white/74 p-4 shadow-[0_18px_45px_rgba(31,27,24,0.07)]">
              <div className="flex items-center gap-3">
                <UserAvatar user={buddy.user} size="md" />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold">{buddy.user.avatarHidden ? `${buddy.user.grade}同学` : buddy.user.name}</h2>
                  <p className="truncate text-sm text-[#6f655d]">{buddy.user.college} · {buddy.metAtLabel}</p>
                </div>
                <ShieldCheck size={18} className="text-[#8a7e74]" />
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f7f2eb] px-3 py-3">
                <TaskIcon task={{ emoji: buddy.taskEmoji, title: buddy.taskTitle, kind: 'random' }} size="sm" />
                <p className="min-w-0 flex-1 truncate text-sm text-[#5f5750]">一起 {buddy.taskTitle}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={onChat} className="h-11 rounded-full border border-[#1f1b18]/10 bg-white text-sm font-semibold text-[#1f1b18]">
                  聊聊
                </button>
                <button type="button" onClick={onGoHome} className="flex h-11 items-center justify-center gap-1 rounded-full bg-[#1f1b18] text-sm font-semibold text-white">
                  <Repeat2 size={15} />
                  再约一次
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
