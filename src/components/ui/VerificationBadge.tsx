import type { VerificationStatus } from '../../data/missions'

const STYLE: Record<VerificationStatus, { label: string; cls: string }> = {
  verified: { label: 'VERIFIED', cls: 'border-emerald-400/50 text-emerald-300' },
  needs_verification: { label: 'NEEDS VERIFICATION', cls: 'border-gold/60 text-gold' },
  pending_research: { label: 'PENDING RESEARCH', cls: 'border-white/30 text-white/60' },
  visual_reconstruction: { label: 'VISUAL RECONSTRUCTION', cls: 'border-cyan-soft/50 text-cyan-soft' },
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const s = STYLE[status]
  return (
    <span className={`inline-block rounded-sm border px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] ${s.cls}`}>
      {s.label}
    </span>
  )
}
