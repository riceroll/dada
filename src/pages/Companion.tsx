import { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'
import DadaMascot from '../components/DadaMascot'
import { InfoGlyph, TaskIcon } from '../components/IconKit'

interface Msg {
  from: 'ai' | 'me'
  text: string
}

// 哒哒主动抛的「卡片」：托底 / 引导发活动 / profile 补全 / 反馈
interface ProactiveCard {
  iconTask: Pick<Task, 'emoji' | 'title' | 'kind'>
  title: string
  desc: string
  cta: string
}

const cards: ProactiveCard[] = [
  {
    iconTask: { emoji: '', title: '图书馆', kind: 'random' },
    title: '你昨天发的「图书馆」还没人接',
    desc: '那个时间段附近人不多，要我帮你改到 16:00 再广播一次吗？',
    cta: '帮我改时间',
  },
  {
    iconTask: { emoji: '🎾', title: '网球', kind: 'fill' },
    title: '想补全一下你的网球水平吗',
    desc: '最近有好几个 3.0+ 的局，填了水平我能帮你优先匹配。',
    cta: '我是 3.5',
  },
  {
    iconTask: { emoji: '☕', title: '喝杯咖啡', kind: 'random' },
    title: '下午容易困？',
    desc: '要不要我现在帮你搭一个「去喝杯咖啡」，附近有 2 个人也在犯困。',
    cta: '搭一个',
  },
]

// 哒哒的快捷回应
const quicks = ['今天有点无聊', '帮我想个活动', '附近有什么好玩的', '我想认识新朋友']

const scripted: Record<string, string> = {
  今天有点无聊: '那正好～ 我看你标了「摄影」，南区银杏刚黄，要不要发个「一起去拍银杏」？我帮你写好。',
  帮我想个活动: '看你常去四平路本部～ 这几个都低门槛：☕ 喝杯咖啡 / 🧋 顺路带奶茶 / 🚶 散步去图书馆。想发哪个？',
  附近有什么好玩的: '现在周围在搭的有：网球补位、琴房合奏、操场夜跑。你对哪个有点心动？',
  我想认识新朋友: '懂～ 那建议你主动发一个，比被动等响应率高很多。从最轻的「喝咖啡」开始最不尴尬，我陪你写。',
}

export default function Companion({
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
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setMsgs((m) =>
        m.length > 0
          ? m
          : [{ from: 'ai', text: '嘿，今天过得怎么样？想搭点什么我随时帮你～' }],
      )
    }, 20000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' })
  }, [msgs, typing])

  function reply(meText: string) {
    setMsgs((m) => [...m, { from: 'me', text: meText }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const ans =
        scripted[meText] ?? '收到～ 这个我先记下了，等有合适的活动或搭子我第一时间叫你。'
      setMsgs((m) => [...m, { from: 'ai', text: ans }])
    }, 700)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-cream">
      {/* 顶部 */}
      <header className="px-5 pt-safe-t pb-4 bg-gradient-to-b from-brand-soft/60 to-cream">
        <div className="flex items-center gap-3">
          <DadaMascot size={48} bouncing />
          <div>
            <div className="font-extrabold text-ink text-lg">哒哒</div>
            <div className="text-xs text-mute">陪你的第 12 天 · 越来越懂你</div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-3">
        {/* 哒哒主动卡片 */}
        <p className="text-xs text-mute px-1">哒哒帮你留意到</p>
        {cards.map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-card shadow-soft p-4 flex gap-3 animate-slide-up"
          >
            <TaskIcon task={c.iconTask} size="sm" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-ink text-sm">{c.title}</h3>
              <p className="text-xs text-mute mt-1 leading-relaxed">{c.desc}</p>
              <button
                onClick={c.cta === '搭一个' ? onPost : () => reply(c.cta)}
                className="mt-2.5 bg-brand text-white font-bold text-xs px-4 py-1.5 rounded-full active:animate-pop"
              >
                {c.cta}
              </button>
            </div>
          </div>
        ))}

        {/* 对话 */}
        <div className="pt-2 border-t border-mute/10 mt-2">
          <p className="text-xs text-mute px-1 pt-2 pb-1">和哒哒聊聊</p>
        </div>
        {recommendedTask && (
          <div className="flex items-end gap-2 animate-slide-up">
            <DadaMascot size={26} />
            <div className="max-w-[84%] space-y-2">
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2.5 shadow-soft text-sm text-ink leading-relaxed">
                有个同学现在正要去买煎饼果子，南门新开的那家，有兴趣吗！
              </div>
              <button
                onClick={() => onOpenTask?.(recommendedTask)}
                className="w-full text-left bg-white rounded-2xl rounded-bl-md shadow-float p-3 border border-brand/15 active:scale-[0.98] transition-transform overflow-hidden relative"
              >
                <span className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-soft/70" />
                <div className="relative z-10 flex gap-3">
                  <TaskIcon task={recommendedTask} size="md" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-brand mb-1">附近推荐</div>
                    <h3 className="font-bold text-ink text-sm truncate">{recommendedTask.title}</h3>
                    <p className="text-xs text-mute mt-1 leading-relaxed">
                      <InfoGlyph name="place">{recommendedTask.place}</InfoGlyph> · {recommendedTask.distanceM}m · 剩 {recommendedTask.durationMin} 分钟
                    </p>
                    <div className="mt-2 text-xs font-bold text-brand">看看这个 →</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
        {msgs.map((m, i) =>
          m.from === 'ai' ? (
            <div key={i} className="flex items-end gap-2 animate-slide-up">
              <DadaMascot size={26} />
              <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-4 py-2.5 shadow-soft text-sm text-ink leading-relaxed">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end animate-slide-up">
              <div className="max-w-[80%] bg-brand text-white rounded-2xl rounded-br-md px-4 py-2.5 shadow-soft text-sm leading-relaxed">
                {m.text}
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="flex items-end gap-2">
            <DadaMascot size={26} />
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-soft flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-mute animate-float-bubble" />
              <span className="w-1.5 h-1.5 rounded-full bg-mute animate-float-bubble" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-mute animate-float-bubble" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
      </div>

      {/* 底部：快捷 + 输入 */}
      <div className="bg-white shadow-[0_-8px_24px_rgba(255,138,61,0.08)]">
        <div className="px-3 pt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {quicks.map((q) => (
            <button
              key={q}
              onClick={() => reply(q)}
              className="shrink-0 px-3.5 py-1.5 rounded-full bg-cream text-ink text-xs font-medium active:scale-95 transition-transform"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="px-3 pb-safe-b pt-2 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && input.trim() && reply(input.trim())}
            placeholder="和哒哒说点什么…"
            className="flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-mute"
          />
          <button
            onClick={() => input.trim() && reply(input.trim())}
            className="bg-brand text-white w-10 h-10 rounded-full grid place-items-center shrink-0 active:animate-pop"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
