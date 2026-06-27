import { useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Coffee,
  Dumbbell,
  Map,
  MapPin,
  Music2,
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
}

export default function Explore({ onShake, onOpenProfile, onOpenTask }: ExploreProps) {
  const [view, setView] = useState<'map' | 'list'>('map')

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-4 pt-safe-t">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70 shadow-[0_10px_24px_rgba(31,27,24,0.08)]"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70 shadow-[0_10px_24px_rgba(31,27,24,0.08)]"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Nearby radar</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.02em]">今晚附近有这些人刚好缺一个你。</h1>
            <button
              type="button"
              onClick={onShake}
              className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1f1b18] text-white shadow-[0_18px_45px_rgba(31,27,24,0.2)]"
              aria-label="摇个搭子"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {view === 'map' ? <ExploreMap onShake={onShake} onOpenTask={onOpenTask} /> : <ExploreList onOpenTask={onOpenTask} />}
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

function ExploreMap({ onShake, onOpenTask }: { onShake: () => void; onOpenTask: (task: ActivityTaskV2) => void }) {
  const featured = mockActivityTasksV2[0]

  return (
    <section className="relative min-h-0 flex-1 overflow-hidden px-5 pb-5">
      <div className="relative h-full overflow-hidden rounded-[32px] border border-[#1f1b18]/10 bg-[#e9dfd2] shadow-[0_26px_70px_rgba(31,27,24,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(255,255,255,0.76),transparent_23%),radial-gradient(circle_at_68%_66%,rgba(173,207,184,0.55),transparent_28%)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 520" role="img" aria-label="Stylized campus map">
          <path d="M-20 360 C80 310 120 410 220 355 C285 320 305 350 350 318" fill="none" stroke="#1f1b18" strokeOpacity="0.08" strokeWidth="44" strokeLinecap="round" />
          <path d="M35 96 C120 128 166 116 276 84" fill="none" stroke="#1f1b18" strokeOpacity="0.1" strokeWidth="18" strokeLinecap="round" />
          <path d="M88 0 C130 160 112 298 74 540" fill="none" stroke="#fffaf1" strokeOpacity="0.95" strokeWidth="20" strokeLinecap="round" />
          <path d="M-10 248 C86 232 170 244 335 202" fill="none" stroke="#fffaf1" strokeOpacity="0.92" strokeWidth="18" strokeLinecap="round" />
          <path d="M218 -15 C196 132 218 284 292 530" fill="none" stroke="#fffaf1" strokeOpacity="0.8" strokeWidth="16" strokeLinecap="round" />
        </svg>

        {mockActivityTasksV2.map((task) => (
          <MapMarker key={task.id} task={task} />
        ))}
        {lockedActivityPlaceholders.map((item) => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#1f1b18]/24 bg-white/35 px-3 py-2 text-[10px] font-semibold text-[#6f655d] backdrop-blur"
            style={{ left: `${item.mapX}%`, top: `${item.mapY}%` }}
          >
            {item.label}
          </div>
        ))}

        <div className="absolute left-4 right-4 top-4 flex items-center gap-2 rounded-full border border-[#1f1b18]/10 bg-white/75 px-4 py-3 text-sm text-[#6f655d] shadow-[0_14px_35px_rgba(31,27,24,0.08)] backdrop-blur">
          <Search size={16} />
          <span>同济大学 · 四平路校区附近</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <ActivityCard task={featured} compact onShake={onShake} onOpenTask={onOpenTask} />
        </div>
      </div>
    </section>
  )
}

function ExploreList({ onOpenTask }: { onOpenTask: (task: ActivityTaskV2) => void }) {
  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
      <div className="space-y-3 pb-4">
        {mockActivityTasksV2.map((task) => (
          <ActivityCard key={task.id} task={task} onOpenTask={onOpenTask} />
        ))}
      </div>
    </section>
  )
}

function MapMarker({ task }: { task: ActivityTaskV2 }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${task.mapX}%`, top: `${task.mapY}%` }}>
      <div className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-[0_16px_35px_rgba(31,27,24,0.12)] backdrop-blur ${task.locked ? 'border-[#1f1b18]/10 bg-white/55 text-[#8a7e74]' : 'border-[#1f1b18]/15 bg-[#1f1b18] text-white'}`}>
        <ActivityGlyph activityNodeId={task.activityNodeId} size={15} />
        <span className="max-w-[92px] truncate text-[11px] font-semibold">{task.expiresAtLabel}</span>
      </div>
    </div>
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
    <article className={`rounded-[28px] border border-[#1f1b18]/10 bg-white/78 p-4 shadow-[0_20px_55px_rgba(31,27,24,0.1)] backdrop-blur ${task.locked ? 'border-dashed opacity-78' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1f1b18] text-white">
          <ActivityGlyph activityNodeId={task.activityNodeId} size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e74]">
            <MapPin size={12} />
            <span>{task.fuzzyArea}</span>
            <span>·</span>
            <span>{task.expiresAtLabel}</span>
          </div>
          <h2 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[#1f1b18]">{task.title}</h2>
          {!compact && <p className="mt-2 text-sm leading-6 text-[#6f655d]">{task.compatibilityReason}</p>}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-[#6f655d]">
        <InfoPill icon={<Users size={13} />} label={`${task.currentGroupSize}/${task.desiredGroupSize} 人`} />
        <InfoPill icon={<Map size={13} />} label={task.place} />
        <InfoPill icon={<Sparkles size={13} />} label={task.hostAlias} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#f7f2eb] px-4 py-3">
        <p className="min-w-0 flex-1 text-sm leading-5 text-[#5f5750]">{task.desiredPersonHint}</p>
        {onShake ? (
          <button type="button" onClick={() => onOpenTask(task)} className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#1f1b18] px-3 text-xs font-semibold text-white">
            看详情
            <ArrowUpRight size={13} />
          </button>
        ) : (
          <button type="button" onClick={() => onOpenTask(task)} className="flex h-9 shrink-0 items-center gap-1 rounded-full border border-[#1f1b18]/10 bg-white px-3 text-xs font-semibold text-[#1f1b18]">
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
    <div className="flex min-w-0 items-center gap-1 rounded-full bg-[#f7f2eb] px-2.5 py-2">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  )
}

function ActivityGlyph({ activityNodeId, size }: { activityNodeId: string; size: number }) {
  if (activityNodeId === 'coffee') return <Coffee size={size} />
  if (activityNodeId === 'library-study') return <BookOpen size={size} />
  if (activityNodeId === 'running') return <Dumbbell size={size} />
  if (activityNodeId === 'piano') return <Music2 size={size} />
  return <Sparkles size={size} />
}
