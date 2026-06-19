import { useEffect, useRef, useState } from 'react'
import type { ChatThread, ChatMsg } from '../types'

export default function ChatRoom({
  thread,
  onBack,
}: {
  thread: ChatThread
  onBack: () => void
}) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(thread.messages)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9 })
  }, [msgs])

  function send() {
    if (!input.trim()) return
    setMsgs((m) => [...m, { from: 'me', text: input.trim(), timeLabel: '刚刚' }])
    setInput('')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-cream">
      {/* 顶部 */}
      <header className="px-4 pt-safe-t pb-3 bg-white shadow-soft flex items-center gap-3">
        <button onClick={onBack} className="text-ink text-xl w-7">
          ←
        </button>
        <div className="w-9 h-9 rounded-full bg-brand-soft grid place-items-center text-lg">
          {thread.user.avatarHidden ? thread.user.emoji : thread.user.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink text-sm leading-tight truncate">
            {thread.user.avatarHidden ? thread.user.emoji + ' ' + thread.user.grade + '同学' : thread.user.name}
          </div>
          <div className="text-[11px] text-mute leading-tight">
            {thread.user.college} · 信用 {thread.user.credit}
          </div>
        </div>
      </header>

      {/* 任务记录上下文（钉在顶部） */}
      <div className="px-4 py-2 bg-brand-soft/40 flex items-center gap-2">
        <span className="text-base">{thread.taskEmoji}</span>
        <span className="text-xs text-ink/70">
          你们{thread.metAtLabel}一起 <b className="text-ink">{thread.taskTitle}</b> 认识
        </span>
      </div>

      {/* 消息区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-2.5">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex items-end gap-2'}>
            {m.from === 'other' && (
              <div className="w-7 h-7 rounded-full bg-brand-soft grid place-items-center text-sm shrink-0">
                {thread.user.emoji}
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
                m.from === 'me'
                  ? 'bg-brand text-white rounded-br-md'
                  : 'bg-white text-ink shadow-soft rounded-bl-md'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* 输入栏 */}
      <div className="px-3 pb-safe-b pt-2 bg-white flex items-center gap-2">
        <button className="text-mute text-xl w-9 h-9 grid place-items-center shrink-0">＋</button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="再约一次，或者随便聊聊…"
          className="flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-mute"
        />
        <button
          onClick={send}
          className="bg-brand text-white w-10 h-10 rounded-full grid place-items-center shrink-0 active:animate-pop"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
