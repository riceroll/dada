import { useEffect, useRef, useState } from 'react'
import DadaMascot from '../components/DadaMascot'

// 哒哒聊天式 onboarding —— 不填表，在对话里自然收集初始 profile
// 每一步：哒哒说一句 → 用户从快捷选项里选（可多选 tag）→ 落到 profile

interface Step {
  q: string
  options: string[]
  multi?: boolean
  key: 'campus' | 'identity' | 'tags' | 'vibe'
}

const steps: Step[] = [
  {
    key: 'campus',
    q: '嗨，我是哒哒～ 以后帮你找搭子的就是我！先问一下，你平时主要在哪个校区出没呀？',
    options: ['四平路本部', '嘉定校区', '沪西校区', '沪北校区'],
  },
  {
    key: 'identity',
    q: '了解～ 你是大几的呀？',
    options: ['大一', '大二', '大三', '大四', '研究生'],
  },
  {
    key: 'tags',
    q: '平时喜欢搞点什么？多选几个，以后我好帮你匹配同好（也可以之后慢慢补）',
    options: ['☕ 咖啡', '🎾 网球', '🏃 跑步', '🎹 音乐', '📷 摄影', '📚 自习', '🧋 奶茶', '🎮 游戏', '🥾 citywalk'],
    multi: true,
  },
  {
    key: 'vibe',
    q: '最后一个～ 你更想用搭搭来干嘛？',
    options: ['找人一起做事', '认识新朋友', '纯搭子不尬聊', '恋爱', '随便试试'],
    multi: true,
  },
]

type ChatItem = { from: 'ai'; text: string } | { from: 'me'; text: string }

export default function Onboarding({ onDone }: { onDone: (tags: string[]) => void }) {
  const [chat, setChat] = useState<ChatItem[]>([])
  const [stepIdx, setStepIdx] = useState(-1) // -1 = 欢迎动画
  const [picked, setPicked] = useState<string[]>([]) // 当前多选暂存
  const [tags, setTags] = useState<string[]>([])
  const [typing, setTyping] = useState(false)
  const [finished, setFinished] = useState(false)
  const [input, setInput] = useState('') // 自由输入框内容
  const [extra, setExtra] = useState<string[]>([]) // 多选步骤里用户自己补充的标签
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' })
  }, [chat, typing])

  // 启动：哒哒打第一句
  useEffect(() => {
    const t = setTimeout(() => {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setChat([{ from: 'ai', text: steps[0].q }])
        setStepIdx(0)
      }, 700)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  function pushAI(text: string) {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setChat((c) => [...c, { from: 'ai', text }])
    }, 650)
  }

  function next(meText: string) {
    setChat((c) => [...c, { from: 'me', text: meText }])
    const ni = stepIdx + 1
    if (ni < steps.length) {
      setStepIdx(ni)
      pushAI(steps[ni].q)
    } else {
      // 收尾
      setStepIdx(steps.length)
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setChat((c) => [
          ...c,
          {
            from: 'ai',
            text: '记下啦！这些先够了～ 之后你每搭一次，我都会更懂你一点。走，去看看周围有谁在搭👀',
          },
        ])
        setFinished(true)
      }, 800)
    }
  }

  function choose(opt: string) {
    next(opt)
  }

  function toggleTag(opt: string) {
    setPicked((p) => (p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]))
  }

  function confirmTags() {
    const clean = picked.map((t) => t.replace(/^\S+\s/, '')) // 去掉 emoji 前缀存为 tag
    if (cur?.key === 'tags') setTags(clean)
    next(picked.join('、') || '先跳过')
    setPicked([])
    setExtra([])
  }

  // 自由输入：单选步骤直接当作回答推进；多选步骤当作自定义标签
  function sendInput() {
    const v = input.trim()
    if (!v || typing) return
    setInput('')
    if (cur?.multi) {
      setExtra((e) => (e.includes(v) ? e : [...e, v]))
      setPicked((p) => (p.includes(v) ? p : [...p, v]))
    } else {
      next(v)
    }
  }

  const cur = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null

  return (
    <div className="flex-1 flex flex-col bg-cream overflow-hidden">
      {/* 顶部 */}
      <header className="px-5 pt-safe-t pb-3 flex items-center gap-3">
        <DadaMascot size={36} bouncing />
        <div>
          <div className="font-extrabold text-ink">哒哒</div>
          <div className="text-[11px] text-mute">花 30 秒认识一下～</div>
        </div>
      </header>

      {/* 对话 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-3">
        {chat.map((m, i) =>
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

      {/* 底部交互 */}
      <div className="px-4 pb-safe-b pt-3 bg-white shadow-[0_-8px_24px_rgba(255,138,61,0.08)]">
        {cur && !cur.multi && !typing && (
          <div>
            <div className="flex flex-wrap gap-2">
              {cur.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className="px-4 py-2 rounded-full bg-brand-soft text-brand font-medium text-sm active:scale-95 transition-transform"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendInput()}
                placeholder="或者直接打字告诉我～"
                className="flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-mute"
              />
              <button
                onClick={sendInput}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-lg active:scale-90 transition-transform shrink-0 disabled:opacity-40"
              >
                ↑
              </button>
            </div>
          </div>
        )}

        {cur && cur.multi && !typing && (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[...cur.options, ...extra].map((opt) => {
                const on = picked.includes(opt)
                return (
                  <button
                    key={opt}
                    onClick={() => toggleTag(opt)}
                    className={`px-3.5 py-2 rounded-full font-medium text-sm transition-all active:scale-95 ${
                      on ? 'bg-brand text-white shadow-soft' : 'bg-cream text-ink'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            <div className="mb-3 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendInput()}
                placeholder={cur.key === 'tags' ? '想补充别的爱好？打出来加进去～' : '还想补充什么？打出来加进去～'}
                className="flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-mute"
              />
              <button
                onClick={sendInput}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-lg active:scale-90 transition-transform shrink-0 disabled:opacity-40"
              >
                ＋
              </button>
            </div>
            <button
              onClick={confirmTags}
              className="w-full bg-brand text-white font-bold py-3 rounded-full shadow-soft active:animate-pop disabled:opacity-50"
            >
              {picked.length > 0 ? `选好了（${picked.length}）` : '先跳过，之后再说'}
            </button>
          </div>
        )}

        {finished && (
          <button
            onClick={() => onDone(tags)}
            className="w-full bg-brand text-white font-bold py-3.5 rounded-full shadow-float active:animate-pop"
          >
            进入搭搭 →
          </button>
        )}
      </div>
    </div>
  )
}
