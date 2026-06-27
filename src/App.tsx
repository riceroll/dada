import { useRef, useState } from 'react'
import type { Task } from './types'
import type { GeneratedProfile, OnboardingProfileDraft } from './types/profile'
import PhoneFrame from './components/PhoneFrame'
import TabBar, { type Tab } from './components/TabBar'
import PostTask from './pages/PostTask'
import TaskDetail from './pages/TaskDetail'
import InProgress from './pages/InProgress'
import Pending from './pages/Pending'
import Chats from './pages/Chats'
import Buddies from './pages/Buddies'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import Companion from './pages/Companion'
import Matching from './pages/Matching'
import Splash from './pages/v2/Splash'
import OnboardingV2 from './pages/v2/OnboardingV2'
import ProfileReveal from './pages/v2/ProfileReveal'
import Explore from './pages/v2/Explore'
import ShakeBuddy from './pages/v2/ShakeBuddy'
import { pendingTasks, chatThreads, tasks } from './data'

// 覆盖在 Tab 之上的全屏流程
type Overlay = 'post' | 'shake' | 'detail' | 'matching' | 'progress' | 'profile' | null
type IntroScreen = 'splash' | 'onboarding' | 'reveal' | 'done'

export default function App() {
  const [onboarded, setOnboarded] = useState(false)
  const [introScreen, setIntroScreen] = useState<IntroScreen>('splash')
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [active, setActive] = useState<Task | null>(null)
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
    setActive(t)
    setOverlay('detail')
  }
  function accept(t: Task) {
    setActive(t)
    setOverlay('matching')
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
      {overlay === 'post' && (
        <PostTask onClose={() => setOverlay(null)} onPublished={() => setOverlay(null)} />
      )}
      {overlay === 'shake' && (
        <ShakeBuddy onClose={() => setOverlay(null)} onPublished={() => setOverlay(null)} />
      )}
      {overlay === 'detail' && active && (
        <TaskDetail task={active} onBack={() => setOverlay(null)} onAccepted={accept} />
      )}
      {overlay === 'matching' && active && (
        <Matching task={active} onMatched={() => setOverlay('progress')} />
      )}
      {overlay === 'progress' && active && (
        <InProgress
          task={active}
          onFinish={() => {
            setOverlay(null)
            setTab('buddies')
          }}
        />
      )}
      {overlay === 'profile' && (
        <Profile
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
              <Explore onShake={() => setOverlay('shake')} onOpenProfile={() => setOverlay('profile')} />
            )}
            {tab === 'pending' && (
              <Pending
                onOpenTask={openTask}
                onAccept={accept}
                onGoHome={() => setTab('home')}
              />
            )}
            {tab === 'companion' && (
              <Companion
                onPost={() => setOverlay('post')}
                recommendedTask={dadaEventOpened ? dadaRecommendedTask : null}
                onOpenTask={openTask}
              />
            )}
            {tab === 'chats' && <Chats />}
            {tab === 'buddies' && (
              <Buddies
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

