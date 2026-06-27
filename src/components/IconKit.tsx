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

const taskPalette: Record<Task['kind'] | 'neutral', { color: string; bg: string; mark: string }> = {
  random: { color: '#6F786A', bg: 'from-[#E9E4D8] to-[#C9D0BC]', mark: 'bg-[#AEB89F]/45' },
  skill: { color: '#687A83', bg: 'from-[#E8E5DE] to-[#BFCBD0]', mark: 'bg-[#A8BAC0]/45' },
  fill: { color: '#7E6F73', bg: 'from-[#EDE4DF] to-[#D3BDB8]', mark: 'bg-[#C8AAA5]/45' },
  neutral: { color: '#746D63', bg: 'from-[#EEE8DD] to-[#D7D0C2]', mark: 'bg-[#C8BFAA]/45' },
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
    <div className={`${sizes.box} relative grid place-items-center overflow-hidden border border-[#1f1b18]/8 bg-gradient-to-br ${meta.bg} shadow-[0_10px_24px_rgba(31,27,24,0.07)] ${className}`}>
      <span className={`absolute -right-3 -top-3 h-9 w-9 rounded-full ${meta.mark} blur-sm`} />
      <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.36),transparent_46%,rgba(31,27,24,0.05))]" />
      <Icon size={sizes.icon} strokeWidth={2.2} color={meta.color} className="relative z-10" />
    </div>
  )
}

function avatarTone(seed = '') {
  const tones = [
    { bg: 'from-[#F4E8D6] via-[#B8C4AA] to-[#28302A]', blob: 'bg-[#E7D49C]' },
    { bg: 'from-[#ECE6DD] via-[#AABAC0] to-[#252A30]', blob: 'bg-[#D5DDD9]' },
    { bg: 'from-[#F0E0D8] via-[#C9AAA5] to-[#2E2528]', blob: 'bg-[#E8C6BD]' },
    { bg: 'from-[#E8E3D7] via-[#B8B09F] to-[#27231F]', blob: 'bg-[#F1E9D2]' },
  ]
  const index = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % tones.length
  return tones[index]
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
  const tone = avatarTone(user?.name ?? user?.grade ?? label ?? 'dada')

  return (
    <div className={`${sizes.box} relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-white/55 bg-gradient-to-br ${tone.bg} shadow-[0_10px_24px_rgba(31,27,24,0.08)]`}>
      <span className={`absolute h-1/2 w-1/2 rounded-full ${tone.blob} opacity-75 blur-sm ${muted ? 'left-2 top-2' : 'right-1 top-1'}`} />
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_24%,rgba(255,255,255,0.5),transparent_30%),linear-gradient(135deg,transparent,rgba(31,27,24,0.2))]" />
      <span className="absolute inset-[23%] rounded-full border border-white/25 bg-white/10 blur-[2px]" />
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
      <Icon size={13} strokeWidth={2.3} className="text-[#7A746A]" />
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
