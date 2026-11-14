import { useMemo } from 'react'

const COLORS = ['#ff7ab8', '#ffd24a', '#7be0ff', '#a58bff', '#7dffb0', '#ff9d5c']

/** Light, short confetti burst for Kids Mode. Re-mount (change `burst`) to fire again. CSS-only animation. */
export function Confetti({ burst }: { burst: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: 8 + Math.random() * 84,
        dx: (Math.random() - 0.5) * 160,
        rot: (Math.random() - 0.5) * 900,
        delay: Math.random() * 0.18,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burst],
  )
  if (burst === 0) return null
  return (
    <div key={burst} className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            ['--dx' as string]: `${p.dx}px`,
            ['--rot' as string]: `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  )
}
