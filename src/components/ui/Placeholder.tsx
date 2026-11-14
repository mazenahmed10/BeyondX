/**
 * Missing research data. In development it is loud (so nobody mistakes it for content);
 * in production it is a quiet, honest "awaiting data" line - never fake information.
 */
export function Placeholder({ what, file }: { what: string; file?: string }) {
  if (import.meta.env.DEV) {
    return (
      <div className="rounded-sm border border-dashed border-gold/50 bg-gold/5 p-4 text-sm text-gold/90">
        <p className="font-mono text-[10px] tracking-[0.25em]">PLACEHOLDER · DEV ONLY</p>
        <p className="mt-2">{what} — awaiting verified research data.</p>
        {file && <p className="mt-1 font-mono text-[11px] text-white/50">Edit: {file}</p>}
      </div>
    )
  }
  return <p className="text-sm italic text-white/45">{what}: awaiting verified research data.</p>
}
