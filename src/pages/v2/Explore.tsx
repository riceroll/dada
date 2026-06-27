import { useRef, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Coffee,
  Dumbbell,
  LocateFixed,
  Map,
  MapPin,
  Music2,
  Minus,
  Plus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import { lockedActivityPlaceholders, mockActivityTasksV2 } from '../../data/mockTasksV2'
import type { ActivityTaskV2 } from '../../types/profile'

interface ExploreProps {
  onShake: () => void
  onOpenProfile: () => void
  onOpenTask: (task: ActivityTaskV2) => void
  createdTasks?: ActivityTaskV2[]
}

export default function Explore({ onShake, onOpenProfile, onOpenTask, createdTasks = [] }: ExploreProps) {
  const [view, setView] = useState<'map' | 'list'>('map')
  const tasks = [...createdTasks, ...mockActivityTasksV2]

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-4 pb-2 pt-safe-t">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70 shadow-[0_10px_24px_rgba(31,27,24,0.08)]"
            aria-label="Open profile"
          >
            <span className="h-5 w-5 rounded-full bg-[radial-gradient(circle_at_32%_28%,#fff7df,#b9d5c2_45%,#1f1b18_88%)]" />
          </button>
          <div className="flex rounded-full border border-[#1f1b18]/10 bg-white/70 p-1 shadow-[0_10px_24px_rgba(31,27,24,0.06)]">
            <ViewButton active={view === 'map'} onClick={() => setView('map')} label="地图" />
            <ViewButton active={view === 'list'} onClick={() => setView('list')} label="列表" />
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70 shadow-[0_10px_24px_rgba(31,27,24,0.08)]"
            aria-label="Notifications"
          >
            <Bell size={17} />
          </button>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Nearby radar</p>
            <h1 className="mt-1 text-[22px] font-semibold leading-[1.08] tracking-[-0.02em]">今晚附近缺一个你。</h1>
          </div>
          <button
            type="button"
            onClick={onShake}
            className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1f1b18] text-white shadow-[0_18px_45px_rgba(31,27,24,0.2)]"
            aria-label="摇个搭子"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {view === 'map' ? <ExploreMap tasks={tasks} onShake={onShake} onOpenTask={onOpenTask} /> : <ExploreList tasks={tasks} onOpenTask={onOpenTask} />}
    </main>
  )
}

function ViewButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-full px-4 text-xs font-semibold transition ${active ? 'bg-[#1f1b18] text-white' : 'text-[#6f655d]'}`}
    >
      {label}
    </button>
  )
}

function ExploreMap({ tasks, onOpenTask }: { tasks: ActivityTaskV2[]; onShake: () => void; onOpenTask: (task: ActivityTaskV2) => void }) {
  const [selectedTask, setSelectedTask] = useState<ActivityTaskV2 | null>(null)
  const [zoom, setZoom] = useState(1.04)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const movedRef = useRef(false)

  function setBoundedZoom(nextZoom: number) {
    setZoom(Math.min(1.85, Math.max(0.86, nextZoom)))
  }

  function resetMap() {
    setZoom(1.04)
    setPan({ x: 0, y: 0 })
  }

  return (
    <section className="relative min-h-0 flex-1 overflow-hidden bg-[#e9dfd2]">
      <div
        className="relative h-full cursor-grab touch-none overflow-hidden active:cursor-grabbing"
        onPointerDown={(event) => {
          movedRef.current = false
          dragRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!dragRef.current) return
          const nextX = dragRef.current.panX + event.clientX - dragRef.current.x
          const nextY = dragRef.current.panY + event.clientY - dragRef.current.y
          if (Math.abs(event.clientX - dragRef.current.x) + Math.abs(event.clientY - dragRef.current.y) > 6) {
            movedRef.current = true
          }
          setPan({ x: nextX, y: nextY })
        }}
        onPointerUp={() => {
          dragRef.current = null
          if (!movedRef.current) setSelectedTask(null)
        }}
        onPointerCancel={() => {
          dragRef.current = null
        }}
        onWheel={(event) => {
          event.preventDefault()
          setBoundedZoom(zoom + (event.deltaY > 0 ? -0.08 : 0.08))
        }}
      >
        <div
          className="absolute inset-[-14%] transition-transform duration-75 ease-out"
          style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`, transformOrigin: 'center' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(255,255,255,0.76),transparent_23%),radial-gradient(circle_at_68%_66%,rgba(173,207,184,0.55),transparent_28%)]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 520" role="img" aria-label="Stylized campus map">
            <path d="M-28 390 C78 326 130 426 232 362 C294 322 316 354 360 318" fill="none" stroke="#1f1b18" strokeOpacity="0.08" strokeWidth="50" strokeLinecap="round" />
            <path d="M26 96 C120 128 166 116 286 84" fill="none" stroke="#1f1b18" strokeOpacity="0.1" strokeWidth="20" strokeLinecap="round" />
            <path d="M88 -20 C130 158 112 298 70 555" fill="none" stroke="#fffaf1" strokeOpacity="0.96" strokeWidth="22" strokeLinecap="round" />
            <path d="M-20 248 C86 232 170 244 344 202" fill="none" stroke="#fffaf1" strokeOpacity="0.94" strokeWidth="20" strokeLinecap="round" />
            <path d="M218 -28 C196 132 218 284 296 548" fill="none" stroke="#fffaf1" strokeOpacity="0.82" strokeWidth="18" strokeLinecap="round" />
            <path d="M-22 470 C96 410 198 436 348 386" fill="none" stroke="#fffaf1" strokeOpacity="0.68" strokeWidth="15" strokeLinecap="round" />
          </svg>

          {tasks.map((task) => (
            <MapMarker
              key={task.id}
              task={task}
              selected={selectedTask?.id === task.id}
              onSelect={() => setSelectedTask(task)}
            />
          ))}
          {lockedActivityPlaceholders.map((item) => (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#1f1b18]/24 bg-white/38 px-3 py-2 text-[10px] font-semibold text-[#6f655d] shadow-[0_10px_26px_rgba(31,27,24,0.08)] backdrop-blur"
              style={{ left: `${item.mapX}%`, top: `${item.mapY}%` }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div
          className="absolute left-4 right-4 top-4 flex items-center gap-2 rounded-full border border-[#1f1b18]/10 bg-white/78 px-4 py-3 text-sm text-[#6f655d] shadow-[0_14px_35px_rgba(31,27,24,0.08)] backdrop-blur-xl"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <Search size={16} />
          <span>同济大学 · 四平路校区附近</span>
        </div>

        <div
          className="absolute right-4 top-[76px] flex flex-col overflow-hidden rounded-full border border-[#1f1b18]/10 bg-white/78 shadow-[0_14px_35px_rgba(31,27,24,0.08)] backdrop-blur-xl"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button type="button" onClick={() => setBoundedZoom(zoom + 0.14)} className="grid h-10 w-10 place-items-center border-b border-[#1f1b18]/8">
            <Plus size={16} />
          </button>
          <button type="button" onClick={() => setBoundedZoom(zoom - 0.14)} className="grid h-10 w-10 place-items-center border-b border-[#1f1b18]/8">
            <Minus size={16} />
          </button>
          <button type="button" onClick={resetMap} className="grid h-10 w-10 place-items-center">
            <LocateFixed size={16} />
          </button>
        </div>

        {selectedTask ? (
          <div
            className="absolute bottom-4 left-4 right-4 animate-slide-up"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <ActivityCard task={selectedTask} compact onOpenTask={onOpenTask} />
          </div>
        ) : (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-[#1f1b18]/10 bg-white/75 px-4 py-2 text-xs font-semibold text-[#6f655d] shadow-[0_14px_35px_rgba(31,27,24,0.08)] backdrop-blur-xl">
            拖动地图，点一个标记查看
          </div>
        )}
      </div>
    </section>
  )
}

function ExploreList({ tasks, onOpenTask }: { tasks: ActivityTaskV2[]; onOpenTask: (task: ActivityTaskV2) => void }) {
  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
      <div className="space-y-2.5 pb-4">
        {tasks.map((task) => (
          <ActivityCard key={task.id} task={task} onOpenTask={onOpenTask} />
        ))}
      </div>
    </section>
  )
}

function MapMarker({ task, selected, onSelect }: { task: ActivityTaskV2; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={onSelect}
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-95"
      style={{ left: `${task.mapX}%`, top: `${task.mapY}%` }}
    >
      <div className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-[0_16px_35px_rgba(31,27,24,0.12)] backdrop-blur ${selected ? 'scale-105 ring-4 ring-white/70' : ''} ${task.locked ? 'border-[#1f1b18]/10 bg-white/62 text-[#8a7e74]' : 'border-[#1f1b18]/15 bg-[#1f1b18] text-white'}`}>
        <ActivityGlyph activityNodeId={task.activityNodeId} size={15} />
        <span className="max-w-[92px] truncate text-[11px] font-semibold">{task.expiresAtLabel}</span>
      </div>
    </button>
  )
}

function ActivityCard({
  task,
  compact = false,
  onShake,
  onOpenTask,
}: {
  task: ActivityTaskV2
  compact?: boolean
  onShake?: () => void
  onOpenTask: (task: ActivityTaskV2) => void
}) {
  return (
    <article className={`paper-card rounded-[20px] p-3 ${task.locked ? 'opacity-78' : ''}`}>
      <div className="flex items-start gap-2.5">
        <ActivityMark task={task} />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8a7e74]">
            <MapPin size={12} />
            <span>{task.fuzzyArea}</span>
            <span>·</span>
            <span>{task.expiresAtLabel}</span>
          </div>
          <h2 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#1f1b18]">{task.title}</h2>
          {!compact && <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[#6f655d]">{task.compatibilityReason}</p>}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11px] text-[#6f655d]">
        <InfoPill icon={<Users size={13} />} label={`${task.currentGroupSize}/${task.desiredGroupSize} 人`} />
        <InfoPill icon={<Map size={13} />} label={task.place} />
        <InfoPill icon={<Sparkles size={13} />} label={task.hostAlias} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 rounded-[16px] bg-[#f7f2eb] px-3 py-2.5">
        <p className="min-w-0 flex-1 truncate text-[13px] leading-5 text-[#5f5750]">{task.desiredPersonHint}</p>
        {onShake ? (
          <button type="button" onClick={() => onOpenTask(task)} className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-[#1f1b18] px-3 text-[11px] font-semibold text-white">
            看详情
            <ArrowUpRight size={13} />
          </button>
        ) : (
          <button type="button" onClick={() => onOpenTask(task)} className="flex h-8 shrink-0 items-center gap-1 rounded-full border border-[#1f1b18]/10 bg-white px-3 text-[11px] font-semibold text-[#1f1b18]">
            看详情
            <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </article>
  )
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1 rounded-full bg-[#f7f2eb] px-2 py-1.5">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  )
}

function ActivityMark({ task }: { task: ActivityTaskV2 }) {
  const tone = activityTone(`${task.id}-${task.title}-${task.activityNodeId}`)
  return (
    <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-[#1f1b18]/8 bg-gradient-to-br ${tone.bg} shadow-[0_10px_22px_rgba(31,27,24,0.07)]`}>
      <span className={`absolute -right-3 -top-3 h-8 w-8 rounded-full ${tone.blob} opacity-60 blur-sm`} />
      <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_48%,rgba(31,27,24,0.05))]" />
      <span className="relative z-10" style={{ color: tone.color }}>
        <ActivityGlyph activityNodeId={task.activityNodeId} size={18} />
      </span>
    </div>
  )
}

