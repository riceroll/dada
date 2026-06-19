import type { ReactNode } from 'react'

// 桌面端用手机外框包裹，移动端直接全屏
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-0 sm:p-6">
      <div
        className="relative bg-cream overflow-hidden w-full h-[100dvh] sm:h-[860px] sm:max-h-[calc(100dvh-3rem)] sm:w-[400px] sm:rounded-[44px] sm:shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:border-[10px] sm:border-black"
      >
        {/* 顶部刘海（仅桌面） */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 z-50 w-32 h-6 bg-black rounded-b-2xl" />
        <div className="h-full w-full flex flex-col">{children}</div>
      </div>
    </div>
  )
}
