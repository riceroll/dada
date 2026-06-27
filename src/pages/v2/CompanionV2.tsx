import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Send, Sparkles, WandSparkles } from 'lucide-react'
import type { Task } from '../../types'
import { TaskIcon } from '../../components/IconKit'

interface Msg {
  from: 'ai' | 'me'
  text: string
}

const quicks = ['帮我摇一个低压力活动', '今晚适合见什么人', '我想认识新朋友', '帮我补全资料']

const replies: Record<string, string> = {
  帮我摇一个低压力活动: '可以。你现在的资料更适合从咖啡、自习、短散步开始，不需要太多开场白。',
  今晚适合见什么人: '今晚更适合找一个时间稳定、活动明确的人。太开放的聊天局我先帮你压低权重。',
  我想认识新朋友: '那就别从“认识”开始，从一件小事开始。人比较容易在具体事情里自然一点。',
  帮我补全资料: '你还缺运动水平、喜欢的音乐现场、和想认识的人类型。我会在相关活动出现时顺手问。',
}

export default function CompanionV2({
  onPost,
  recommendedTask,
  onOpenTask,
}: {
  onPost: () => void
  recommendedTask?: Task | null
  onOpenTask?: (task: Task) => void
}) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMsgs((current) =>
        current.length > 0
          ? current
          : [{ from: 'ai', text: '我在。今天先别想“社交”，想想你现在愿意出门做哪件小事。' }],
      )
    }, 12000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' })
  }, [msgs])

  function reply(text: string) {
    setMsgs((current) => [...current, { from: 'me', text }])
    setInput('')
    window.setTimeout(() => {
      setMsgs((current) => [...current, { from: 'ai', text: replies[text] ?? '记下了。我会把这个偏好折进之后的推荐里。' }])
    }, 520)
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f2eb] text-[#1f1b18]">
      <header className="px-5 pb-4 pt-safe-t">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[26px] bg-[#1f1b18] text-white shadow-[0_20px_55px_rgba(31,27,24,0.18)]">
            <div className="h-9 w-9 rounded-full bg-[radial-gradient(circle_at_35%_25%,#fff7df,#b9d5c2_48%,#df8f83_82%)]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Dada copilot</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.02em]">哒哒</h1>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 no-scrollbar">
        <div className="space-y-3 pb-4">
          {recommendedTask && (
            <button
              type="button"
              onClick={() => onOpenTask?.(recommendedTask)}
              className="w-full rounded-[30px] border border-[#1f1b18]/10 bg-white/78 p-4 text-left shadow-[0_20px_55px_rgba(31,27,24,0.1)]"
            >
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7e74]">
                <Sparkles size={14} />
                <span>刚刚替你捞到一个近的</span>
              </div>
              <div className="flex gap-3">
                <TaskIcon task={recommendedTask} size="md" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{recommendedTask.title}</h2>
                  <p className="mt-1 text-sm text-[#6f655d]">{recommendedTask.place} · {recommendedTask.distanceM}m · 剩 {recommendedTask.durationMin} 分钟</p>
                </div>
                <ArrowUpRight size={17} />
              </div>
            </button>
          )}

          <article className="rounded-[30px] border border-[#1f1b18]/10 bg-white/72 p-4 shadow-[0_18px_45px_rgba(31,27,24,0.07)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <WandSparkles size={16} />
              <span>今天的匹配判断</span>
            </div>
            <p className="text-sm leading-6 text-[#5f5750]">你的资料现在偏向低压力、短时长、活动明确的局。哒哒会先过滤掉“只想尬聊”的邀请。</p>
            <button type="button" onClick={onPost} className="mt-4 rounded-full bg-[#1f1b18] px-4 py-2 text-xs font-semibold text-white">
              摇一个更准的活动
            </button>
          </article>

          {msgs.map((msg, index) => (
            <div key={`${msg.text}-${index}`} className={msg.from === 'me' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`max-w-[82%] rounded-[22px] px-4 py-3 text-sm leading-6 ${msg.from === 'me' ? 'bg-[#1f1b18] text-white rounded-br-md' : 'border border-[#1f1b18]/10 bg-white/78 text-[#3a332e] rounded-bl-md'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-[#1f1b18]/8 bg-white/74 pb-safe-b pt-3 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {quicks.map((quick) => (
            <button key={quick} type="button" onClick={() => reply(quick)} className="shrink-0 rounded-full bg-[#f7f2eb] px-4 py-2 text-xs font-semibold text-[#514941]">
              {quick}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && input.trim() && reply(input.trim())}
            placeholder="告诉哒哒你想搭什么"
            className="h-12 flex-1 rounded-full border border-[#1f1b18]/10 bg-[#f7f2eb] px-4 text-sm outline-none placeholder:text-[#a89d94]"
          />
          <button type="button" onClick={() => input.trim() && reply(input.trim())} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1b18] text-white">
            <Send size={17} />
          </button>
        </div>
      </footer>
    </main>
  )
}
