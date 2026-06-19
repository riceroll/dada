import { useState } from 'react'
import type { Task } from '../types'
import { tasks as allTasks, me } from '../data'
import MapView from '../components/MapView'
import TaskCard from '../components/TaskCard'
import { UserAvatar } from '../components/IconKit'

type View = 'map' | 'list'

export default function Home({
  onOpenTask,
  onPost,
  onOpenProfile,
}: {
  onOpenTask: (t: Task) => void
  onPost: () => void
  onOpenProfile: () => void
}) {
  const [view, setView] = useState<View>('map')
  const [campus, setCampus] = useState('同济 · 四平路')

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      {/* 顶部 */}
      <header className="px-4 pt-[max(2.25rem,env(safe-area-inset-top,0px))] pb-2.5 flex items-center justify-between gap-2 bg-cream/80 backdrop-blur z-20">
        <button className="min-w-0 flex-1 flex items-center gap-1.5 text-left">
          <span className="shrink-0 text-lg font-extrabold text-ink whitespace-nowrap">搭搭</span>
          <span className="min-w-0 truncate text-[13px] text-mute">{campus}</span>
          <span className="text-mute text-xs">▾</span>
        </button>
        <div className="shrink-0 flex items-center gap-2">
          {/* 视图切换 */}
          <div className="flex bg-white rounded-full p-1 shadow-soft">
            <button
              onClick={() => setView('map')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                view === 'map' ? 'bg-brand text-white' : 'text-mute'
              }`}
            >
            地图
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              view === 'list' ? 'bg-brand text-white' : 'text-mute'
            }`}
          >
            列表
          </button>
          </div>
          <button
            onClick={onPost}
            className="w-9 aspect-square p-0 rounded-full bg-brand text-white text-xl leading-none font-bold shadow-soft grid place-items-center active:scale-95 transition-transform"
            aria-label="发起一个搭子"
          >
            <span className="-mt-px">+</span>
          </button>
          {/* 我的头像入口 */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-white shadow-soft grid place-items-center active:scale-95 transition-transform"
          >
            <UserAvatar user={me} size="sm" />
          </button>
        </div>
      </header>

      {/* 内容区 */}
      <div className="flex-1 relative overflow-hidden">
        {view === 'map' ? (
          <>
            <MapView tasks={allTasks} onPick={onOpenTask} />
            <div className="absolute left-4 bottom-5 rounded-full bg-white/90 backdrop-blur px-3 py-2 shadow-soft text-xs text-mute">
              周围有 {allTasks.length} 个人在搭，点地图 pin 查看
            </div>
          </>
        ) : (
          <div className="h-full overflow-y-auto no-scrollbar px-4 pt-2 pb-28 space-y-3">
            <p className="text-xs text-mute px-1">周围在搭的（按距离）</p>
            {[...allTasks]
              .sort((a, b) => a.distanceM - b.distanceM)
              .map((t) => (
                <TaskCard key={t.id} task={t} onClick={() => onOpenTask(t)} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
