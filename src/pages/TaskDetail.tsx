import { useState } from 'react'
import type { Task } from '../types'
import { kindMeta } from '../data'
import DadaMascot from '../components/DadaMascot'
import { InfoGlyph, TaskIcon, UserAvatar } from '../components/IconKit'

function dist(m: number) {
  return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`
}

export default function TaskDetail({
  task,
  onBack,
  onAccepted,
}: {
  task: Task
  onBack: () => void
  onAccepted: (t: Task) => void
}) {
  const meta = kindMeta[task.kind]
  // just-in-time profile：补位/技能类任务有门槛时，接受前哒哒问一句
  const needProfile =
    (task.kind === 'fill' || task.kind === 'skill') && !!task.threshold
  const [askProfile, setAskProfile] = useState(false)
  const [waitToast, setWaitToast] = useState(false)

  function handleAccept() {
    if (needProfile) setAskProfile(true)
    else onAccepted(task)
  }

  return (
    <div className="flex-1 flex flex-col bg-cream overflow-hidden">
      {/* 顶部图头 */}
      <div
        className="relative pt-safe-t pb-6 px-5"
        style={{ background: `linear-gradient(160deg, ${meta.color}22, #FFF9F3)` }}
      >
        <button onClick={onBack} className="text-ink text-xl mb-4 w-8">
          ←
        </button>
        <div className="flex items-center gap-4">
          <TaskIcon task={task} size="lg" />
          <div>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${meta.chip}`}
            >
              {meta.label}
            </span>
            <h1 className="text-xl font-extrabold text-ink mt-1">{task.title}</h1>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
        {task.desc && (
          <p className="text-[15px] text-ink leading-relaxed bg-white rounded-card p-4 shadow-soft">
            {task.desc}
          </p>
        )}

        {/* 信息行 */}
        <div className="grid grid-cols-2 gap-3">
          <Info icon={<InfoGlyph name="time" />} label="时间" value={task.whenLabel} />
          <Info icon={<InfoGlyph name="duration" />} label="预计" value={`${task.durationMin} 分钟`} />
          <Info icon={<InfoGlyph name="place" />} label="地点" value={task.place} />
          <Info icon={<InfoGlyph name="distance" />} label="距离" value={dist(task.distanceM)} />
          <Info
            icon={<InfoGlyph name="people" />}
            label="人数"
            value={`${task.joined}/${task.expected} 人`}
          />
          {task.threshold && <Info icon={<InfoGlyph name="target" />} label="门槛" value={task.threshold} />}
        </div>

        {/* 发起人（见面前隐藏头像） */}
        <div className="bg-white rounded-card p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserAvatar user={task.host} size="lg" />
              {task.host.avatarHidden && (
                <span className="absolute -bottom-1 -right-1 text-[10px] bg-ink/80 text-white px-1.5 py-0.5 rounded-full">
                  见面揭晓
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold text-ink">
                {task.host.avatarHidden ? '一位' + task.host.grade + '同学' : task.host.name}
              </div>
              <div className="text-xs text-mute">
                {task.host.gender} · {task.host.college} · 信用 {task.host.credit}
              </div>
            </div>
          </div>
          <p className="text-sm text-ink/80 mt-3">{task.host.bio}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {task.host.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[11px] bg-cream text-mute"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="px-5 pb-safe-b pt-3 bg-white shadow-[0_-8px_24px_rgba(255,138,61,0.08)] flex gap-3">
        <button
          onClick={() => {
            setWaitToast(true)
            setTimeout(() => {
              setWaitToast(false)
              onBack()
            }, 1100)
          }}
          className="flex-1 bg-cream text-ink font-bold py-3.5 rounded-full active:scale-95 transition-transform"
        >
          等一会儿
        </button>
        <button
          onClick={handleAccept}
          className="flex-[1.6] bg-brand text-white font-bold py-3.5 rounded-full shadow-float active:animate-pop"
        >
          我去！
        </button>
      </div>

      {/* 等一会儿 toast */}
      {waitToast && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/20 animate-fade-in">
          <div className="bg-white rounded-card px-6 py-5 shadow-float text-center">
            <div className="mx-auto mb-2 w-12 h-12 rounded-2xl bg-brand-soft grid place-items-center">
              <InfoGlyph name="wait" />
            </div>
            <p className="font-bold text-ink">放进「等一会儿」啦</p>
            <p className="text-xs text-mute mt-1">想好了在列表里点接受，有倒计时哦</p>
          </div>
        </div>
      )}

      {/* just-in-time profile 弹层 */}
      {askProfile && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/30 animate-fade-in">
          <div className="w-full bg-white rounded-t-[28px] p-5 pb-safe-b animate-slide-up">
            <div className="flex items-start gap-3">
              <DadaMascot size={36} />
              <div className="flex-1">
                <p className="text-sm text-ink leading-relaxed">
                  对方在找「{task.threshold}」的搭子～ 你 profile 里有这项但没写水平，
                  <span className="font-semibold">可以透露一下嘛？</span>会更容易约成。
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {['我 3.0+，没问题', '休闲水平，试试看', '先不填，直接报名'].map(
                (label) => (
                  <button
                    key={label}
                    onClick={() => onAccepted(task)}
                    className="w-full bg-cream text-ink font-medium py-3 rounded-field active:scale-[0.98] transition-transform"
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-white rounded-card p-3 shadow-soft">
      <div className="text-xs text-mute">
        <span className="inline-flex items-center gap-1.5">{icon}{label}</span>
      </div>
      <div className="text-sm font-semibold text-ink mt-1 truncate">{value}</div>
    </div>
  )
}
