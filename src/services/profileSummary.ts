import type { GeneratedProfile, OnboardingProfileDraft } from '../types/profile'
import { flattenInterestNodes, onboardingTaxonomy } from '../data/onboardingTaxonomy'

const nodeLookup = new Map(
  flattenInterestNodes(onboardingTaxonomy).map(({ node }) => [node.id, node.label]),
)

function labelsFor(nodeIds: string[]) {
  return nodeIds
    .map((nodeId) => nodeLookup.get(nodeId))
    .filter((label): label is string => Boolean(label))
}

export function generateProfileSummary(draft: OnboardingProfileDraft): GeneratedProfile {
  const selectedLabels = labelsFor(draft.interests.map((selection) => selection.nodeId))
  const desiredLabels = labelsFor([
    ...draft.desiredPeople.activityNodeIds,
    ...draft.desiredPeople.peopleNodeIds,
  ])
  const coreTags = selectedLabels.slice(0, 4)
  const secondaryTags = selectedLabels.slice(4, 10)
  const strongestSelfIntro =
    draft.selfIntro.describeSelf ||
    draft.selfIntro.recentInterest ||
    draft.selfIntro.lookingForwardTo ||
    '想找一些能一起把小事做掉的人'

  return {
    headline: coreTags.length > 0 ? `${coreTags[0]}搭子雷达已开启` : '校园搭子雷达已开启',
    summary: strongestSelfIntro,
    matchingIntent:
      draft.desiredPeople.freeform ||
      (desiredLabels.length > 0
        ? `想遇到也喜欢${desiredLabels.slice(0, 3).join('、')}的人。`
        : '想遇到时间刚好、事情刚好、说话不用太费劲的人。'),
    coreTags,
    secondaryTags,
  }
}
