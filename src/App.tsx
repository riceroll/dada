import { useRef, useState } from 'react'
import type { Task } from './types'
import type { ActivityTaskV2, GeneratedProfile, OnboardingProfileDraft } from './types/profile'
import PhoneFrame from './components/PhoneFrame'
import TabBar, { type Tab } from './components/TabBar'
import Onboarding from './pages/Onboarding'
import Splash from './pages/v2/Splash'
import OnboardingV2 from './pages/v2/OnboardingV2'
import ProfileReveal from './pages/v2/ProfileReveal'
import Explore from './pages/v2/Explore'
import ShakeBuddy from './pages/v2/ShakeBuddy'
import PendingV2 from './pages/v2/PendingV2'
import CompanionV2 from './pages/v2/CompanionV2'
import ChatsV2 from './pages/v2/ChatsV2'
import BuddiesV2 from './pages/v2/BuddiesV2'
import ProfileV2 from './pages/v2/ProfileV2'
import TaskDetailV2 from './pages/v2/TaskDetailV2'
import RequestMatchingV2 from './pages/v2/RequestMatchingV2'
import MatchChatV2 from './pages/v2/MatchChatV2'
import MeetingV2 from './pages/v2/MeetingV2'
import { pendingTasks, chatThreads, tasks } from './data'

// 覆盖在 Tab 之上的全屏流程
type Overlay =
  | 'shake'
  | 'v2-detail'
  | 'v2-request'
  | 'v2-match-chat'
  | 'v2-meeting'
  | 'profile'
  | null
type IntroScreen = 'splash' | 'onboarding' | 'reveal' | 'done'

export default function App() {
  const [onboarded, setOnboarded] = useState(false)
  const [introScreen, setIntroScreen] = useState<IntroScreen>('splash')
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [activeV2, setActiveV2] = useState<ActivityTaskV2 | null>(null)
  const [generatedProfile, setGeneratedProfile] = useState<GeneratedProfile | null>(null)
  const [dadaEventReady, setDadaEventReady] = useState(false)
  const [dadaEventOpened, setDadaEventOpened] = useState(false)
  const dadaEventTimer = useRef<number | null>(null)

  const pendingBadge = pendingTasks.filter((p) => p.expiresInSec > 0).length
  const chatBadge = chatThreads.reduce((n, c) => n + c.unread, 0)
  const dadaRecommendedTask: Task = {
    ...tasks[0],
    id: 'dada-rec-jianbing',
    emoji: '🥞',
    title: '去买煎饼果子',
    desc: '南门新开的那家，刚好有人要去试试。',
    place: '南门小吃街',
    distanceM: 180,
    durationMin: 25,
    expected: 2,
    joined: 1,
    mapX: 46,
    mapY: 54,
  }

  function openTask(t: Task) {
    setActiveV2(activityFromLegacyTask(t))
    setOverlay('v2-detail')
  }
  function accept(t: Task) {
    setActiveV2(activityFromLegacyTask(t))
    setOverlay('v2-request')
  }
  function openTaskV2(task: ActivityTaskV2) {
    setActiveV2(task)
    setOverlay('v2-detail')
  }

  function finishOnboarding() {
    setOnboarded(true)
    setIntroScreen('done')
    if (dadaEventTimer.current) window.clearTimeout(dadaEventTimer.current)
    dadaEventTimer.current = window.setTimeout(() => {
      setDadaEventReady(true)
    }, 5000)
  }

  function finishV2Onboarding(draft: OnboardingProfileDraft) {
    setGeneratedProfile(draft.generatedProfile)
    setIntroScreen('reveal')
  }

  function changeTab(next: Tab) {
    setTab(next)
    if (next === 'companion' && dadaEventReady) {
      setDadaEventOpened(true)
    }
  }

  // 首次进入：V2 splash + structured onboarding + reveal
  if (!onboarded) {
    return (
      <PhoneFrame>
        {introScreen === 'splash' && <Splash onContinue={() => setIntroScreen('onboarding')} />}
        {introScreen === 'onboarding' && <OnboardingV2 onDone={finishV2Onboarding} />}
        {introScreen === 'reveal' && <ProfileReveal profile={generatedProfile} onDone={finishOnboarding} />}
        {introScreen === 'done' && <Onboarding onDone={finishOnboarding} />}
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      {/* 全屏覆盖流程 */}
      {overlay === 'shake' && (
        <ShakeBuddy onClose={() => setOverlay(null)} onPublished={() => setOverlay(null)} />
      )}
      {overlay === 'v2-detail' && activeV2 && (
        <TaskDetailV2 task={activeV2} onBack={() => setOverlay(null)} onRequest={() => setOverlay('v2-request')} />
      )}
      {overlay === 'v2-request' && activeV2 && (
        <RequestMatchingV2 task={activeV2} onMatched={() => setOverlay('v2-match-chat')} />
      )}
      {overlay === 'v2-match-chat' && activeV2 && (
        <MatchChatV2 task={activeV2} onBack={() => setOverlay(null)} onMeet={() => setOverlay('v2-meeting')} />
      )}
      {overlay === 'v2-meeting' && activeV2 && (
        <MeetingV2
          task={activeV2}
          onFinish={() => {
            setOverlay(null)
            setTab('buddies')
          }}
        />
      )}
      {overlay === 'profile' && (
        <ProfileV2
          onBack={() => setOverlay(null)}
          onOpenBuddy={() => {
            setOverlay(null)
            setTab('buddies')
          }}
        />
      )}

      {/* Tab 主框架 */}
      {!overlay && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col">
            {tab === 'home' && (
              <Explore
                onShake={() => setOverlay('shake')}
                onOpenProfile={() => setOverlay('profile')}
                onOpenTask={openTaskV2}
              />
            )}
            {tab === 'pending' && (
              <PendingV2
                onOpenTask={openTask}
                onAccept={accept}
                onGoHome={() => setTab('home')}
              />
            )}
            {tab === 'companion' && (
              <CompanionV2
                onPost={() => setOverlay('shake')}
                recommendedTask={dadaEventOpened ? dadaRecommendedTask : null}
                onOpenTask={openTask}
              />
            )}
            {tab === 'chats' && <ChatsV2 />}
            {tab === 'buddies' && (
              <BuddiesV2
                onChat={() => setTab('chats')}
                onGoHome={() => setTab('home')}
                onOpenProfile={() => setOverlay('profile')}
              />
            )}
          </div>
          <TabBar
            active={tab}
            onChange={changeTab}
            pendingBadge={pendingBadge}
            chatBadge={chatBadge}
            companionPulse={dadaEventReady && !dadaEventOpened}
          />
        </div>
      )}
    </PhoneFrame>
  )
}

