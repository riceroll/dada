import type { Task } from '../types'
import { kindMeta } from '../data'
import { TaskIcon } from './IconKit'

function mapTimeBadge(task: Task) {
  if (task.whenLabel === '现在') {
    return {
      text: `剩 ${task.durationMin} 分钟`,
      className: 'text-brand bg-white border-brand/20',
    }
  }

  return {
    text: task.whenLabel.replace(/^今天\s*/, '') + ' 开始',
    className: 'text-task-skill bg-white border-task-skill/20',
  }
}

// 浅暖色地图皮肤 + 平滑地图 pin（统一 icon）
export default function MapView({
  tasks,
  onPick,
}: {
  tasks: Task[]
  onPick: (t: Task) => void
}) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FBEFE2]">
      {/* 暖色地块 */}
      <div className="absolute inset-0">
        <div className="absolute -left-10 top-10 w-56 h-56 rounded-[40px] bg-[#F4E2CE] rotate-12" />
        <div className="absolute right-0 top-24 w-48 h-64 rounded-[40px] bg-[#EFE6D6] -rotate-6" />
        <div className="absolute left-8 bottom-8 w-64 h-44 rounded-[40px] bg-[#E9EDDD]" />
        <div className="absolute right-6 bottom-16 w-40 h-40 rounded-[40px] bg-[#F4E2CE] rotate-6" />
        {/* 道路 */}
        <div className="absolute left-0 right-0 top-1/2 h-5 bg-white/70 -rotate-3" />
        <div className="absolute top-0 bottom-0 left-1/2 w-5 bg-white/70 rotate-2" />
        <div className="absolute left-0 right-0 top-[28%] h-3 bg-white/50 rotate-6" />
      </div>

      {/* 绿地点缀 */}
      <div className="absolute left-1/4 top-[20%] text-2xl opacity-70">🌳</div>
      <div className="absolute right-1/4 bottom-[28%] text-2xl opacity-70">🌳</div>
      <div className="absolute left-[58%] top-[52%] text-xl opacity-70">🏫</div>

      {/* 任务气泡 */}
      {tasks.map((t) => {
        const meta = kindMeta[t.kind]
        const timeBadge = mapTimeBadge(t)
        return (
          <button
            key={t.id}
            onClick={() => onPick(t)}
            className="absolute -translate-x-1/2 -translate-y-[64px] active:scale-95 transition-transform"
            style={{ left: `${t.mapX}%`, top: `${t.mapY}%` }}
          >
            <div className="relative w-[82px] h-[86px] drop-shadow-[0_10px_18px_rgba(73,45,20,0.18)]">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[54px] h-[64px]">
                <svg viewBox="0 0 54 64" className="absolute inset-0 w-full h-full" aria-hidden="true">
                  <path
                    d="M27 4C15.2 4 6.5 12.5 6.5 24.2c0 15.7 20.5 35.3 20.5 35.3s20.5-19.6 20.5-35.3C47.5 12.5 38.8 4 27 4Z"
                    fill="white"
                    stroke={meta.color}
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="absolute left-1/2 top-[24px] -translate-x-1/2 -translate-y-1/2 scale-[0.68]">
                  <TaskIcon task={t} size="md" />
                </div>
                {/* 人数小角标 */}
                <span
                  className="absolute top-0 right-0 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold text-white grid place-items-center ring-2 ring-white"
                  style={{ backgroundColor: meta.color }}
                >
                  {t.joined}/{t.expected}
                </span>
              </div>
              <span
                className={`absolute left-1/2 top-[62px] -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-bold shadow-soft ${timeBadge.className}`}
              >
                {timeBadge.text}
              </span>
            </div>
          </button>
        )
      })}

      {/* 我的位置 */}
      <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
        <span className="block w-5 h-5 rounded-full bg-brand ring-4 ring-brand/30" />
      </div>
    </div>
  )
}
