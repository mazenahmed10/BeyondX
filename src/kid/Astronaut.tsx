import type { GuideMood } from '../app/storyStore'

interface Props {
  talking: boolean
  size?: number
  /** Expression. 'talk' only animates the mouth; it is NOT lip-synced to any recording. */
  mood?: GuideMood
}

/** Cosmo, the Kids Mode guide. Pure SVG + CSS: idle float, speaking, listening, cheering, oops. */
export function Astronaut({ talking, size = 120, mood = 'idle' }: Props) {
  const cheer = mood === 'cheer'
  const listen = mood === 'listen'
  const oops = mood === 'oops'
  const speaking = talking || mood === 'talk'
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={`astro-float ${cheer ? 'astro-cheer' : ''} ${listen ? 'astro-listen' : ''}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="visor" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#7be0ff" />
          <stop offset="1" stopColor="#2a2f8f" />
        </radialGradient>
      </defs>
      <line x1="100" y1="14" x2="100" y2="34" stroke="#ff7ab8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="12" r="8" fill="#ffd24a" className={cheer || listen ? 'astro-blink' : ''} />
      <rect x="45" y="120" width="110" height="90" rx="38" fill="#ff9d5c" />
      <rect x="62" y="125" width="76" height="82" rx="30" fill="#fff" />
      <circle cx="100" cy="160" r="9" fill="#7be0ff" />
      <circle cx="100" cy="185" r="5" fill="#ff7ab8" />
      <rect x="55" y="200" width="30" height="28" rx="12" fill="#fff" />
      <rect x="115" y="200" width="30" height="28" rx="12" fill="#fff" />
      {/* right arm: waves when idle, shoots up when cheering */}
      <g className={cheer ? '' : 'astro-wave'} transform={cheer ? 'rotate(-28 140 130)' : undefined}>
        <rect x="136" y="118" width="46" height="24" rx="12" fill="#fff" transform="rotate(-35 140 130)" />
        <circle cx="176" cy="104" r="12" fill="#ffd24a" />
      </g>
      {/* left arm: down when idle, up when cheering, cupped to the helmet when listening */}
      {cheer ? (
        <g transform="rotate(28 60 130)">
          <rect x="18" y="118" width="46" height="24" rx="12" fill="#fff" transform="rotate(35 60 130)" />
          <circle cx="24" cy="104" r="12" fill="#ffd24a" />
        </g>
      ) : listen ? (
        <g>
          <rect x="20" y="104" width="46" height="24" rx="12" fill="#fff" transform="rotate(48 60 126)" />
          <circle cx="40" cy="92" r="12" fill="#ffd24a" />
        </g>
      ) : (
        <rect x="22" y="128" width="46" height="24" rx="12" fill="#fff" transform="rotate(25 62 140)" />
      )}
      <circle cx="100" cy="76" r="58" fill="#fff" stroke="#c9d6ff" strokeWidth="4" />
      <ellipse cx="100" cy="80" rx="44" ry="38" fill="url(#visor)" />
      <ellipse cx="82" cy="62" rx="12" ry="6" fill="#fff" opacity=".5" />
      {cheer ? (
        <>
          <path d="M76 80 q8 -10 16 0" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M108 80 q8 -10 16 0" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="84" cy="78" r={listen ? 8.5 : 7} fill="#fff" />
          <circle cx={listen ? 82 : 86} cy={oops ? 82 : 79} r="3.5" fill="#1b1b4b" />
          <circle cx="116" cy="78" r={listen ? 8.5 : 7} fill="#fff" />
          <circle cx={listen ? 114 : 118} cy={oops ? 82 : 79} r="3.5" fill="#1b1b4b" />
        </>
      )}
      <circle cx="72" cy="92" r="6" fill="#ff7ab8" opacity=".7" />
      <circle cx="128" cy="92" r="6" fill="#ff7ab8" opacity=".7" />
      {cheer ? (
        <path d="M88 92 q12 14 24 0 z" fill="#ff5c8a" />
      ) : oops ? (
        <ellipse cx="100" cy="97" rx="6" ry="6" fill="#ff5c8a" />
      ) : listen ? (
        <path d="M92 96 q8 5 16 0" stroke="#ff5c8a" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="100" cy="95" rx="9" ry="5" fill="#ff5c8a" className={speaking ? 'astro-mouth' : ''} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      )}
      {oops && <path d="M146 44 q7 12 0 18 q-7 -6 0 -18z" fill="#7be0ff" stroke="#fff" strokeWidth="2" />}
      {listen && (
        <text x="158" y="52" fontSize="40" fontWeight="800" fill="#ffd24a" className="astro-blink">
          ?
        </text>
      )}
      {cheer && (
        <g fill="#ffd24a" className="astro-blink">
          <path d="M30 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
          <path d="M170 28l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
        </g>
      )}
    </svg>
  )
}
