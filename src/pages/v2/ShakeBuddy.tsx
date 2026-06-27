import { useState } from 'react'
import { ArrowLeft, CalendarClock, MapPin, Sparkles, Users } from 'lucide-react'
import type { ActivityTaskV2 } from '../../types/profile'

interface ShakeBuddyProps {
  onClose: () => void
  onPublished: (task: ActivityTaskV2) => void
}

const activityTypes = ['喝咖啡', '自习', '运动', '吃饭', '看展', '音乐', '随便走走']
const timeWindows = ['现在', '今晚', '明天白天', '48 小时内']

export default function ShakeBuddy({ onClose, onPublished }: ShakeBuddyProps) {
  const [activity, setActivity] = useState(activityTypes[0])
  const [timeWindow, setTimeWindow] = useState(timeWindows[1])
  const [place, setPlace] = useState('学校附近')
  const [groupSize, setGroupSize] = useState(2)
  const [prompt, setPrompt] = useState('想找一个不太尬、可以一起把这件小事做掉的人。')

  function publish() {
    onPublished({
      id: `draft-${Date.now()}`,
      title: `${timeWindow}想找人一起${activity}`,
      activityNodeId: activityNodeFromLabel(activity),
      hostProfileId: 'me',
      hostAlias: '你发起的',
      hostPhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
      hostMatchReason: '这是你刚刚摇出来的活动。别人会先看到模糊头像和这句邀请，不会看到完整资料。',
      place,
      fuzzyArea: place.includes('南') ? '南区附近' : place.includes('图书馆') ? '教学区' : '校园附近',
      startsAtLabel: timeWindow,
      expiresAtLabel: timeWindow === '现在' ? '剩 45 分钟' : '48 小时内消失',
      expiresInSec: timeWindow === '现在' ? 45 * 60 : 48 * 60 * 60,
      desiredGroupSize: groupSize,
      currentGroupSize: 1,
      desiredPersonHint: prompt,
      compatibilityReason: `哒哒会把这张卡优先推给附近也想${activity}、时间窗口相近的人。`,
      locked: false,
      mapX: 52,
      mapY: 55,
    })
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[#f7f2eb] px-5 pb-safe-b pt-safe-t text-[#1f1b18]">
      <header className="mb-6 flex items-center justify-between">
        <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/70">
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">Shake a buddy</p>
        <div className="h-11 w-11" />
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-6 pb-4">
          <div className="space-y-3">
            <h1 className="text-[38px] font-semibold leading-[1.03] tracking-[-0.03em]">把一个模糊念头，摇成一张任务卡。</h1>
            <p className="text-[15px] leading-7 text-[#5f5750]">你可以认真填，也可以先写一句话。哒哒会把它整理成附近的人能接住的邀请。</p>
          </div>

          <Card label="想做什么" icon={<Sparkles size={16} />}>
            <ChipGrid items={activityTypes} value={activity} onChange={setActivity} />
          </Card>

          <Card label="什么时候" icon={<CalendarClock size={16} />}>
            <ChipGrid items={timeWindows} value={timeWindow} onChange={setTimeWindow} />
          </Card>

          <Card label="在哪里" icon={<MapPin size={16} />}>
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              className="h-12 w-full rounded-2xl border border-[#1f1b18]/10 bg-[#f7f2eb] px-4 text-sm outline-none"
            />
          </Card>

          <Card label="希望最后几个人" icon={<Users size={16} />}>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 6].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setGroupSize(count)}
                  className={`h-11 rounded-2xl text-sm font-semibold ${groupSize === count ? 'bg-[#1f1b18] text-white' : 'bg-[#f7f2eb] text-[#5f5750]'}`}
                >
                  {count} 人
                </button>
              ))}
            </div>
          </Card>

          <Card label="一句话补充" icon={<Sparkles size={16} />}>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-2xl border border-[#1f1b18]/10 bg-[#f7f2eb] px-4 py-3 text-sm leading-6 outline-none"
            />
          </Card>

          <article className="rounded-[30px] border border-[#1f1b18]/10 bg-[#1f1b18] p-5 text-white shadow-[0_24px_60px_rgba(31,27,24,0.18)]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Draft</p>
            <h2 className="text-2xl font-semibold leading-tight">{timeWindow}想找人一起{activity}</h2>
            <p className="mt-3 text-sm leading-6 text-white/68">{place} · 目标 {groupSize} 人 · {prompt}</p>
          </article>
        </div>
      </section>

      <footer className="pt-3">
        <button
          type="button"
          onClick={publish}
          className="h-14 w-full rounded-full bg-[#1f1b18] text-[15px] font-semibold text-white shadow-[0_18px_45px_rgba(31,27,24,0.2)]"
        >
          发布到附近雷达
        </button>
      </footer>
    </main>
  )
}

function activityNodeFromLabel(label: string) {
  if (label.includes('咖啡')) return 'coffee'
  if (label.includes('自习')) return 'library-study'
  if (label.includes('运动')) return 'running'
  if (label.includes('音乐')) return 'music'
  if (label.includes('看展')) return 'exhibitions'
  if (label.includes('走')) return 'city-walk'
  return 'food-drink'
}

function Card({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[#1f1b18]/10 bg-white/72 p-4 shadow-[0_18px_45px_rgba(31,27,24,0.07)]">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#3a332e]">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </section>
  )
}

function ChipGrid({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onChange(item)}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${value === item ? 'bg-[#1f1b18] text-white' : 'bg-[#f7f2eb] text-[#5f5750]'}`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
