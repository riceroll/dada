import { useState } from 'react'
import { ArrowLeft, Check, Clock3, Eye, LockKeyhole, MapPin, Send } from 'lucide-react'
import type { ActivityTaskV2, MatchPermissionKind } from '../../types/profile'

interface MatchChatV2Props {
  task: ActivityTaskV2
  onBack: () => void
  onMeet: () => void
}

const permissionLabels: Record<MatchPermissionKind, string> = {
  reveal_avatar: '提议 reveal 头像',
  open_chat: '开放自由聊天',
  confirm_place: '确认具体位置',
  change_time: '改时间',
}

export default function MatchChatV2({ task, onBack, onMeet }: MatchChatV2Props) {
  const [granted, setGranted] = useState<MatchPermissionKind[]>([])
  const [messages, setMessages] = useState([
    { from: 'system', text: `${task.hostAlias} 接受了你的请求。先围绕这次活动聊，别急着交换全部信息。` },
  ])
  const [input, setInput] = useState('')

  function request(kind: MatchPermissionKind) {
    if (granted.includes(kind)) return
    setGranted((current) => [...current, kind])
    setMessages((current) => [...current, { from: 'system', text: `${permissionLabels[kind]}已被双方同意。` }])
  }

  function send() {
    if (!input.trim()) return
    setMessages((current) => [...current, { from: 'me', text: input.trim() }])
    setInput('')
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="border-b border-[#1f1b18]/8 bg-white/76 px-4 pb-3 pt-safe-t backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f2eb]">
            <ArrowLeft size={18} />
          </button>
          <div className="h-10 w-10 rounded-full bg-[radial-gradient(circle_at_35%_25%,#fff7df,#b9d5c2_48%,#1f1b18_88%)]" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold">{task.hostAlias}</h1>
            <p className="truncate text-[11px] text-[#8a7e74]">头像隐藏中 · match chat</p>
          </div>
        </div>
      </header>

      <section className="border-b border-[#1f1b18]/8 bg-[#1f1b18] px-4 py-4 text-white">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
          <Clock3 size={13} />
          <span>{task.startsAtLabel} · {task.expiresAtLabel}</span>
        </div>
        <h2 className="text-xl font-semibold leading-tight">{task.title}</h2>
        <p className="mt-2 text-sm text-white/58">{task.fuzzyArea} · {task.currentGroupSize + 1}/{task.desiredGroupSize} 人</p>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        <div className="mb-4 grid grid-cols-2 gap-2">
          {(Object.keys(permissionLabels) as MatchPermissionKind[]).map((kind) => {
            const done = granted.includes(kind)
            return (
              <button
                type="button"
                key={kind}
                onClick={() => request(kind)}
                className={`flex min-h-12 items-center gap-2 rounded-2xl px-3 text-left text-xs font-semibold ${done ? 'bg-[#1f1b18] text-white' : 'border border-[#1f1b18]/10 bg-white/74 text-[#514941]'}`}
              >
                {done ? <Check size={14} /> : kind === 'reveal_avatar' ? <Eye size={14} /> : kind === 'confirm_place' ? <MapPin size={14} /> : <LockKeyhole size={14} />}
                <span>{done ? '已同意' : permissionLabels[kind]}</span>
              </button>
            )
          })}
        </div>
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div key={`${message.text}-${index}`} className={message.from === 'me' ? 'flex justify-end' : 'flex justify-center'}>
              <div className={message.from === 'me' ? 'max-w-[78%] rounded-[22px] rounded-br-md bg-[#1f1b18] px-4 py-3 text-sm leading-6 text-white' : 'max-w-[88%] rounded-2xl border border-[#1f1b18]/10 bg-white/70 px-4 py-3 text-center text-xs leading-5 text-[#6f655d]'}>
                {message.text}
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <div className="max-w-[78%] rounded-[22px] rounded-bl-md border border-[#1f1b18]/10 bg-white/78 px-4 py-3 text-sm leading-6 text-[#3a332e]">
              到时候我在{task.place}附近等，你到了可以点确认位置。
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1f1b18]/8 bg-white/76 pb-safe-b pt-3 backdrop-blur-xl">
        <div className="mb-3 px-4">
          <button type="button" onClick={onMeet} className="h-11 w-full rounded-full bg-[#1f1b18] text-sm font-semibold text-white">
            进入见面前状态
          </button>
        </div>
        <div className="flex items-center gap-2 px-4">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && send()}
            placeholder="围绕这次活动说一句"
            className="h-12 flex-1 rounded-full border border-[#1f1b18]/10 bg-[#f7f2eb] px-4 text-sm outline-none placeholder:text-[#a89d94]"
          />
          <button type="button" onClick={send} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1b18] text-white">
            <Send size={17} />
          </button>
        </div>
      </footer>
    </main>
  )
}
