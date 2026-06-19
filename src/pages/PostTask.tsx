import { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'
import { me } from '../data'
import DadaMascot from '../components/DadaMascot'

// ── 脚本化的 AI 发任务对话（demo：mock，无真实后端） ──
// example 不是顶部静态模板，而是「哒哒」开场抛出的话术引子。
// 哒哒收集够信息后，在对话流里直接生成 request 预览卡片（未发送态）。

type ChatItem =
  | { from: 'ai'; text: string }
  | { from: 'me'; text: string }
  | { from: 'preview' } // 占位：渲染预览卡片

interface Seed {
  emoji: string
  title: string
  kind: Task['kind']
  text: string // 用户点击后作为「我」的发言
}

const seeds: Seed[] = [
  { emoji: '☕', title: '一起去喝杯咖啡', kind: 'random', text: '想去喝杯咖啡' },
  { emoji: '🎹', title: '琴房练德彪西', kind: 'skill', text: '在琴房练德彪西，想找人来听/合奏' },
  { emoji: '🎾', title: '双打缺一个补位', kind: 'fill', text: '打网球双打缺一个人' },
]

// 每个 seed 对应的追问脚本（问题 + 快捷选项 + 写入字段）
interface Step {
  q: string
  options: { label: string; apply: (d: Draft) => void }[]
}

interface Draft {
  emoji: string
  title: string
  kind: Task['kind']
  whenLabel: string
  place: string
  expected: number
  threshold?: string
}

function buildSteps(seed: Seed): Step[] {
  const common: Step[] = [
    {
      q: '好嘞～什么时候去？',
      options: [
        { label: '现在就去', apply: (d) => (d.whenLabel = '现在') },
        { label: '今天下午', apply: (d) => (d.whenLabel = '今天 15:00') },
        { label: '晚点再说', apply: (d) => (d.whenLabel = '今天 19:00') },
      ],
    },
    {
      q: '在哪儿碰头方便？',
      options: [
        { label: '一二九大楼', apply: (d) => (d.place = '一二九大楼咖啡角') },
        { label: '本部图书馆', apply: (d) => (d.place = '本部图书馆门口') },
        { label: '我宿舍楼下', apply: (d) => (d.place = '宿舍 12 栋楼下') },
      ],
    },
    {
      q: '想找几个人一起？',
      options: [
        { label: '就 1 个伴', apply: (d) => (d.expected = 2) },
        { label: '2-3 个', apply: (d) => (d.expected = 3) },
        { label: '随缘多少都行', apply: (d) => (d.expected = 4) },
      ],
    },
  ]

  if (seed.kind === 'skill') {
    // just-in-time profile building：技能类追问门槛
    return [
      {
        q: '在练哪首呀？要不要会乐器的来合奏？',
        options: [
          { label: '《月光》，想找钢琴/小提琴', apply: (d) => (d.threshold = '会钢琴 / 小提琴') },
          { label: '随便弹弹，来听就行', apply: (d) => (d.threshold = undefined) },
        ],
      },
      {
        q: '几点在琴房？',
        options: [
          { label: '现在', apply: (d) => (d.whenLabel = '现在') },
          { label: '今天 16:00', apply: (d) => (d.whenLabel = '今天 16:00') },
        ],
      },
      {
        q: '哪间琴房？',
        options: [
          { label: '艺术楼 305', apply: (d) => (d.place = '艺术楼 3F 琴房 305') },
          { label: '音乐系琴房', apply: (d) => (d.place = '音乐系 B 区琴房') },
        ],
      },
    ]
  }

  if (seed.kind === 'fill') {
    return [
      {
        q: '你 profile 里写了网球，能透露下水平嘛？有人在找 3.0+ 的局～',
        options: [
          { label: '我 3.5，找 3.0 以上的', apply: (d) => (d.threshold = '网球 3.0+') },
          { label: '休闲水平，开心就好', apply: (d) => (d.threshold = '休闲局') },
        ],
      },
      {
        q: '哪片场子？',
        options: [
          { label: '南区网球场', apply: (d) => (d.place = '南区网球场 2 号场') },
          { label: '北区网球场', apply: (d) => (d.place = '北区网球场') },
        ],
      },
      {
        q: '还差几个人？',
        options: [
          { label: '就差 1 个', apply: (d) => (d.expected = 4) },
          { label: '差 2 个', apply: (d) => (d.expected = 4) },
        ],
      },
    ]
  }

  return common
}

export default function PostTask({
  onClose,
  onPublished,
}: {
  onClose: () => void
  onPublished: () => void
}) {
  const [chat, setChat] = useState<ChatItem[]>([
    {
      from: 'ai',
      text: '想搭点什么？随便说一句就行～ 比如「一起去喝杯咖啡」，或者「琴房练德彪西，会伴奏的来」，也可以是「双打缺个 3.0 的」',
    },
  ])
  const [seed, setSeed] = useState<Seed | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [stepIdx, setStepIdx] = useState(0)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [done, setDone] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('') // 自由输入框内容
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' })
  }, [chat, typing])

  function pushAI(text: string) {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setChat((c) => [...c, { from: 'ai', text }])
    }, 600)
  }

  function startSeed(s: Seed) {
    const st = buildSteps(s)
    const d: Draft = {
      emoji: s.emoji,
      title: s.title,
      kind: s.kind,
      whenLabel: '现在',
      place: '',
      expected: 2,
    }
    setSeed(s)
    setSteps(st)
    setStepIdx(0)
    setDraft(d)
    setChat((c) => [...c, { from: 'me', text: s.text }])
    pushAI(st[0].q)
  }

  function chooseOption(opt: Step['options'][number], label: string) {
    advance(label, opt.apply)
  }

  // 推进一步：写入草稿字段 + 落对话 + 抛下一问 / 生成预览
  function advance(label: string, apply: (d: Draft) => void) {
    if (!draft) return
    const d = { ...draft }
    apply(d)
    setDraft(d)
    setChat((c) => [...c, { from: 'me', text: label }])
    const next = stepIdx + 1
    if (next < steps.length) {
      setStepIdx(next)
      pushAI(steps[next].q)
    } else {
      // 收集完毕 → 生成预览卡片
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setChat((c) => [
          ...c,
          { from: 'ai', text: '帮你写好啦，看看要不要改～' },
          { from: 'preview' },
        ])
        setDone(true)
      }, 800)
    }
  }

  // 开场自由输入：用户自己描述想搭什么 → 起一个自定义草稿
  function startFree(text: string) {
    startSeed({ emoji: '✨', title: text, kind: 'random', text })
  }

  // 追问环节的自由输入：按当前问题把文本写进对应字段
  function freeAnswer(text: string) {
    if (!draft) return
    const q = steps[stepIdx]?.q ?? ''
    advance(text, (d) => {
      if (/什么时候|几点/.test(q)) d.whenLabel = text
      else if (/哪|碰头|场子|琴房|场/.test(q)) d.place = text
      else if (/几个人|几个|差几/.test(q)) {
        const n = parseInt(text.replace(/[^\d]/g, ''), 10)
        if (!isNaN(n)) d.expected = n + 1
      } else d.threshold = text
    })
  }

  // 统一的发送：开场起草稿；追问中作为自由回答
  function sendInput() {
    const v = input.trim()
    if (!v || typing) return
    setInput('')
    if (!seed) startFree(v)
    else if (curStep) freeAnswer(v)
  }

  const curStep = seed && !done ? steps[stepIdx] : null

  return (
    <div className="flex-1 flex flex-col bg-cream overflow-hidden">
      {/* 顶部 */}
      <header className="px-4 pt-safe-t pb-3 flex items-center gap-3 bg-white shadow-soft z-10">
        <button onClick={onClose} className="text-mute text-xl w-8">
          ✕
        </button>
        <div className="flex items-center gap-2">
          <DadaMascot size={32} />
          <div>
            <div className="font-bold text-ink text-sm leading-tight">哒哒</div>
            <div className="text-[11px] text-mute leading-tight">帮你搭一个</div>
          </div>
        </div>
      </header>

      {/* 对话区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        {chat.map((m, i) => {
          if (m.from === 'preview')
            return draft ? <PreviewCard key={i} draft={draft} /> : null
          if (m.from === 'ai')
            return (
              <div key={i} className="flex items-end gap-2 animate-slide-up">
                <DadaMascot size={28} />
                <div className="max-w-[78%] bg-white rounded-2xl rounded-bl-md px-4 py-2.5 shadow-soft text-sm text-ink leading-relaxed">
                  {m.text}
                </div>
              </div>
            )
          return (
            <div key={i} className="flex justify-end animate-slide-up">
              <div className="max-w-[78%] bg-brand text-white rounded-2xl rounded-br-md px-4 py-2.5 shadow-soft text-sm leading-relaxed">
                {m.text}
              </div>
            </div>
          )
        })}
        {typing && (
          <div className="flex items-end gap-2">
            <DadaMascot size={28} />
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-soft flex gap-1">
              <Dot /> <Dot d={0.15} /> <Dot d={0.3} />
            </div>
          </div>
        )}
      </div>

      {/* 底部交互区 */}
      <div className="px-4 pb-safe-b pt-3 bg-white shadow-[0_-8px_24px_rgba(255,138,61,0.08)]">
        {!seed && (
          <div className="flex flex-col gap-2">
            {seeds.map((s) => (
              <button
                key={s.title}
                onClick={() => startSeed(s)}
                className="flex items-center gap-3 bg-cream rounded-field px-4 py-3 active:scale-[0.98] transition-transform text-left"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-sm font-medium text-ink">{s.title}</span>
              </button>
            ))}
          </div>
        )}

        {curStep && (
          <div className="flex flex-wrap gap-2">
            {curStep.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => chooseOption(opt, opt.label)}
                className="px-4 py-2 rounded-full bg-brand-soft text-brand font-medium text-sm active:scale-95 transition-transform"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {done && (
          <button
            onClick={onPublished}
            className="w-full bg-brand text-white font-bold py-3.5 rounded-full shadow-float active:animate-pop"
          >
            发出去！哒哒帮你找合适的人 →
          </button>
        )}
      </div>
    </div>
  )
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-mute animate-float-bubble"
      style={{ animationDelay: `${d}s` }}
    />
  )
}

function PreviewCard({ draft }: { draft: Draft }) {
  return (
    <div className="ml-9 animate-slide-up">
      <div className="bg-white rounded-card shadow-float p-4 border-2 border-dashed border-brand/40">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-soft text-brand font-medium">
            预览 · 还没发
          </span>
        </div>
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-soft grid place-items-center text-2xl shrink-0">
            {draft.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ink">{draft.title}</h3>
            <p className="text-xs text-mute mt-0.5">
              {me.emoji} {me.grade} · 发起
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip>🕘 {draft.whenLabel}</Chip>
          <Chip>📍 {draft.place || '待定'}</Chip>
          <Chip>👥 想找 {draft.expected - 1} 个伴</Chip>
          {draft.threshold && <Chip>🎯 {draft.threshold}</Chip>}
        </div>
      </div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] bg-cream text-mute">
      {children}
    </span>
  )
}
