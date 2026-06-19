import type { ReactNode } from 'react'
import type { Task, User } from '../types'
import {
  BookOpen,
  Camera,
  Coffee,
  CupSoda,
  Dumbbell,
  Gamepad2,
  Hourglass,
  MapPin,
  Milk,
  Music2,
  PartyPopper,
  PersonStanding,
  Send,
  Sparkles,
  Target,
  Timer,
  UserRound,
  Users,
  Utensils,
  Clock3,
  Footprints,
} from 'lucide-react'

const taskPalette: Record<Task['kind'] | 'neutral', { color: string; bg: string; glow: string }> = {
  random: { color: '#FF8A3D', bg: 'from-[#FFF3E7] to-[#FFD7B4]', glow: 'shadow-[0_10px_28px_rgba(255,138,61,0.22)]' },
  skill: { color: '#3DBFA0', bg: 'from-[#EFFFF8] to-[#BFF1E2]', glow: 'shadow-[0_10px_28px_rgba(61,191,160,0.2)]' },
  fill: { color: '#8B7DF0', bg: 'from-[#F3F0FF] to-[#DAD5FF]', glow: 'shadow-[0_10px_28px_rgba(139,125,240,0.2)]' },
  neutral: { color: '#FF8A3D', bg: 'from-[#FFF3E7] to-[#FFD7B4]', glow: 'shadow-[0_10px_28px_rgba(255,138,61,0.18)]' },
}

function taskGlyph(task: Pick<Task, 'emoji' | 'title' | 'kind'>) {
  if (task.emoji === '☕' || /咖啡|手冲/.test(task.title)) return Coffee
  if (task.emoji === '🎹' || /琴|音乐|德彪西/.test(task.title)) return Music2
  if (task.emoji === '🎾' || /网球|双打/.test(task.title)) return Dumbbell
  if (task.emoji === '🧋' || /奶茶/.test(task.title)) return CupSoda
  if (task.emoji === '🏃' || /跑|操场/.test(task.title)) return Footprints
  if (task.emoji === '🍜' || /拉面|吃|饭/.test(task.title)) return Utensils
  if (task.emoji === '🥞' || /煎饼/.test(task.title)) return Milk
  if (/图书馆|自习/.test(task.title)) return BookOpen
  return Sparkles
}

export function TaskIcon({
  task,
  size = 'md',
  className = '',
}: {
  task: Pick<Task, 'emoji' | 'title' | 'kind'>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const Icon = taskGlyph(task)
  const meta = taskPalette[task.kind]
  const sizes = {
    sm: { box: 'w-9 h-9 rounded-2xl', icon: 17 },
    md: { box: 'w-12 h-12 rounded-2xl', icon: 22 },
    lg: { box: 'w-16 h-16 rounded-3xl', icon: 30 },
    xl: { box: 'w-20 h-20 rounded-[28px]', icon: 38 },
  }[size]

  return (
    <div className={`${sizes.box} relative grid place-items-center overflow-hidden bg-gradient-to-br ${meta.bg} ${meta.glow} ${className}`}>
      <span className="absolute -right-3 -top-3 w-9 h-9 rounded-full bg-white/55 blur-[1px]" />
      <span className="absolute left-2 top-2 w-2 h-2 rounded-full bg-white/70" />
      <Icon size={sizes.icon} strokeWidth={2.35} color={meta.color} className="relative z-10" />
    </div>
  )
}

export function UserAvatar({
  user,
  size = 'md',
  label,
  muted = false,
}: {
  user?: Pick<User, 'name' | 'avatarHidden' | 'grade'>
  size?: 'sm' | 'md' | 'lg'
  label?: string
  muted?: boolean
}) {
  const sizes = {
    sm: { box: 'w-9 h-9', icon: 18, text: 'text-xs' },
    md: { box: 'w-12 h-12', icon: 22, text: 'text-sm' },
    lg: { box: 'w-14 h-14', icon: 26, text: 'text-base' },
  }[size]
  const showInitial = user && !user.avatarHidden && user.name

  return (
    <div className={`${sizes.box} relative rounded-full grid place-items-center shrink-0 bg-gradient-to-br ${muted ? 'from-stone-100 to-stone-200' : 'from-[#FFF3E7] to-[#FFD7B4]'} shadow-soft overflow-hidden`}>
      <span className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-white/55" />
      {showInitial ? (
        <span className={`${sizes.text} font-extrabold text-brand relative z-10`}>{user.name[0]}</span>
      ) : (
        <UserRound size={sizes.icon} strokeWidth={2.35} color={muted ? '#9B9189' : '#FF8A3D'} className="relative z-10" />
      )}
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}

export function InfoGlyph({
  name,
  children,
}: {
  name: 'time' | 'duration' | 'place' | 'distance' | 'people' | 'target' | 'wait' | 'done' | 'send'
  children?: ReactNode
}) {
  const icons = {
    time: Clock3,
    duration: Timer,
    place: MapPin,
    distance: PersonStanding,
    people: Users,
    target: Target,
    wait: Hourglass,
    done: PartyPopper,
    send: Send,
  }
  const Icon = icons[name]
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={13} strokeWidth={2.3} className="text-brand" />
      {children}
    </span>
  )
}

export function MiniActivityIcon({ task }: { task: Pick<Task, 'emoji' | 'title' | 'kind'> }) {
  return <TaskIcon task={task} size="sm" />
}

export function InterestIcon({ label }: { label: string }) {
  const Icon = /咖啡/.test(label)
    ? Coffee
    : /网球|跑步/.test(label)
      ? Dumbbell
      : /音乐/.test(label)
        ? Music2
        : /摄影/.test(label)
          ? Camera
          : /自习/.test(label)
            ? BookOpen
            : /奶茶/.test(label)
              ? CupSoda
              : /游戏/.test(label)
                ? Gamepad2
                : /citywalk/.test(label)
                  ? Footprints
                  : Sparkles

  return <Icon size={15} strokeWidth={2.4} />
}
