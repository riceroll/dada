import { useState } from 'react'
import { me, buddies } from '../data'
import DadaMascot from '../components/DadaMascot'
import { TaskIcon, UserAvatar } from '../components/IconKit'

// AI 逐渐完善的 profile：有些标签带「水平」，有些还是空的等哒哒去问
interface SkillTag {
  label: string
  level?: string // 已知水平
  pending?: boolean // 等待 just-in-time 补全
}

const skillTags: SkillTag[] = [
  { label: '网球', level: '3.5' },
  { label: '咖啡', level: '手冲爱好者' },
  { label: '摄影', pending: true },
  { label: '吉他', pending: true },
]

export default function Profile({
  onBack,
  onOpenBuddy,
}: {
  onBack: () => void
  onOpenBuddy: () => void
}) {
  const [hidden, setHidden] = useState(me.avatarHidden)

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-cream">
      {/* 头图 */}
      <div className="relative pt-safe-t pb-5 px-5 bg-gradient-to-br from-brand-light to-brand text-white">
        <button onClick={onBack} className="text-white text-xl mb-3 w-8">
          ←
        </button>
        <div className="flex items-center gap-4">
          <UserAvatar user={me} size="lg" />
          <div>
            <h1 className="text-2xl font-extrabold">{me.name === '你' ? '我' : me.name}</h1>
            <p className="text-sm text-white/85 mt-0.5">
              {me.gender} · {me.grade} · {me.college}
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-xs">
              ⭐ 信用分 {me.credit}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 pb-24">
        {/* 自我介绍 */}
        <Section title="自我介绍">
          <p className="text-[15px] text-ink leading-relaxed">{me.bio}</p>
        </Section>

        {/* 头像隐私开关 */}
        <Section title="见面前隐藏头像">
          <div className="flex items-center justify-between">
            <p className="text-sm text-mute flex-1 pr-3">
              开启后，别人在搭成之前只看到模糊头像和标签，碰头时才揭晓
            </p>
            <button
              onClick={() => setHidden((h) => !h)}
              className={`w-12 h-7 rounded-full transition-colors shrink-0 relative ${
                hidden ? 'bg-brand' : 'bg-mute/30'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  hidden ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </Section>

        {/* AI 逐渐完善的兴趣/技能 */}
        <Section title="兴趣 · 技能">
          <div className="flex items-center gap-2 mb-3 bg-brand-soft/40 rounded-field px-3 py-2">
            <DadaMascot size={24} />
            <p className="text-xs text-ink/70">
              你每搭一次，哒哒都会更懂你。带 <span className="text-brand font-medium">？</span> 的等下次相关活动时补全
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillTags.map((t) => (
              <span
                key={t.label}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  t.pending
                    ? 'bg-cream text-mute border border-dashed border-mute/40'
                    : 'bg-brand-soft text-brand'
                }`}
              >
                {t.label}
                {t.level && <span className="ml-1 opacity-80">· {t.level}</span>}
                {t.pending && <span className="ml-1 text-brand">？</span>}
              </span>
            ))}
          </div>
        </Section>

        {/* 历史活动 */}
        <Section title={`搭过的活动 · ${buddies.length}`}>
          <button onClick={onOpenBuddy} className="w-full space-y-2.5 text-left">
            {buddies.map((b) => (
              <div key={b.user.id} className="flex items-center gap-3">
                <TaskIcon task={{ emoji: b.taskEmoji, title: b.taskTitle, kind: 'random' }} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink truncate">一起{b.taskTitle}</div>
                  <div className="text-[11px] text-mute">
                    和 {b.user.avatarHidden ? b.user.grade + '同学' : b.user.name} · {b.metAtLabel}
                  </div>
                </div>
              </div>
            ))}
            <div className="text-xs text-brand font-medium pt-1">查看全部搭子 →</div>
          </button>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-card shadow-soft p-4">
      <h2 className="text-xs font-bold text-mute mb-2.5">{title}</h2>
      {children}
    </div>
  )
}
