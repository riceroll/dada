import { useState } from 'react'
import { ArrowLeft, ChevronRight, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { buddies, me } from '../../data'
import { TaskIcon, UserAvatar } from '../../components/IconKit'

const skillTags = [
  { label: '网球', level: '3.5' },
  { label: '咖啡', level: '手冲爱好者' },
  { label: '摄影', level: '待补全' },
  { label: '吉他', level: '待补全' },
]

export default function ProfileV2({ onBack, onOpenBuddy }: { onBack: () => void; onOpenBuddy: () => void }) {
  const [hidden, setHidden] = useState(me.avatarHidden)

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-5 pt-safe-t">
        <button type="button" onClick={onBack} className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70">
          <ArrowLeft size={18} />
        </button>
        <div className="rounded-[34px] bg-[#1f1b18] p-5 text-white shadow-[0_24px_70px_rgba(31,27,24,0.2)]">
          <div className="flex items-center gap-4">
            <UserAvatar user={me} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">My radar card</p>
              <h1 className="mt-1 text-3xl font-semibold">{me.name === '你' ? '我的资料' : me.name}</h1>
              <p className="mt-1 text-sm text-white/58">{me.grade} · {me.college}</p>
            </div>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-white/78">{me.bio}</p>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
        <div className="space-y-3 pb-4">
          <Card title="见面前隐藏头像" icon={<LockKeyhole size={16} />}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm leading-6 text-[#5f5750]">别人搭成之前只看到抽象头像、标签和匹配原因。</p>
              <button
                type="button"
                onClick={() => setHidden((value) => !value)}
                className={`relative h-8 w-14 shrink-0 rounded-full transition ${hidden ? 'bg-[#1f1b18]' : 'bg-[#d8cec3]'}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${hidden ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </Card>

          <Card title="兴趣和技能" icon={<Sparkles size={16} />}>
            <div className="flex flex-wrap gap-2">
              {skillTags.map((tag) => (
                <span key={tag.label} className="rounded-full border border-[#1f1b18]/10 bg-[#f7f2eb] px-3 py-2 text-xs font-semibold text-[#514941]">
                  {tag.label} · {tag.level}
                </span>
              ))}
            </div>
          </Card>

          <Card title={`一起做过的事 · ${buddies.length}`} icon={<ShieldCheck size={16} />}>
            <button type="button" onClick={onOpenBuddy} className="w-full space-y-3 text-left">
              {buddies.slice(0, 3).map((buddy) => (
                <div key={buddy.user.id} className="flex items-center gap-3">
                  <TaskIcon task={{ emoji: buddy.taskEmoji, title: buddy.taskTitle, kind: 'random' }} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{buddy.taskTitle}</p>
                    <p className="text-[11px] text-[#8a7e74]">和 {buddy.user.avatarHidden ? `${buddy.user.grade}同学` : buddy.user.name} · {buddy.metAtLabel}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1 pt-1 text-xs font-semibold text-[#1f1b18]">
                查看全部关系
                <ChevronRight size={13} />
              </div>
            </button>
          </Card>
        </div>
      </section>
    </main>
  )
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="rounded-[28px] border border-[#1f1b18]/10 bg-white/74 p-4 shadow-[0_18px_45px_rgba(31,27,24,0.07)]">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#3a332e]">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </article>
  )
}
