import type { Task } from '../types'
import { kindMeta } from '../data'
import { InfoGlyph, TaskIcon, UserAvatar } from './IconKit'

function dist(m: number) {
  return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`
}

export default function TaskCard({
  task,
  onClick,
}: {
  task: Task
  onClick?: () => void
}) {
  const meta = kindMeta[task.kind]
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-card shadow-soft p-4 flex gap-3 active:scale-[0.98] transition-transform animate-slide-up"
    >
      {/* 左侧色条 */}
      <span
        className="w-1.5 self-stretch rounded-full shrink-0"
        style={{ backgroundColor: meta.color }}
      />
      <TaskIcon task={task} size="md" className="shrink-0" />
      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-ink truncate">{task.title}</h3>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-mute">
          <span className="inline-flex items-center gap-1">
            <UserAvatar user={task.host} size="sm" />
            {task.host.avatarHidden ? task.host.grade + '同学' : task.host.name}
          </span>
          <span>·</span>
          <span>{task.host.grade}</span>
          <span>·</span>
          <span>{task.place}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${meta.chip}`}
          >
            {meta.label}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-cream text-mute">
            <InfoGlyph name="time">{task.whenLabel}</InfoGlyph>
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-cream text-mute">
            <InfoGlyph name="place">{dist(task.distanceM)}</InfoGlyph>
          </span>
          {task.threshold && (
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-cream text-mute">
              <InfoGlyph name="target">{task.threshold}</InfoGlyph>
            </span>
          )}
        </div>
      </div>
      {/* 人数 */}
      <div className="shrink-0 self-center text-center">
        <div className="text-sm font-bold text-ink">
          {task.joined}
          <span className="text-mute">/{task.expected}</span>
        </div>
        <div className="text-[10px] text-mute">人</div>
      </div>
    </button>
  )
}
