import DadaMascot from './DadaMascot'

export type Tab = 'home' | 'pending' | 'companion' | 'chats' | 'buddies'

const items: { key: Tab; label: string }[] = [
  { key: 'home', label: '看看周围' },
  { key: 'pending', label: '等一会儿' },
  { key: 'companion', label: '哒哒' },
  { key: 'chats', label: '消息' },
  { key: 'buddies', label: '搭子' },
]

function FlatIcon({ name, active }: { name: Exclude<Tab, 'companion'>; active: boolean }) {
  const color = active ? '#FF8A3D' : '#B8AFA8'
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7 block" aria-hidden="true">
      {name === 'home' && (
        <>
          <circle cx="14" cy="14" r="9" {...common} />
          <path d="M17.8 10.2L15.5 15.5L10.2 17.8L12.5 12.5L17.8 10.2Z" fill={active ? '#FF8A3D' : 'none'} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="14" cy="14" r="1.2" fill={active ? '#FFFFFF' : color} />
        </>
      )}
      {name === 'pending' && (
        <>
          <path d="M9 5H19" {...common} />
          <path d="M9 23H19" {...common} />
          <path d="M10 6.5C10 10 12 11.6 14 14C16 16.4 18 18 18 21.5" {...common} />
          <path d="M18 6.5C18 10 16 11.6 14 14C12 16.4 10 18 10 21.5" {...common} />
          <path d="M11.5 20.5H16.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
      {name === 'chats' && (
        <>
          <path d="M7 8.5C7 6.6 8.6 5 10.5 5H17.8C19.9 5 21.5 6.6 21.5 8.7V14.2C21.5 16.3 19.9 17.9 17.8 17.9H13L8.2 22V17.3C7.5 16.7 7 15.6 7 14.4V8.5Z" {...common} />
          <path d="M11 10.5H17" {...common} />
          <path d="M11 14H15" {...common} />
        </>
      )}
      {name === 'buddies' && (
        <>
          <circle cx="11" cy="10" r="3.2" {...common} />
          <circle cx="18" cy="11" r="2.7" {...common} opacity="0.85" />
          <path d="M5.5 21C6.2 17.7 8.2 15.8 11 15.8C13.8 15.8 15.8 17.7 16.5 21" {...common} />
          <path d="M15.4 17C17.8 17.2 19.5 18.6 20.4 21" {...common} opacity="0.85" />
        </>
      )}
    </svg>
  )
}

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
    <nav className="shrink-0 bg-white px-1.5 pt-2 pb-safe-b shadow-[0_-8px_24px_rgba(255,138,61,0.08)] grid grid-cols-5 items-start">
      {items.map((it) => {
        const on = active === it.key
        const badge =
          it.key === 'pending' ? pendingBadge : it.key === 'chats' ? chatBadge : 0
        if (it.key === 'companion') {
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className="min-w-0 flex flex-col items-center gap-1 py-1 active:scale-95 transition-transform"
            >
              <span className="relative w-7 h-7 grid place-items-center">
                {companionPulse && !on && (
                  <>
                    <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2">
                      <span className="absolute inset-0 rounded-full bg-brand/10 blur-xl animate-ping" />
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2">
                      <span className="absolute inset-0 rounded-full border-2 border-brand/25 animate-ping [animation-delay:0.25s]" />
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-soft/35 blur-md" />
                    <span className="absolute -top-1 -right-1 z-20 w-2.5 h-2.5 rounded-full bg-brand ring-2 ring-white" />
                  </>
                )}
                <span className="relative z-10">
                  <DadaMascot size={27} bouncing={on || companionPulse} />
                </span>
              </span>
              <span className={`text-[11px] leading-none font-medium ${on ? 'text-brand' : 'text-mute'}`}>
                {it.label}
              </span>
            </button>
          )
        }
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className="min-w-0 flex flex-col items-center gap-1 py-1 active:scale-95 transition-transform"
          >
            <span className="relative w-7 h-7 grid place-items-center">
              <FlatIcon name={it.key} active={on} />
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] leading-none font-bold grid place-items-center ring-2 ring-white">
                  {badge}
                </span>
              )}
            </span>
            <span className={`text-[11px] leading-none font-medium ${on ? 'text-brand' : 'text-mute'}`}>
              {it.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
