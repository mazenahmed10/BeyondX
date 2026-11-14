import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useKidStore } from '../app/kidStore'
import { QUIZ } from './kidContent'
import { Astronaut } from './Astronaut'

function Certificate({ onClose }: { onClose: () => void }) {
  const { name, setName, stars } = useKidStore()
  const ref = useRef<SVGSVGElement>(null)
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  const ready = name.trim().length > 0

  const download = () => {
    if (!ref.current || !ready) return
    const xml = new XMLSerializer().serializeToString(ref.current)
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = 1200
      c.height = 850
      c.getContext('2d')?.drawImage(img, 0, 0, 1200, 850)
      const a = document.createElement('a')
      a.download = 'space-explorer-certificate.png'
      a.href = c.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-sm font-bold text-slate-700">
        Type your name:{' '}
        <input value={name} maxLength={28} onChange={(e) => setName(e.target.value)} className="rounded-xl border-2 border-indigo-300 px-3 py-1 font-semibold" placeholder="Space Explorer" />
      </label>
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" className="w-full max-w-xl rounded-2xl shadow-lg">
        <rect width="1200" height="850" fill="#fff8e1" />
        <rect x="30" y="30" width="1140" height="790" rx="30" fill="none" stroke="#ff7ab8" strokeWidth="14" />
        <rect x="60" y="60" width="1080" height="730" rx="20" fill="none" stroke="#7be0ff" strokeWidth="6" strokeDasharray="22 12" />
        <text x="600" y="190" textAnchor="middle" fontSize="62" fontWeight="800" fill="#3b2f8f" fontFamily="'Trebuchet MS', sans-serif">CERTIFICATE</text>
        <text x="600" y="250" textAnchor="middle" fontSize="34" fill="#ff5c8a" fontFamily="'Trebuchet MS', sans-serif">of Space Exploration</text>
        <text x="600" y="345" textAnchor="middle" fontSize="28" fill="#555" fontFamily="'Trebuchet MS', sans-serif">This certificate proudly belongs to</text>
        <text x="600" y="450" textAnchor="middle" fontSize="80" fontWeight="800" fill="#e07a3a" fontFamily="'Trebuchet MS', sans-serif">{name.trim() || '________'}</text>
        <text x="600" y="540" textAnchor="middle" fontSize="28" fill="#555" fontFamily="'Trebuchet MS', sans-serif">who finished the BEYOND THE MISSION quiz</text>
        <text x="600" y="585" textAnchor="middle" fontSize="28" fill="#555" fontFamily="'Trebuchet MS', sans-serif">and learned about robots left in space!</text>
        <text x="600" y="665" textAnchor="middle" fontSize="54" fill="#ffb400">{'★'.repeat(stars) + '☆'.repeat(QUIZ.length - stars)}</text>
        <text x="600" y="745" textAnchor="middle" fontSize="26" fill="#777" fontFamily="'Trebuchet MS', sans-serif">{date} · signed, Cosmo the Astronaut</text>
      </svg>
      <div className="flex gap-3">
        <button disabled={!ready} onClick={download} className="cursor-pointer rounded-full bg-pink-500 px-5 py-2 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">Download</button>
        <button onClick={onClose} className="cursor-pointer rounded-full bg-slate-200 px-5 py-2 font-bold text-slate-700">Close</button>
      </div>
    </div>
  )
}

export function Quiz({ onClose }: { onClose: () => void }) {
  const quizDone = useKidStore((s) => s.quizDone)
  const completeQuiz = useKidStore((s) => s.completeQuiz)
  const [i, setI] = useState(0)
  const [wrong, setWrong] = useState<number | null>(null)
  const [firstTry, setFirstTry] = useState(0)
  const [missed, setMissed] = useState(false)
  const [finished, setFinished] = useState(false)
  const q = QUIZ[i]

  const pick = (n: number) => {
    if (n !== q.answer) {
      setWrong(n)
      setMissed(true)
      return
    }
    const score = firstTry + (missed ? 0 : 1)
    setFirstTry(score)
    setWrong(null)
    setMissed(false)
    if (i + 1 < QUIZ.length) setI(i + 1)
    else {
      completeQuiz(score)
      setFinished(true)
    }
  }

  // The certificate is only reachable once quizDone is true (set after the last question).
  const showCert = quizDone && (finished || i === 0)

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-linear-to-b from-sky-100 to-pink-100 p-6 text-slate-800 shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 cursor-pointer text-slate-500"><X /></button>
        {showCert ? (
          <>
            <h2 className="mb-3 text-center text-2xl font-extrabold text-indigo-700">🎉 You did it, explorer!</h2>
            <Certificate onClose={onClose} />
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Astronaut talking={false} size={70} />
              <div>
                <h2 className="text-xl font-extrabold text-indigo-700">Space Quiz</h2>
                <p className="text-sm font-semibold">Question {i + 1} of {QUIZ.length}. Answer all of them to unlock your certificate!</p>
              </div>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-pink-400 transition-all" style={{ width: `${(i / QUIZ.length) * 100}%` }} /></div>
            <p className="mt-5 text-lg font-bold">{q.q}</p>
            <div className="mt-3 grid gap-2">
              {q.options.map((o, n) => (
                <button key={o} onClick={() => pick(n)} className={`cursor-pointer rounded-2xl border-2 px-4 py-3 text-left font-semibold ${wrong === n ? 'border-red-400 bg-red-100' : 'border-indigo-200 bg-white hover:bg-indigo-50'}`}>{o}</button>
              ))}
            </div>
            {wrong !== null && <p className="mt-3 rounded-xl bg-amber-100 p-3 text-sm font-bold">Oops, try again! Hint: {q.hint}</p>}
          </>
        )}
      </div>
    </div>
  )
}
