import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, LockKeyhole, Send, ShieldCheck } from 'lucide-react'
import type { ChatMsg, ChatThread } from '../../types'
import { chatThreads } from '../../data'
import { TaskIcon, UserAvatar } from '../../components/IconKit'

export default function ChatsV2() {
  const [open, setOpen] = useState<ChatThread | null>(null)

  if (open) return <ChatRoomV2 thread={open} onBack={() => setOpen(null)} />

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-5 pt-safe-t">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Matched threads</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-[1.04] tracking-[-0.03em]">聊天从一件做过的事开始。</h1>
      </header>
      <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
        <div className="space-y-3 pb-4">
          {chatThreads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setOpen(thread)}
              className="w-full rounded-[30px] border border-[#1f1b18]/10 bg-white/74 p-4 text-left shadow-[0_18px_45px_rgba(31,27,24,0.07)]"
            >
              <div className="flex gap-3">
                <div className="relative shrink-0">
                  <UserAvatar user={thread.user} size="md" />
                  <span className="absolute -bottom-1 -right-1 scale-75 rounded-full bg-white p-0.5">
                    <TaskIcon task={{ emoji: thread.taskEmoji, title: thread.taskTitle, kind: 'random' }} size="sm" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="truncate text-lg font-semibold tracking-[-0.01em]">
                      {thread.user.avatarHidden ? `${thread.user.grade}同学` : thread.user.name}
                    </h2>
                    <span className="shrink-0 text-[11px] font-medium text-[#8a7e74]">{thread.lastTimeLabel}</span>
                  </div>
                  <div className="mt-1 inline-flex max-w-full items-center gap-1 rounded-full bg-[#f7f2eb] px-3 py-1 text-[11px] font-medium text-[#6f655d]">
                    <ShieldCheck size={12} />
                    <span className="truncate">一起{thread.taskTitle} · {thread.metAtLabel}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <p className="min-w-0 flex-1 truncate text-sm text-[#5f5750]">{thread.lastMsg}</p>
                    {thread.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#df6f62] px-1.5 text-[11px] font-bold text-white">{thread.unread}</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

function ChatRoomV2({ thread, onBack }: { thread: ChatThread; onBack: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(thread.messages)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9 })
  }, [msgs])

  function send() {
    if (!input.trim()) return
    setMsgs((current) => [...current, { from: 'me', text: input.trim(), timeLabel: '刚刚' }])
    setInput('')
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="border-b border-[#1f1b18]/8 bg-white/76 px-4 pb-3 pt-safe-t backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f2eb]">
            <ArrowLeft size={18} />
          </button>
          <UserAvatar user={thread.user} size="sm" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold">{thread.user.avatarHidden ? `${thread.user.grade}同学` : thread.user.name}</h1>
            <p className="truncate text-[11px] text-[#8a7e74]">{thread.user.college} · 信用 {thread.user.credit}</p>
          </div>
        </div>
      </header>

      <div className="border-b border-[#1f1b18]/8 bg-[#1f1b18] px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <TaskIcon task={{ emoji: thread.taskEmoji, title: thread.taskTitle, kind: 'random' }} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{thread.taskTitle}</p>
            <p className="text-[11px] text-white/55">已匹配聊天 · 头像/自由聊天权限可随时关闭</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#1f1b18]/10 bg-white/62 px-3 py-2 text-xs leading-5 text-[#6f655d]">
          <LockKeyhole size={14} />
          <span>默认只开放这段任务相关聊天。想换时间或 reveal 头像，建议先发请求。</span>
        </div>
        <div className="space-y-3">
          {msgs.map((msg, index) => (
            <div key={`${msg.text}-${index}`} className={msg.from === 'me' ? 'flex justify-end' : 'flex items-end gap-2'}>
              {msg.from === 'other' && <UserAvatar user={thread.user} size="sm" />}
              <div className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm leading-6 ${msg.from === 'me' ? 'bg-[#1f1b18] text-white rounded-br-md' : 'border border-[#1f1b18]/10 bg-white/78 rounded-bl-md'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-[#1f1b18]/8 bg-white/76 pb-safe-b pt-3 backdrop-blur-xl">
        <div className="mb-3 flex gap-2 overflow-x-auto px-4 no-scrollbar">
          {['到时候见', '提议 reveal 头像', '确认位置', '改时间'].map((action) => (
            <button key={action} type="button" className="shrink-0 rounded-full bg-[#f7f2eb] px-4 py-2 text-xs font-semibold text-[#514941]">
              {action}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && send()}
            placeholder="发一条和这次活动有关的消息"
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
