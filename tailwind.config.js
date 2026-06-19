/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        // 安全区域：env() 提供 0px 兜底，桌面回退到 base，真机取刘海/home条高度
        'safe-t': 'max(3rem, env(safe-area-inset-top, 0px))',
        'safe-b': 'max(1.75rem, env(safe-area-inset-bottom, 0px))',
      },
      colors: {
        // 主色：暖橙 / 珊瑚黄
        brand: {
          DEFAULT: '#FF8A3D',
          light: '#FFB454',
          soft: '#FFE3CC',
        },
        cream: '#FFF9F3', // 全局暖白背景
        ink: '#2B2622', // 暖黑正文
        mute: '#9B9189', // 次要文字
        // 三类任务点缀
        task: {
          random: '#FF8A3D', // 随机=橙
          skill: '#3DBFA0', // 技能=青绿
          fill: '#8B7DF0', // 补位=紫
        },
      },
      borderRadius: {
        card: '20px',
        field: '16px',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(255,138,61,0.12)',
        float: '0 12px 32px rgba(255,138,61,0.18)',
      },
      fontFamily: {
        sans: ['PingFang SC', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
        'float-bubble': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 0.35s ease-out',
        'float-bubble': 'float-bubble 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
