// 搭搭 类型定义

export type TaskKind = 'random' | 'skill' | 'fill'

export interface User {
  id: string
  name: string
  emoji: string // 隐藏头像时用 emoji 占位
  avatarHidden: boolean // 见面前是否隐藏头像
  gender: '男' | '女'
  grade: string // 年级
  college: string // 学院
  tags: string[]
  bio: string
  credit: number // 信用分
}

export interface Task {
  id: string
  kind: TaskKind
  emoji: string
  title: string // 活动一句话
  desc?: string // 补充描述
  host: User
  place: string
  distanceM: number // 距离（米）
  whenLabel: string // "现在" / "今天 15:00" / "明天 10:00"
  durationMin: number // 预计时长
  joined: number // 已加入人数
  expected: number // 期望人数
  threshold?: string // 门槛，如 "网球 3.0+"
  // 地图坐标（百分比，相对地图容器）
  mapX: number
  mapY: number
}

// 等待中任务（"等一会儿" 列表）
export interface PendingTask {
  task: Task
  expiresInSec: number // >0 倒计时中；<=0 已过期 → "错过了"
}

// 搭搭列表里的一段关系（社交沉淀）
export interface Buddy {
  user: User
  taskEmoji: string
  taskTitle: string // 一起做过什么
  metAtLabel: string // "3 天前" / "上周三"
}

// 聊天会话（顶部带任务完成记录作为上下文）
export interface ChatThread {
  id: string
  user: User
  taskEmoji: string
  taskTitle: string
  metAtLabel: string
  lastMsg: string
  lastTimeLabel: string
  unread: number
  messages: ChatMsg[]
}

export interface ChatMsg {
  from: 'me' | 'other'
  text: string
  timeLabel: string
}

