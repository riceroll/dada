import { buddies, me } from '../data'
import { TaskIcon, UserAvatar } from '../components/IconKit'

export default function Buddies({
  onChat,
  onGoHome,
  onOpenProfile,
}: {
  onChat: () => void
  onGoHome: () => void
  onOpenProfile: () => void
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="px-5 pt-safe-t pb-3 bg-cream/80 backdrop-blur">
        <h1 className="text-lg font-extrabold text-ink">我的搭子</h1>
        <p className="text-xs text-mute mt-0.5">
          一起搭过 {buddies.length} 次 · 每个人都有故事
        </p>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
        {/* 我的小卡 */}
        <button
          onClick={onOpenProfile}
          className="w-full text-left bg-gradient-to-br from-brand-light to-brand rounded-card p-4 text-white shadow-float mb-4 mt-1 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <UserAvatar user={me} size="md" />
            <div className="flex-1">
              <div className="font-bold">{me.name === '你' ? '我' : me.name}</div>
              <div className="text-xs text-white/80">
                {me.grade} · {me.college} · 信用 {me.credit}
              </div>
            </div>
            <span className="text-white/70 text-sm">我的主页 ›</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {me.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-white/20">
                {t}
              </span>
            ))}
          </div>
        </button>

        <p className="text-xs text-mute px-1 mb-2">搭过的人</p>
        <div className="space-y-3">
          {buddies.map((b) => (
            <div
              key={b.user.id}
              className="bg-white rounded-card shadow-soft p-4 animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <UserAvatar user={b.user} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink">
                    {b.user.avatarHidden ? b.user.grade + '同学' : b.user.name}
                  </div>
                  <div className="text-xs text-mute">
                    {b.user.gender} · {b.user.college}
                  </div>
                </div>
                <span className="text-[11px] text-mute shrink-0">{b.metAtLabel}</span>
              </div>

              {/* 一起做过什么（关系上下文） */}
              <div className="mt-3 bg-cream rounded-field px-3 py-2 flex items-center gap-2">
                <TaskIcon task={{ emoji: b.taskEmoji, title: b.taskTitle, kind: 'random' }} size="sm" />
                <span className="text-xs text-ink/70">
                  一起 <b className="text-ink">{b.taskTitle}</b>
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={onChat}
                  className="flex-1 bg-cream text-ink font-medium text-sm py-2 rounded-full active:scale-95 transition-transform"
                >
                  聊聊
                </button>
                <button
                  onClick={onGoHome}
                  className="flex-1 bg-brand text-white font-bold text-sm py-2 rounded-full shadow-soft active:animate-pop"
                >
                  再约一次
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
