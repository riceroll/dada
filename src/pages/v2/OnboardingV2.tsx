import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, WandSparkles } from 'lucide-react'
import { onboardingTaxonomy } from '../../data/onboardingTaxonomy'
import { gradeOptions, pilotSchools } from '../../data/schools'
import { generateProfileSummary } from '../../services/profileSummary'
import type {
  GenderOption,
  InterestLevel,
  InterestSelection,
  MbtiDimension,
  OnboardingProfileDraft,
} from '../../types/profile'

const mbtiOptions: { id: MbtiDimension; first: string; second: string; unknown: string }[] = [
  { id: 'EI', first: 'E', second: 'I', unknown: '不确定' },
  { id: 'SN', first: 'S', second: 'N', unknown: '不确定' },
  { id: 'TF', first: 'T', second: 'F', unknown: '不确定' },
  { id: 'JP', first: 'J', second: 'P', unknown: '不确定' },
]

const levelForCategory: InterestLevel = 'interested'
const levelForLeaf: InterestLevel = 'willing_to_try'

interface OnboardingV2Props {
  onDone: (draft: OnboardingProfileDraft) => void
}

export default function OnboardingV2({ onDone }: OnboardingV2Props) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<OnboardingProfileDraft>({
    basics: {
      gender: null,
      grade: '',
      schoolId: pilotSchools[0].id,
      collegeId: pilotSchools[0].colleges[0].id,
      major: '',
      mbti: { EI: 'unknown', SN: 'unknown', TF: 'unknown', JP: 'unknown' },
    },
    interests: [],
    desiredPeople: { activityNodeIds: [], peopleNodeIds: [], freeform: '' },
    selfIntro: {
      recentInterest: '',
      lookingForwardTo: '',
      proudOf: '',
      describeSelf: '',
      funFacts: '',
      extra: '',
    },
    generatedProfile: null,
  })

  const selectedSchool = useMemo(
    () => pilotSchools.find((school) => school.id === draft.basics.schoolId) ?? pilotSchools[0],
    [draft.basics.schoolId],
  )
  const activeInterestIds = new Set(draft.interests.map((interest) => interest.nodeId))
  const selectedCategories = onboardingTaxonomy.filter((node) => activeInterestIds.has(node.id))
  const completion = ((step + 1) / 5) * 100

  function updateBasics(next: Partial<OnboardingProfileDraft['basics']>) {
    setDraft((current) => ({ ...current, basics: { ...current.basics, ...next } }))
  }

  function toggleInterest(nodeId: string, path: string[], level: InterestLevel) {
    setDraft((current) => {
      const exists = current.interests.some((interest) => interest.nodeId === nodeId)
      return {
        ...current,
        interests: exists
          ? current.interests.filter((interest) => interest.nodeId !== nodeId)
          : [...current.interests, { nodeId, path, level }],
      }
    })
  }

  function toggleDesired(nodeId: string) {
    setDraft((current) => {
      const exists = current.desiredPeople.activityNodeIds.includes(nodeId)
      return {
        ...current,
        desiredPeople: {
          ...current.desiredPeople,
          activityNodeIds: exists
            ? current.desiredPeople.activityNodeIds.filter((id) => id !== nodeId)
            : [...current.desiredPeople.activityNodeIds, nodeId],
        },
      }
    })
  }

  function canContinue() {
    if (step === 0) {
      return Boolean(
        draft.basics.gender &&
          draft.basics.grade &&
          draft.basics.schoolId &&
          draft.basics.collegeId &&
          draft.basics.major.trim(),
      )
    }
    if (step === 1) return draft.interests.length >= 3
    if (step === 2) return draft.desiredPeople.activityNodeIds.length > 0 || draft.desiredPeople.freeform.trim()
    if (step === 3) return Boolean(draft.selfIntro.describeSelf.trim() || draft.selfIntro.recentInterest.trim())
    return true
  }

  function next() {
    if (step === 3) {
      setDraft((current) => ({ ...current, generatedProfile: generateProfileSummary(current) }))
      setStep(4)
      return
    }
    if (step === 4) {
      const generatedProfile = draft.generatedProfile ?? generateProfileSummary(draft)
      onDone({ ...draft, generatedProfile })
      return
    }
    setStep((value) => value + 1)
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[#f7f2eb] px-5 pb-safe-b pt-safe-t text-[#1f1b18]">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1b18]/10 bg-white/60 text-[#1f1b18] disabled:opacity-0"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-medium text-[#7a7068]">{step + 1} / 5</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#1f1b18]/8">
          <div className="h-full rounded-full bg-[#1f1b18] transition-all" style={{ width: `${completion}%` }} />
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto py-7 no-scrollbar">
        {step === 0 && (
          <div className="space-y-7">
            <StepTitle eyebrow="Profile seed" title="先让哒哒知道你是谁。" desc="这些信息会用于校内匹配，不会在匹配前完整展示给别人。" />
            <FieldGroup label="性别">
              <SegmentedOptions
                value={draft.basics.gender ?? ''}
                options={[
                  { id: 'female', label: '女' },
                  { id: 'male', label: '男' },
                  { id: 'prefer_not_to_say', label: '先不说' },
                ]}
                onSelect={(gender) => updateBasics({ gender: gender as GenderOption })}
              />
            </FieldGroup>
            <FieldGroup label="年级">
              <ChipGrid
                selectedIds={[draft.basics.grade]}
                items={gradeOptions.map((grade) => ({ id: grade, label: grade }))}
                onToggle={(grade) => updateBasics({ grade })}
              />
            </FieldGroup>
            <FieldGroup label="学校和学院">
              <select
                value={draft.basics.schoolId}
                onChange={(event) => {
                  const school = pilotSchools.find((item) => item.id === event.target.value) ?? pilotSchools[0]
                  updateBasics({ schoolId: school.id, collegeId: school.colleges[0].id })
                }}
                className="h-12 w-full rounded-2xl border border-[#1f1b18]/10 bg-white/70 px-4 text-sm outline-none"
              >
                {pilotSchools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <select
                value={draft.basics.collegeId}
                onChange={(event) => updateBasics({ collegeId: event.target.value })}
                className="mt-3 h-12 w-full rounded-2xl border border-[#1f1b18]/10 bg-white/70 px-4 text-sm outline-none"
              >
                {selectedSchool.colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </FieldGroup>
            <FieldGroup label="专业">
              <TextInput value={draft.basics.major} onChange={(major) => updateBasics({ major })} placeholder="比如：工业设计 / 计算机 / 新闻" />
            </FieldGroup>
            <FieldGroup label="MBTI，不确定就选不确定">
              <div className="space-y-3">
                {mbtiOptions.map((item) => (
                  <SegmentedOptions
                    key={item.id}
                    value={draft.basics.mbti[item.id]}
                    options={[
                      { id: 'first', label: item.first },
                      { id: 'second', label: item.second },
                      { id: 'unknown', label: item.unknown },
                    ]}
                    onSelect={(choice) =>
                      updateBasics({ mbti: { ...draft.basics.mbti, [item.id]: choice as 'first' | 'second' | 'unknown' } })
                    }
                  />
                ))}
              </div>
            </FieldGroup>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-7">
            <StepTitle eyebrow="Taste graph" title="你平时会被什么吸引？" desc="先选大类，再点开你具体想找人一起做、或者很擅长的事。" />
            <div className="grid grid-cols-2 gap-3">
              {onboardingTaxonomy.map((node) => (
                <button
                  type="button"
                  key={node.id}
                  onClick={() => toggleInterest(node.id, [node.id], levelForCategory)}
                  className={`rounded-[22px] border p-4 text-left transition ${
                    activeInterestIds.has(node.id)
                      ? 'border-[#1f1b18] bg-[#1f1b18] text-white shadow-[0_18px_35px_rgba(31,27,24,0.16)]'
                      : 'border-[#1f1b18]/10 bg-white/65 text-[#1f1b18]'
                  }`}
                >
                  <span className="text-sm font-semibold leading-5">{node.label}</span>
                </button>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <div className="space-y-5">
                {selectedCategories.map((category) => (
                  <FieldGroup key={category.id} label={category.label}>
                    <ChipGrid
                      selectedIds={draft.interests.map((interest) => interest.nodeId)}
                      items={(category.children ?? []).map((child) => ({ id: child.id, label: child.label }))}
                      onToggle={(nodeId) => toggleInterest(nodeId, [category.id, nodeId], levelForLeaf)}
                    />
                  </FieldGroup>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-7">
            <StepTitle eyebrow="People radar" title="你会想遇到哪种人？" desc="可以是同好，也可以是技能互补的人。先给哒哒一点方向。" />
            <FieldGroup label="想遇到也喜欢这些事的人">
              <ChipGrid
                selectedIds={draft.desiredPeople.activityNodeIds}
                items={draft.interests.slice(0, 16).map((interest) => ({ id: interest.nodeId, label: labelForInterest(interest) }))}
                onToggle={toggleDesired}
              />
            </FieldGroup>
            <FieldGroup label="一句话描述一下更准">
              <TextArea
                value={draft.desiredPeople.freeform}
                onChange={(freeform) =>
                  setDraft((current) => ({
                    ...current,
                    desiredPeople: { ...current.desiredPeople, freeform },
                  }))
                }
                placeholder="比如：想认识能一起探店但不尬聊的人，或者会摄影、愿意互拍的人。"
              />
            </FieldGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-7">
            <StepTitle eyebrow="Voice" title="最后，让资料像你本人。" desc="不用写得很正式。短一点、具体一点，反而更容易被对的人接住。" />
            <PromptInput label="最近最上头的事" value={draft.selfIntro.recentInterest} onChange={(recentInterest) => setDraft((current) => ({ ...current, selfIntro: { ...current.selfIntro, recentInterest } }))} />
            <PromptInput label="最近最期待的事" value={draft.selfIntro.lookingForwardTo} onChange={(lookingForwardTo) => setDraft((current) => ({ ...current, selfIntro: { ...current.selfIntro, lookingForwardTo } }))} />
            <PromptInput label="有点得意的一件事" value={draft.selfIntro.proudOf} onChange={(proudOf) => setDraft((current) => ({ ...current, selfIntro: { ...current.selfIntro, proudOf } }))} />
            <PromptInput label="怎么描述自己" value={draft.selfIntro.describeSelf} onChange={(describeSelf) => setDraft((current) => ({ ...current, selfIntro: { ...current.selfIntro, describeSelf } }))} />
            <PromptInput label="奇怪但真实的小事实" value={draft.selfIntro.funFacts} onChange={(funFacts) => setDraft((current) => ({ ...current, selfIntro: { ...current.selfIntro, funFacts } }))} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-7">
            <StepTitle eyebrow="Generated profile" title="哒哒先拼了一版你。" desc="这只是草稿，之后会接真正的 AI profile 生成。现在你可以先看匹配方向准不准。" />
            <div className="rounded-[30px] border border-[#1f1b18]/10 bg-white/75 p-5 shadow-[0_24px_60px_rgba(31,27,24,0.08)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f1b18] text-white">
                  <WandSparkles size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a7e74]">Preview</p>
                  <h2 className="text-lg font-semibold">{draft.generatedProfile?.headline}</h2>
                </div>
              </div>
              <p className="text-[15px] leading-7 text-[#3a332e]">{draft.generatedProfile?.summary}</p>
              <div className="mt-5 rounded-2xl bg-[#f7f2eb] p-4 text-sm leading-6 text-[#5f5750]">
                {draft.generatedProfile?.matchingIntent}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {draft.generatedProfile?.coreTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#1f1b18] px-3 py-1.5 text-xs font-medium text-white">
                    {tag}
                  </span>
                ))}
                {draft.generatedProfile?.secondaryTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#1f1b18]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#5f5750]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="pt-3">
        <button
          type="button"
          disabled={!canContinue()}
          onClick={next}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1f1b18] text-[15px] font-semibold text-white shadow-[0_18px_45px_rgba(31,27,24,0.18)] transition disabled:cursor-not-allowed disabled:bg-[#c8beb5] disabled:shadow-none"
        >
          {step === 4 ? '进入搭搭' : step === 3 ? '生成我的资料' : '继续'}
          <ArrowRight size={17} />
        </button>
      </footer>
    </main>
  )
}

function StepTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7e74]">{eyebrow}</p>
      <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#1f1b18]">{title}</h1>
      <p className="text-[15px] leading-7 text-[#5f5750]">{desc}</p>
    </div>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-[#3a332e]">{label}</h2>
      {children}
    </section>
  )
}

function SegmentedOptions({ value, options, onSelect }: { value: string; options: { id: string; label: string }[]; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[18px] border border-[#1f1b18]/10 bg-white/60 p-1.5">
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`h-10 rounded-[14px] text-sm font-medium transition ${
            value === option.id ? 'bg-[#1f1b18] text-white shadow-[0_10px_25px_rgba(31,27,24,0.18)]' : 'text-[#6f655d]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function ChipGrid({ selectedIds, items, onToggle }: { selectedIds: string[]; items: { id: string; label: string }[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const selected = selectedIds.includes(item.id)
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              selected
                ? 'border-[#1f1b18] bg-[#1f1b18] text-white'
                : 'border-[#1f1b18]/10 bg-white/70 text-[#514941]'
            }`}
          >
            {selected && <Check size={14} strokeWidth={3} />}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-12 w-full rounded-2xl border border-[#1f1b18]/10 bg-white/70 px-4 text-sm outline-none placeholder:text-[#a89d94]"
    />
  )
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={5}
      className="w-full resize-none rounded-2xl border border-[#1f1b18]/10 bg-white/70 px-4 py-3 text-sm leading-6 outline-none placeholder:text-[#a89d94]"
    />
  )
}

function PromptInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <FieldGroup label={label}>
      <TextArea value={value} onChange={onChange} placeholder="写一句就够，越具体越好。" />
    </FieldGroup>
  )
}

function labelForInterest(selection: InterestSelection) {
  return selection.nodeId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