function activityTone(seed: string) {
  const tones = [
    { bg: 'from-[#EDE3D6] to-[#C8B7A4]', blob: 'bg-[#F5E7C7]', color: '#74685D' },
    { bg: 'from-[#E8E6DC] to-[#B9C1B1]', blob: 'bg-[#DDE7D6]', color: '#667365' },
    { bg: 'from-[#E5E1D8] to-[#B7C4C6]', blob: 'bg-[#D6E1E2]', color: '#66787A' },
    { bg: 'from-[#EAE2DF] to-[#C9B8C1]', blob: 'bg-[#ECD6DC]', color: '#766B72' },
    { bg: 'from-[#ECE6DC] to-[#CFC8B8]', blob: 'bg-[#F2E8CC]', color: '#746D63' },
    { bg: 'from-[#E6E0D8] to-[#BFC0AD]', blob: 'bg-[#D6D6B9]', color: '#71745D' },
  ]
  const index = Math.abs(seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % tones.length
  return tones[index]
}

function ActivityGlyph({ activityNodeId, size }: { activityNodeId: string; size: number }) {
  if (activityNodeId === 'coffee') return <Coffee size={size} />
  if (activityNodeId === 'library-study') return <BookOpen size={size} />
  if (activityNodeId === 'running') return <Dumbbell size={size} />
  if (activityNodeId === 'piano') return <Music2 size={size} />
  return <Sparkles size={size} />
}
