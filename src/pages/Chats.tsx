import { useState } from 'react'
import type { ChatThread } from '../types'
import { chatThreads } from '../data'
import ChatRoom from './ChatRoom'

export default function Chats() {
  const [open, setOpen] = useState<ChatThread | null>(null)

  if (open) return <ChatRoom thread={open} onBack={() => setOpen(null)} />

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="px-5 pt-safe-t pb-3 bg-cream/80 backdrop-blur">
        <h1 className="text-lg font-extrabold text-ink">消息</h1>
        <p className="text-xs text-mute mt-0.5">每段聊天都从一次真实的搭子开始</p>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-24">
        {chatThreads.map((t) => (
          <button
            key={t.id}
            onClick={() => setOpen(t)}
            className="w-full flex gap-3 px-2 py-3 rounded-2xl active:bg-white transition-colors text-left"
          >
            {/* 头像 */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-brand-soft grid place-items-center text-2xl">
                {t.user.avatarHidden ? t.user.emoji : t.user.name[0]}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-soft grid place-items-center text-xs">
                {t.taskEmoji}
              </span>
            </div>
            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink truncate">
                  {t.user.avatarHidden ? t.user.emoji + ' ' + t.user.grade + '同学' : t.user.name}
                </span>
                <span className="text-[11px] text-mute shrink-0 ml-2">{t.lastTimeLabel}</span>
              </div>
              {/* 任务记录上下文 */}
              <div className="mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream text-[11px] text-mute">
                {t.taskEmoji} 一起{t.taskTitle} · {t.metAtLabel}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-mute truncate">{t.lastMsg}</span>
                {t.unread > 0 && (
                  <span className="shrink-0 ml-2 min-w-5 h-5 px-1.5 rounded-full bg-brand text-white text-[11px] font-bold grid place-items-center">
                    {t.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
