import { Clock3, Compass, MessageCircle, Orbit, UsersRound, type LucideIcon } from 'lucide-react'

export type Tab = 'home' | 'pending' | 'companion' | 'chats' | 'buddies'

const items: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: '雷达', icon: Compass },
  { key: 'pending', label: '待确认', icon: Clock3 },
  { key: 'companion', label: '哒哒', icon: Orbit },
  { key: 'chats', label: '消息', icon: MessageCircle },
  { key: 'buddies', label: '关系', icon: UsersRound },
]

export default function TabBar({
  active,
  onChange,
  pendingBadge = 0,
  chatBadge = 0,
  companionPulse = false,
}: {
  active: Tab
  onChange: (t: Tab) => void
  pendingBadge?: number
  chatBadge?: number
  companionPulse?: boolean
}) {
  return (
    <nav className="shrink-0 border-t border-[#1f1b18]/8 bg-[#f7f2eb]/92 px-3 pb-safe-b pt-2 shadow-[0_-18px_45px_rgba(31,27,24,0.08)] backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1 rounded-[28px] border border-[#1f1b18]/10 bg-white/70 p-1.5">
        {items.map((item) => {
          const Icon = item.icon
          const selected = active === item.key
          const badge = item.key === 'pending' ? pendingBadge : item.key === 'chats' ? chatBadge : 0
          const pulsing = item.key === 'companion' && companionPulse && !selected

          return (
            <button
              type="button"
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[22px] py-2 transition ${
                selected ? 'bg-[#1f1b18] text-white shadow-[0_14px_35px_rgba(31,27,24,0.2)]' : 'text-[#867b72] active:bg-[#f7f2eb]'
              }`}
            >
              {pulsing && <span className="pointer-events-none absolute inset-1 rounded-[20px] bg-[#df8f83]/20 animate-pulse" />}
              <span className="relative">
                <Icon size={19} strokeWidth={selected ? 2.4 : 2} />
                {badge > 0 && (
                  <span className="absolute -right-2.5 -top-2 min-w-4 rounded-full bg-[#df6f62] px-1 text-[10px] font-bold leading-4 text-white ring-2 ring-white">
                    {badge}
                  </span>
                )}
                {pulsing && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#df6f62] ring-2 ring-white" />}
              </span>
              <span className="relative truncate text-[10px] font-semibold leading-none">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
