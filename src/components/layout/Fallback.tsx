export function Fallback({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-space p-8 text-center">
      <div className="max-w-md">
        <p className="font-mono text-xs tracking-[0.3em] text-gold">BEYOND THE MISSION</p>
        <p className="mt-4 text-lg text-white/90">{message}</p>
        <p className="mt-2 text-sm text-white/50">
          Try a recent desktop browser with hardware acceleration enabled.
        </p>
      </div>
    </div>
  )
}
