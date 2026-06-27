export type GenderOption = 'female' | 'male' | 'nonbinary' | 'prefer_not_to_say'
export type MbtiDimension = 'EI' | 'SN' | 'TF' | 'JP'
export type MbtiChoice = 'first' | 'second' | 'unknown'

export type InterestLevel =
  | 'interested'
  | 'willing_to_try'
  | 'beginner'
  | 'skilled'
  | 'very_good'
  | 'obsessed'

export interface School {
  id: string
  name: string
  city: string
  colleges: College[]
}

export interface College {
  id: string
  name: string
}

export interface ProfileBasics {
  gender: GenderOption | null
  grade: string
  schoolId: string
  collegeId: string
  major: string
  mbti: Record<MbtiDimension, MbtiChoice>
}

export interface InterestNode {
  id: string
  label: string
  description?: string
  children?: InterestNode[]
}

export interface InterestSelection {
  nodeId: string
  path: string[]
  level: InterestLevel
}

export interface DesiredPeople {
  activityNodeIds: string[]
  peopleNodeIds: string[]
  freeform: string
}

export interface SelfIntroAnswers {
  recentInterest: string
  lookingForwardTo: string
  proudOf: string
  describeSelf: string
  funFacts: string
  extra: string
}

export interface GeneratedProfile {
  headline: string
  summary: string
  matchingIntent: string
  coreTags: string[]
  secondaryTags: string[]
}

export interface OnboardingProfileDraft {
  basics: ProfileBasics
  interests: InterestSelection[]
  desiredPeople: DesiredPeople
  selfIntro: SelfIntroAnswers
  generatedProfile: GeneratedProfile | null
}

export interface ActivityTaskV2 {
  id: string
  title: string
  activityNodeId: string
  hostProfileId: string
  hostAlias: string
  hostPhotoUrl?: string
  hostMatchReason?: string
  place: string
  fuzzyArea: string
  startsAtLabel: string
  expiresAtLabel: string
  expiresInSec?: number
  desiredGroupSize: number
  currentGroupSize: number
  desiredPersonHint: string
  compatibilityReason: string
  locked: boolean
  mapX: number
  mapY: number
}

export type MatchPermissionKind = 'reveal_avatar' | 'open_chat' | 'confirm_place' | 'change_time'
export type MatchPermissionStatus = 'pending' | 'accepted' | 'declined'

export interface MatchPermissionRequest {
  id: string
  kind: MatchPermissionKind
  status: MatchPermissionStatus
  requestedBy: 'me' | 'other'
}

export interface MatchV2 {
  id: string
  taskId: string
  otherProfileId: string
  status: 'waiting' | 'matched' | 'meeting' | 'finished' | 'expired'
  permissions: MatchPermissionRequest[]
}