function activityFromLegacyTask(task: Task): ActivityTaskV2 {
  return {
    id: `legacy-${task.id}`,
    title: task.title,
    activityNodeId: activityNodeFromTask(task),
    hostProfileId: task.host.id,
    hostAlias: `${task.host.college}${task.host.grade}`,
    hostPhotoUrl: legacyHostPhoto(task.host.id),
    hostMatchReason: legacyHostMatchReason(task),
    place: task.place,
    fuzzyArea: task.place.includes('南') ? '南区附近' : task.place.includes('图书馆') ? '教学区' : '校园附近',
    startsAtLabel: task.whenLabel,
    expiresAtLabel: task.whenLabel === '现在' ? `剩 ${task.durationMin} 分钟` : '48 小时内消失',
    expiresInSec: task.whenLabel === '现在' ? task.durationMin * 60 : 48 * 60 * 60,
    desiredGroupSize: task.expected,
    currentGroupSize: task.joined,
    desiredPersonHint: task.threshold ?? task.desc ?? '想找一个时间刚好的人',
    compatibilityReason: task.desc ?? '这个活动和你的兴趣、时间或位置刚好有一点重叠。',
    locked: false,
    mapX: task.mapX,
    mapY: task.mapY,
  }
}

function activityNodeFromTask(task: Task) {
  if (task.title.includes('咖啡')) return 'coffee'
  if (task.title.includes('图书馆') || task.title.includes('自习')) return 'library-study'
  if (task.title.includes('跑')) return 'running'
  if (task.title.includes('琴') || task.title.includes('钢琴')) return 'piano'
  if (task.title.includes('网球')) return 'tennis'
  return task.kind === 'skill' ? 'music' : 'city-walk'
}

function legacyHostPhoto(userId: string) {
  const photos: Record<string, string> = {
    u1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    u2: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=240&q=80',
    u3: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    u4: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    u5: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
  }
  return photos[userId] ?? photos.u1
}

function legacyHostMatchReason(task: Task) {
  if (task.title.includes('咖啡')) return 'TA 的资料里也有咖啡和短时间出门，和你的低压力偏好很接近。'
  if (task.title.includes('图书馆')) return 'TA 想找安静但能互相督促的人，和你的自习倾向刚好重叠。'
  if (task.title.includes('跑')) return '这个局不卷配速，更像互相拉一把出门，适合轻量加入。'
  if (task.title.includes('琴')) return 'TA 接受旁听或翻谱，你的音乐兴趣可以自然接上。'
  return 'TA 的时间、距离和活动偏好，和你现在的雷达有明显重叠。'
}

