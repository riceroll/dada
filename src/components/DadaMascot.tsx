import { useId } from 'react'

// AI 伙伴「哒哒」—— 软糯橙色小团子，尽量在 24px 小尺寸也清楚可爱
export default function DadaMascot({
  size = 40,
  bouncing = false,
}: {
  size?: number
  bouncing?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const bodyGrad = `dada-body-${id}`
  const blushGrad = `dada-blush-${id}`

  return (
    <div
      className={`relative shrink-0 ${bouncing ? 'animate-float-bubble' : ''}`}
      style={{ width: size, height: size }}
      aria-label="哒哒"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="block overflow-visible drop-shadow-[0_6px_10px_rgba(255,138,61,0.22)]"
        role="img"
      >
        <defs>
          <linearGradient id={bodyGrad} x1="26" y1="16" x2="76" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFE3B8" />
            <stop offset="0.58" stopColor="#FFC270" />
            <stop offset="1" stopColor="#FF9A4A" />
          </linearGradient>
          <radialGradient id={blushGrad} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FF7A7A" stopOpacity="0.36" />
            <stop offset="1" stopColor="#FF7A7A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 头顶小豆豆：保留 AI 伙伴识别，但不做怪天线 */}
        <circle cx="50" cy="10" r="5" fill="#FF9A4A" />
        <path d="M50 15 C50 18 50 20 50 23" fill="none" stroke="#FF9A4A" strokeWidth="4" strokeLinecap="round" />

        {/* 主体：橙色糯米团子 */}
        <path
          d="M50 20 C70 20 84 33 85 53 C86 74 70 88 50 88 C30 88 14 74 15 53 C16 33 30 20 50 20Z"
          fill={`url(#${bodyGrad})`}
        />

        {/* 软软的脸颊轮廓高光 */}
        <path
          d="M27 36 C34 27 50 24 63 29"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.32"
        />

        {/* 额头小光点 */}
        <circle cx="66" cy="34" r="4.5" fill="#FFF9F3" opacity="0.55" />

        {/* 眼睛 */}
        <circle cx="39" cy="55" r="4.4" fill="#2B2622" />
        <circle cx="61" cy="55" r="4.4" fill="#2B2622" />
        <circle cx="37.6" cy="53.3" r="1.2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="59.6" cy="53.3" r="1.2" fill="#FFFFFF" opacity="0.95" />

        {/* 腮红 */}
        <ellipse cx="31.5" cy="65" rx="8" ry="5" fill={`url(#${blushGrad})`} />
        <ellipse cx="68.5" cy="65" rx="8" ry="5" fill={`url(#${blushGrad})`} />

        {/* 小猫嘴式微笑，比机器人面板更亲近 */}
        <path d="M45 64 C47 68 50 68 50 64 C50 68 53 68 55 64" fill="none" stroke="#7A4A2B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* 底部软阴影 */}
        <ellipse cx="50" cy="91" rx="18" ry="4" fill="#D86B2B" opacity="0.1" />
      </svg>
    </div>
  )
}
