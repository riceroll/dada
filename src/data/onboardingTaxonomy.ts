import type { InterestNode } from '../types/profile'

export interface FlatInterestNode {
  node: InterestNode
  path: string[]
}

export const onboardingTaxonomy: InterestNode[] = [
  {
    id: 'sports',
    label: '运动和身体状态',
    children: [
      {
        id: 'ball-sports',
        label: '球类',
        children: [
          { id: 'tennis', label: '网球' },
          { id: 'badminton', label: '羽毛球' },
          { id: 'basketball', label: '篮球' },
          { id: 'football', label: '足球' },
          { id: 'frisbee', label: '飞盘' },
          { id: 'table-tennis', label: '乒乓球' },
        ],
      },
      {
        id: 'fitness',
        label: '健身',
        children: [
          { id: 'lifting', label: '力量训练' },
          { id: 'crossfit', label: 'CrossFit' },
          { id: 'cardio', label: '有氧' },
          { id: 'pilates', label: '普拉提' },
          { id: 'yoga', label: '瑜伽' },
        ],
      },
      { id: 'running', label: '跑步' },
      { id: 'dance', label: '跳舞' },
      { id: 'climbing', label: '攀岩' },
      { id: 'swimming', label: '游泳' },
    ],
  },
  {
    id: 'music',
    label: '音乐',
    children: [
      {
        id: 'instruments',
        label: '乐器',
        children: [
          { id: 'piano', label: '钢琴' },
          { id: 'guitar', label: '吉他' },
          { id: 'violin', label: '小提琴' },
          { id: 'drums', label: '鼓' },
        ],
      },
      { id: 'singing', label: '唱歌' },
      { id: 'music-production', label: '编曲/制作' },
      { id: 'band', label: '乐队' },
      { id: 'concerts', label: '演唱会/Livehouse' },
      { id: 'musicals', label: '音乐剧' },
      { id: 'symphony', label: '交响/古典' },
      {
        id: 'kpop',
        label: 'K-pop',
        children: [
          { id: 'kpop-boy-groups', label: '男团' },
          { id: 'kpop-girl-groups', label: '女团' },
          { id: 'kpop-live', label: '打歌/演唱会' },
          { id: 'kpop-dance-cover', label: '舞蹈翻跳' },
        ],
      },
    ],
  },
  {
    id: 'arts-making',
    label: '艺术和创作',
    children: [
      { id: 'visual-art', label: '画画' },
      { id: 'design', label: '设计' },
      { id: 'photography', label: '摄影' },
      { id: 'video', label: '拍视频/剪辑' },
      { id: 'crafts', label: '手作' },
      { id: 'fashion', label: '穿搭' },
      { id: 'writing', label: '写作' },
      { id: 'architecture', label: '建筑/空间' },
      { id: 'exhibitions', label: '看展' },
    ],
  },
  {
    id: 'food-drink',
    label: '吃喝',
    children: [
      { id: 'coffee', label: '咖啡' },
      { id: 'tea', label: '茶' },
      { id: 'milk-tea', label: '奶茶' },
      { id: 'bakeries', label: '面包店' },
      { id: 'late-night-food', label: '夜宵' },
      { id: 'cooking', label: '做饭' },
      { id: 'cafe-hopping', label: '探咖啡店' },
      { id: 'new-restaurants', label: '试新店' },
    ],
  },
  {
    id: 'study-career',
    label: '学习和职业',
    children: [
      { id: 'library-study', label: '图书馆自习' },
      { id: 'language-learning', label: '语言学习' },
      { id: 'coding', label: '写代码' },
      { id: 'research', label: '科研' },
      { id: 'interview-prep', label: '面试准备' },
      { id: 'startup-building', label: '做项目/创业' },
      { id: 'internships', label: '实习求职' },
    ],
  },
  {
    id: 'city-exploration',
    label: '城市探索',
    children: [
      { id: 'city-walk', label: 'Citywalk' },
      { id: 'pop-ups', label: '快闪/市集' },
      { id: 'bookstores', label: '书店' },
      { id: 'vintage-shops', label: '中古/古着' },
      { id: 'weekend-trips', label: '周边短途' },
      { id: 'museums', label: '博物馆' },
    ],
  },
  {
    id: 'entertainment',
    label: '娱乐',
    children: [
      { id: 'movies', label: '电影' },
      { id: 'theater', label: '戏剧' },
      { id: 'stand-up', label: '脱口秀' },
      { id: 'anime-comics-games', label: 'ACG/游戏' },
      { id: 'board-games', label: '桌游' },
      { id: 'escape-rooms', label: '密室' },
    ],
  },
  {
    id: 'lifestyle-fun',
    label: '生活方式和玄学',
    children: [
      { id: 'tarot', label: '塔罗' },
      { id: 'astrology', label: '星座' },
      { id: 'personality-tests', label: '人格测试' },
      { id: 'journaling', label: '手帐/记录' },
      { id: 'mindfulness', label: '冥想/正念' },
    ],
  },
  {
    id: 'travel',
    label: '旅行',
    children: [
      { id: 'countries-visited', label: '去过的国家' },
      { id: 'countries-wanted', label: '想去的国家' },
      { id: 'hiking', label: '徒步' },
      { id: 'travel-planning', label: '做攻略' },
    ],
  },
]

export const interestLevelOptions = [
  { id: 'interested', label: '有兴趣' },
  { id: 'willing_to_try', label: '想找人试试' },
  { id: 'beginner', label: '刚入门' },
  { id: 'skilled', label: '比较会' },
  { id: 'very_good', label: '很擅长' },
  { id: 'obsessed', label: '特别喜欢' },
] as const

export function flattenInterestNodes(
  nodes: InterestNode[],
  parentPath: string[] = [],
): FlatInterestNode[] {
  return nodes.flatMap((node) => {
    const path = [...parentPath, node.id]
    return [
      { node, path },
      ...(node.children ? flattenInterestNodes(node.children, path) : []),
    ]
  })
}
