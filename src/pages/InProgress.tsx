import { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'
import { me } from '../data'
import DadaMascot from '../components/DadaMascot'

interface Msg {
  from: 'ai' | 'me' | 'other'
  text: string
}

export default function InProgress({
  task,
  onFinish,
}: {
  task: Task
  onFinish: () => void
}) {
  // 两人逐渐靠近的实时定位（10m 精度）
  const [gap, setGap] = useState(120) // 相距米数
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'ai',
      text: `你俩都标了「${task.host.tags[0]}」～ 可以问问对方平时常去哪家/常练什么，破个冰😉`,
    },
  ])
  const [input, setInput] = useState('')
  const [ending, setEnding] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setGap((g) => (g > 10 ? Math.max(10, g - 12) : g))
    }, 900)
    return () => clearInterval(id)
  }, [])

  // 对方在靠近时自动发来一句
  useEffect(() => {
    if (gap === 40) {
      setTimeout(
        () =>
          setMsgs((m) => [
            ...m,
            { from: 'other', text: '看到你啦！我穿橙色卫衣，往喷泉这边走～' },
          ]),
        300,
      )
    }
  }, [gap])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' })
  }, [msgs])

  function send() {
    if (!input.trim()) return
    setMsgs((m) => [...m, { from: 'me', text: input.trim() }])
    setInput('')
  }

  // 两人头像位置随 gap 收敛
  const t = 1 - (gap - 10) / 110 // 0→1
  const meX = 28
  const otherX = 72 - t * 30
  const meXp = 28 + t * 26

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-cream">
      {/* ── 上 2/3：实时定位地图 ── */}
      <div className="relative h-[58%] bg-[#FBEFE2] overflow-hidden">
        {/* 顶栏 */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-safe-t px-4 pb-3 flex items-center justify-between bg-gradient-to-b from-cream/95 to-transparent">
          <div>
            <div className="text-xs text-mute">正在搭 · {task.emoji} {task.title}</div>
            <div className="font-bold text-ink text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-task-skill animate-pulse" />
              双方定位中 · 相距 {gap}m
            </div>
          </div>
          <button
            onClick={() => setEnding(true)}
            className="bg-white text-brand font-bold text-sm px-4 py-2 rounded-full shadow-soft active:scale-95 transition-transform"
          >
            搭完了
          </button>
        </div>

        {/* 地块/道路 */}
        <div className="absolute inset-0">
          <div className="absolute left-0 right-0 top-1/2 h-6 bg-white/70 -rotate-2" />
          <div className="absolute top-0 bottom-0 left-1/2 w-6 bg-white/70" />
          <div className="absolute left-10 top-10 w-40 h-40 rounded-[40px] bg-[#F4E2CE] rotate-6" />
          <div className="absolute right-6 bottom-10 w-44 h-32 rounded-[40px] bg-[#E9EDDD]" />
          <div className="absolute left-[46%] top-[40%] text-2xl">⛲</div>
        </div>

        {/* 连线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={`${meXp}%`}
            y1="62%"
            x2={`${otherX}%`}
            y2="40%"
            stroke="#FF8A3D"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            opacity="0.6"
          />
        </svg>

        {/* 我 */}
        <Pin x={meXp} y={62} label="你" color="#FF8A3D" emoji={me.emoji} />
        {/* 对方 */}
        <Pin
          x={otherX}
          y={40}
          label={task.host.avatarHidden ? '搭子' : task.host.name}
          color="#3DBFA0"
          emoji={task.host.emoji}
        />

        {gap <= 10 && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-ink text-white text-xs px-4 py-2 rounded-full shadow-float animate-slide-up">
            🎉 你们碰头啦，头像已互相揭晓
          </div>
        )}
      </div>

      {/* ── 下 1/3：对话框 ── */}
      <div className="flex-1 flex flex-col bg-cream min-h-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-2.5">
          {msgs.map((m, i) => {
            if (m.from === 'ai')
              return (
                <div key={i} className="flex items-start gap-2 animate-slide-up">
                  <DadaMascot size={26} />
                  <div className="max-w-[80%] bg-brand-soft/60 rounded-2xl rounded-bl-md px-3.5 py-2 text-[13px] text-ink leading-relaxed">
                    <span className="text-[10px] text-brand font-bold block mb-0.5">
                      哒哒 · 破冰弹药
                    </span>
                    {m.text}
                  </div>
                </div>
              )
            if (m.from === 'me')
              return (
                <div key={i} className="flex justify-end animate-slide-up">
                  <div className="max-w-[80%] bg-brand text-white rounded-2xl rounded-br-md px-3.5 py-2 text-sm">
                    {m.text}
                  </div>
                </div>
              )
            return (
              <div key={i} className="flex items-end gap-2 animate-slide-up">
                <div className="w-7 h-7 rounded-full bg-task-skill/20 grid place-items-center text-sm">
                  {task.host.emoji}
                </div>
                <div className="max-w-[80%] bg-white rounded-2xl rounded-bl-md px-3.5 py-2 text-sm text-ink shadow-soft">
                  {m.text}
                </div>
              </div>
            )
          })}
        </div>

        {/* 输入栏 */}
        <div className="px-3 pb-safe-b pt-2 bg-white flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="说点什么…"
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

      {/* 搭完了 → 沉淀 */}
      {ending && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-black/40 animate-fade-in px-8">
          <div className="bg-white rounded-card p-6 w-full text-center animate-slide-up">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-lg font-extrabold text-ink">搭完了！</h2>
            <p className="text-sm text-mute mt-1">
              {task.host.avatarHidden ? task.host.emoji + ' 这位搭子' : task.host.name}
              已加入你的「搭搭列表」
            </p>
            <div className="mt-4 bg-cream rounded-field p-3 flex items-center gap-2 text-left">
              <DadaMascot size={30} />
              <p className="text-xs text-ink/80">
                哒哒：这次搭得怎么样？给个反馈我下次帮你约更合适的～
              </p>
            </div>
            <button
              onClick={onFinish}
              className="mt-4 w-full bg-brand text-white font-bold py-3 rounded-full active:animate-pop"
            >
              认识了，回首页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Pin({
  x,
  y,
  label,
  color,
  emoji,
}: {
  x: number
  y: number
  label: string
  color: string
  emoji: string
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex flex-col items-center"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div
        className="w-11 h-11 rounded-full grid place-items-center text-lg bg-white shadow-float border-2"
        style={{ borderColor: color }}
      >
        {emoji}
      </div>
      <span
        className="mt-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    </div>
  )
}
